export enum Name {
  BME280 = 'BME280',
  SGP30 = 'SGP30',
  BH1750 = 'BH1750',
}

export enum Type {
  ILLUMINANCE = 'ILLUMINANCE',
  HUMIDITY = 'HUMIDITY',
  PRESSURE = 'PRESSURE',
  ECO2 = 'ECO2',
  TEMPERATURE = 'TEMPERATURE',
}

export interface Sensor {
  id: string;
  description: string;
  sensor: Name;
  type: Type;
  unit: string;
}
