export enum Type {
  ILLUMINANCE_FULL = 'ILLUMINANCE_FULL',
  ILLUMINANCE_IR = 'ILLUMINANCE_IR',
  ILLUMINANCE_VISIBLE = 'ILLUMINANCE_VISIBLE',
  HUMIDITY = 'HUMIDITY',
  PRESSURE = 'PRESSURE',
  TEMPERATURE = 'TEMPERATURE',
}

export interface Sensor {
  id: string;
  description: string;
  type: Type;
  unit: string;
}
