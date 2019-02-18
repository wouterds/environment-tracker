import axios from 'axios';
import { addSeconds, isFuture } from 'date-fns';
import { config } from 'dotenv';
import { meanBy } from 'lodash';
import { Type } from '../models/sensor';
import * as SampleRepository from '../repositories/sample';
import * as SensorRepository from '../repositories/sensor';

config();

interface ApiResponse {
  temperature: number;
  humidity: number;
  pressure: number;
  illuminance: {
    visible: number;
    full: number;
    ir: number;
  };
}

(async () => {
  const endTime = addSeconds(new Date(), 30);

  const samples: ApiResponse[] = [];
  while (isFuture(endTime)) {
    try {
      const response = await axios.get('http://esp8266-sensors');

      if (response.status !== 200) {
        continue;
      }

      samples.push(response.data);

      // Sleep for 500ms so we don't ddos ourselves ourselves to death
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (e) {
      continue;
    }
  }

  for (const sensor of await SensorRepository.getAll()) {
    switch (sensor.type) {
      case Type.TEMPERATURE:
        const averageTemperature = meanBy(samples, 'temperature');
        await SampleRepository.add(sensor.id, averageTemperature);
        break;
      case Type.HUMIDITY:
        const averageHumidity = meanBy(samples, 'humidity');
        await SampleRepository.add(sensor.id, averageHumidity);
        break;
      case Type.PRESSURE:
        const averagePressure = meanBy(samples, 'pressure');
        await SampleRepository.add(sensor.id, averagePressure);
        break;
      case Type.ILLUMINANCE_IR:
        const averageIlluminanceIr = meanBy(samples, 'illuminance.ir');
        await SampleRepository.add(sensor.id, averageIlluminanceIr);
        break;
      case Type.ILLUMINANCE_VISIBLE:
        const averageIlluminanceVisible = meanBy(
          samples,
          'illuminance.visible',
        );
        await SampleRepository.add(sensor.id, averageIlluminanceVisible);
        break;
      case Type.ILLUMINANCE_FULL:
        const averageIlluminanceFull = meanBy(samples, 'illuminance.full');
        await SampleRepository.add(sensor.id, averageIlluminanceFull);
        break;
    }
  }

  process.exit();
})();
