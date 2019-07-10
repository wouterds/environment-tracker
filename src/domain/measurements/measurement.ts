export enum Sensor {
  ILLUMINANCE_FULL = 'illuminance:full',
  ILLUMINANCE_VISIBLE = 'illuminance:visible',
  ILLUMINANCE_IR = 'illuminance:ir',
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  PRESSURE = 'pressure',
}

export default interface Measurement {
  id: string;
  sensor: Sensor;
  value: number;
  createdAt: Date;
}
