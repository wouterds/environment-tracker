#!/usr/bin/python
# -*- coding: utf-8 -*-
import time
import json
import redis
from Adafruit_CCS811 import Adafruit_CCS811

# Redis connection
r = redis.StrictRedis(host='localhost', port=6379)

ccs =  Adafruit_CCS811()

while not ccs.available():
	pass

while(1):
  if ccs.available():
    if not ccs.readData():
      co2 = ccs.geteCO2()

      if co2 == 0:
        continue

      r.set('sensor:ccs811', json.dumps({
        'co2': {
          'value': co2,
          'unit': 'ppm'
        },
      }))
      r.publish('sensor', 'ccs811')

      print 'CO2:', ccs.geteCO2(), 'ppm'

  time.sleep(0.25)

