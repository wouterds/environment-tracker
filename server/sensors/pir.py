#!/usr/bin/python
# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
import json
import redis

# Redis connection
r = redis.StrictRedis(host='localhost', port=6379)

# GPIO setup
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.IN)
GPIO.setup(27, GPIO.OUT)

while True:
  i = GPIO.input(17)

  r.set('sensor:pir', json.dumps(i==1))
  r.publish('sensor', 'pir')

  GPIO.output(27, i==1)

  if i == 0:
    print 'No activity'
  elif i == 1:
    print 'Activity detected'

  time.sleep(0.25)
