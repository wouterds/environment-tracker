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
  eco2: number;
  illuminance: number;
}

(async () => {
  const endTime = addSeconds(new Date(), 30);

  const samples: ApiResponse[] = [];
  while (isFuture(endTime)) {
    try {
      const response = await axios.get('http://esp8266');

      if (response.status !== 200) {
        continue;
      }

      samples.push(response.data);
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
      case Type.ECO2:
        const averageEco2 = meanBy(samples, 'eco2');
        await SampleRepository.add(sensor.id, averageEco2);
        break;
      case Type.ILLUMINANCE:
        const averageIlluminance = meanBy(samples, 'illuminance');
        await SampleRepository.add(sensor.id, averageIlluminance);
        break;
    }
  }

  process.exit();
})();
