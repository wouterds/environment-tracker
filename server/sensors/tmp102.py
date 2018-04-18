#!/usr/bin/python
# -*- coding: utf-8 -*-
import smbus
import time
import json
import redis

# Redis connection
r = redis.StrictRedis(host='localhost', port=6379)

# I2C setup
I2C_BUS = 1
bus = smbus.SMBus(I2C_BUS)
DEVICE_ADDRESS = 0x48

# Read temperature
def readTemperature():
  temp_reg_12bit = bus.read_word_data(DEVICE_ADDRESS , 0 )
  temp_low = (temp_reg_12bit & 0xff00) >> 8
  temp_high = (temp_reg_12bit & 0x00ff)
  temp  = ((( temp_high * 256 ) + temp_low) >> 4 )

  if temp > 0x7FF:
    temp = temp-4096;

  return round(float(temp) * 0.0625, 2)

while True:
  temp = readTemperature()

  r.set('sensor:tmp102', json.dumps({
    'temperature': {
      'value': temp,
      'unit': '˚C'
    }
  }))
  r.publish('sensor', 'tmp102')

  print 'Temperature:', temp, '˚C'

  time.sleep(0.25)
