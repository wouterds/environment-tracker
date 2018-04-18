#!/usr/bin/python
# -*- coding: utf-8 -*-
import smbus
import time
import json
import redis

# Redis connection
r = redis.StrictRedis(host='localhost', port=6379)

# I2C setup
DEVICE     = 0x23
POWER_DOWN = 0x00
POWER_ON   = 0x01
RESET      = 0x07

CONTINUOUS_LOW_RES_MODE = 0x13
CONTINUOUS_HIGH_RES_MODE_1 = 0x10
CONTINUOUS_HIGH_RES_MODE_2 = 0x11
ONE_TIME_HIGH_RES_MODE_1 = 0x20
ONE_TIME_HIGH_RES_MODE_2 = 0x21
ONE_TIME_LOW_RES_MODE = 0x23

bus = smbus.SMBus(1)

def convertToNumber(data):
  return ((data[1] + (256 * data[0])) / 1.2)

def readLight(addr=DEVICE):
  return convertToNumber(bus.read_i2c_block_data(addr,ONE_TIME_HIGH_RES_MODE_1))

while True:
  light = round(readLight(), 2)

  r.set('sensor:bh1750', json.dumps({
    'light': {
      'value': light,
      'unit': 'lx'
     }
  }))
  r.publish('sensor', 'bh1750')

  print 'Light:', light, 'lx'
  time.sleep(0.25)
