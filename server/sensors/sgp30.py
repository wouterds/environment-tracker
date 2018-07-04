#!/usr/bin/python
# -*- coding: utf-8 -*-
# 2018 / MIT / Tim Clem / github.com/misterfifths
# See LICENSE for details
# Heavily inspired by the Adafruit CircuitPython implementation by ladyada:
# https://github.com/adafruit/Adafruit_CircuitPython_SGP30
# CRC implementation taken entirely from there, in fact.

from __future__ import print_function

from smbus import SMBus
from collections import namedtuple
from time import sleep
import struct
from threading import Lock
from sys import stderr
from math import modf
from datetime import datetime
import redis
import json

SGP30Command = namedtuple(
    'SGP30Command',
    'opcode_bytes required_feature_set parameter_length response_length response_time_ms')


_SGP30_CMDS = {
    'get_serial_number':       SGP30Command([0x36, 0x82], None, 0, 9, 1),
    'get_feature_set_version': SGP30Command((0x20, 0x2f), None, 0, 3, 2),

    'init_air_quality':     SGP30Command((0x20, 0x03), 0x20, 0, 0, 10),
    'measure_air_quality':  SGP30Command((0x20, 0x08), 0x20, 0, 6, 12),
    'get_baseline':         SGP30Command((0x20, 0x15), 0x20, 0, 6, 10),
    'set_baseline':         SGP30Command((0x20, 0x1e), 0x20, 6, 0, 10),
    'set_humidity':         SGP30Command((0x20, 0x61), 0x20, 3, 0, 10),
    'measure_raw_signals':  SGP30Command((0x20, 0x50), 0x20, 0, 6, 25)
}

_SGP30_CRC_INIT = 0xff
_SGP30_CRC_POLYNOMIAL = 0x31

_SGP30_FEATURE_SET_BITMASK = 0b0000000011100000


def _log(*args):
    print('[SGP30]', *args, file=stderr)


_RawSample = namedtuple('RawSample', 'timestamp raw_co2 raw_voc')
class RawSample(_RawSample):
    def __new__(cls, raw_co2, raw_voc):
        self = super(RawSample, cls).__new__(cls, datetime.now(), raw_co2, raw_voc)
        return self

_AirQuality = namedtuple('AirQuality', 'timestamp co2_ppm voc_ppb')
class AirQuality(_AirQuality):
    def __new__(cls, co2_ppm, voc_ppb):
        self = super(AirQuality, cls).__new__(cls, datetime.now(), co2_ppm, voc_ppb)
        return self

    def is_probably_warmup_value(self):
        return self.co2_ppm == 400 and self.voc_ppb == 0


class SGP30(object):
    def __init__(self, smbus, i2c_address=0x58):
        self.i2c_address = i2c_address

        self._raw_feature_set = None
        self.chip_version = None
        self.serial_number = None

        self._bus = smbus
        self.__bus_lock = Lock()


    def __enter__(self):
        self.open()
        return self

    def __exit__(self, exception_type, exception_value, traceback):
        self.close()

    def open(self):
        self.serial_number = self._get_serial_number()
        sn_string = ' '.join('0x{:04x}'.format(x) for x in self.serial_number)
        _log('got serial number: ' + sn_string)

        self._raw_feature_set = self._get_feature_set_version()
        self.chip_version = self._raw_feature_set & _SGP30_FEATURE_SET_BITMASK
        _log('chip version: ' + hex(self.chip_version) + ' (raw: ' + hex(self._raw_feature_set) + ')')

        _log('initing...')
        self._init_air_quality()
        _log('inited')

    def close(self):
        self._bus.close()


    def _get_serial_number(self):
        return self._run_word_getter('get_serial_number')

    def _get_feature_set_version(self):
        # The spec sheet says we should ignore the MSB of this response,
        # and that the last five bits of the LSB are 'subject to change.'
        # Use _has_feature_set() to check its value against another.
        return self._run_word_getter('get_feature_set_version')[0]

    def _has_feature_set(self, required_feature_set):
        if required_feature_set is None:
            return True

        return self.chip_version == (required_feature_set & _SGP30_FEATURE_SET_BITMASK)


    def _init_air_quality(self):
        return self._run_command(_SGP30_CMDS['init_air_quality'])


    def measure_air_quality(self):
        co2_ppm, voc_ppb = self._run_word_getter('measure_air_quality')
        return AirQuality(co2_ppm, voc_ppb)

    def get_baseline(self):
        raw_co2, raw_voc = self._run_word_getter('get_baseline')
        return RawSample(raw_co2, raw_voc)

    def set_baseline(self, co2_baseline, voc_baseline):
        self._run_word_setter('set_baseline', [co2_baseline, voc_baseline])

    def set_humidity(self, humidity_g_per_m3):
        fpart, ipart = modf(humidity_g_per_m3)

        assert ipart < 256, 'Humidity must be less than 256 g/m^3'

        ipart = int(ipart)
        quantized_fpart = int(round(fpart * 256))

        humidity_word = (ipart & 0xff) << 8 | (quantized_fpart & 0xff)

        self._set_humidity_raw(humidity_word)

    # This takes the raw integer value for the humidity, which is in a weird format (see
    # the spec sheet). Probably just use set_humidity().
    def _set_humidity_raw(self, humidity):
        self._run_word_setter('set_humidity', [humidity])

    def measure_raw_signals(self):
        raw_co2, raw_voc = self._run_word_getter('measure_raw_signals')
        return RawSample(raw_co2, raw_voc)


    def _run_word_getter(self, cmd_name):
        cmd = _SGP30_CMDS[cmd_name]
        assert cmd.parameter_length == 0, 'This method only understands commands that take no parameters'
        assert cmd.response_length % 3 == 0, 'This method only understands commands whose response is a set of (2-byte word + 1-byte checksum) pairs (i.e., the number of response bytes must be divisible by three)'

        word_count = cmd.response_length / 3
        raw_bytes = self._run_command(cmd)
        return self._read_checksummed_words(raw_bytes, word_count)

    def _run_word_setter(self, cmd_name, words):
        cmd = _SGP30_CMDS[cmd_name]
        assert cmd.response_length == 0, 'This method only understands commands that have no response'
        assert cmd.parameter_length > 0, 'This method only understands commands that take parameters'
        assert cmd.parameter_length % 3 == 0, 'This method only understands commands whose parameter is a set of (2-byte word + 1-byte checksum) pairs (i.e., the number of parameter bytes must be divisible by three)'

        param_bytes = self._bytes_for_checksummed_words(words)
        self._run_command(cmd, param_bytes)


    def _run_command(self, cmd, param_bytes=None):
        assert self._has_feature_set(cmd.required_feature_set), 'Unsupported chip version for this command'

        bytes_to_write = list(cmd.opcode_bytes)

        if cmd.parameter_length > 0:
            assert len(param_bytes) == cmd.parameter_length, 'Invalid number of parameter bytes for command'
            bytes_to_write.extend(param_bytes)

        with self.__bus_lock:
            self.__write_bytes(bytes_to_write)
            sleep(cmd.response_time_ms / 1000.0)

            if cmd.response_length > 0:
                return self.__read_bytes(cmd.response_length)

        return None

    # NOT LOCKED. Use _run_command!
    def __read_bytes(self, length):
        return bytearray(self._bus.read_i2c_block_data(self.i2c_address, 0, length))

    # NOT LOCKED. Use _run_command!
    def __write_bytes(self, raw_bytes):
        assert len(raw_bytes) >= 1

        cmd_byte = raw_bytes[0]
        arg_bytes = list(raw_bytes[1:])  # bytes may or may not be a tuple

        self._bus.write_i2c_block_data(self.i2c_address, cmd_byte, arg_bytes)

    @classmethod
    def _read_checksummed_word(cls, data, offset=0):
        word_bytes = data[offset:offset + 2]
        word, checksum = struct.unpack_from('>HB', data, offset)
        assert checksum == cls._crc(word_bytes), 'Bad checksum!'
        return word

    @classmethod
    def _read_checksummed_words(cls, data, count):
        res = []
        for i in range(count):
            offset = (2 + 1) * i  # 2 bytes + checksum byte
            word = cls._read_checksummed_word(data, offset=offset)
            res.append(word)

        return res

    @classmethod
    def _bytes_for_checksummed_words(cls, words):
        res = bytearray()
        for word in words:
            # just going to let the error from struct.pack handle the case of the word being > 65536
            word_bytes = bytearray(struct.pack('>H', word))
            res.extend(word_bytes)

            res.append(cls._crc(word_bytes))

        return res

    @classmethod
    def _crc(cls, data):
        crc = _SGP30_CRC_INIT
        # calculates 8-Bit checksum with given polynomial
        for byte in data:
            crc ^= byte
            for _ in range(8):
                if crc & 0x80:
                    crc = (crc << 1) ^ _SGP30_CRC_POLYNOMIAL
                else:
                    crc <<= 1
        return crc & 0xFF


def main():
    smbus = SMBus(1)  # zero on some boards
    warming_up = True
    baseline_counter = 0

    # Redis connection
    r = redis.StrictRedis(host='localhost', port=6379)

    with SGP30(smbus) as chip:
        while True:
            measurement = chip.measure_air_quality()

            # Chip returns (400, 0) for the first ~15 seconds while it warms up
            if warming_up:
                if measurement.is_probably_warmup_value():
                    print('... warming up ...')
                    sleep(1)
                    continue
                else:
                    warming_up = False

            # Don't take this as a complete example... read the spec sheet about how you're supposed to stash and restore the baseline, initial burn-in, humidity compensation, *and how you need to sample every second to maintain accurate results*
            baseline_counter = baseline_counter + 1
            if baseline_counter % 100 == 0:
                baseline_counter = 0
                baseline = chip.get_baseline()
                print('>> Baseline:', baseline)


            co2 = measurement.co2_ppm
            print('CO2:', co2, 'ppm')

            r.set('sensor:sgp30', json.dumps({
              'co2': {
                'value': co2,
                'unit': 'ppm'
              },
            }))
            r.publish('sensor', 'sgp30')

            sleep(1)

if __name__ == '__main__':
    main()
