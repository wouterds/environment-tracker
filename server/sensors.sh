#!/bin/bash

# Start sensor readings in background
./sensors/bme280.py > /dev/null 2>&1 &
./sensors/tmp102.py > /dev/null 2>&1 &
./sensors/bh1750.py > /dev/null 2>&1 &
./sensors/pir.py > /dev/null 2>&1 &
