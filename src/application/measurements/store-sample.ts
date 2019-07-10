// tslint:disable-next-line
require('dotenv').config();
import MeasurementRepository from 'application/measurements/repository';
import axios from 'axios';
import { Sensor } from 'domain/measurements/measurement';
import { config } from 'dotenv';

config();

(async () => {
  const { data: response1 } = await axios.get(
    `${process.env.SENSORS_API_ENDPOINT}`,
  );

  await new Promise(resolve => setTimeout(resolve, 30000));

  const { data: response2 } = await axios.get(
    `${process.env.SENSORS_API_ENDPOINT}`,
  );

  const data = {
    illuminance: {
      full: (response1.illuminance.full + response2.illuminance.full) / 2,
      visible:
        (response1.illuminance.visible + response2.illuminance.visible) / 2,
      ir: (response1.illuminance.ir + response2.illuminance.ir) / 2,
    },
    temperature: (response1.temperature + response2.temperature) / 2,
    humidity: (response1.humidity + response2.humidity) / 2,
    pressure: (response1.pressure + response2.pressure) / 2,
  };

  await MeasurementRepository.add({
    sensor: Sensor.ILLUMINANCE_FULL,
    value: data.illuminance.full,
  });

  await MeasurementRepository.add({
    sensor: Sensor.ILLUMINANCE_VISIBLE,
    value: data.illuminance.visible,
  });

  await MeasurementRepository.add({
    sensor: Sensor.ILLUMINANCE_IR,
    value: data.illuminance.ir,
  });

  await MeasurementRepository.add({
    sensor: Sensor.TEMPERATURE,
    value: data.temperature,
  });

  await MeasurementRepository.add({
    sensor: Sensor.HUMIDITY,
    value: data.humidity,
  });

  await MeasurementRepository.add({
    sensor: Sensor.PRESSURE,
    value: data.pressure,
  });

  process.exit(0);
})().catch(e => {
  throw e;
});
