import * as sequelize from 'sequelize';
import db from '../services/database';

export enum Sensor {
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

export interface Definition {
  id: string;
  description: string;
  sensor: Sensor;
  type: Type;
  unit: string;
  createdAt: Date;
}

export default db.define<Definition, Partial<Definition>>(
  'sensor',
  {
    id: {
      primaryKey: true,
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
    },
    description: { type: sequelize.STRING(64), allowNull: false },
    sensor: { type: sequelize.STRING(8), allowNull: false },
    type: { type: sequelize.STRING(16), allowNull: false },
    unit: { type: sequelize.STRING(4), allowNull: false },
  },
  {
    indexes: [
      {
        fields: ['type'],
        unique: true,
      },
      {
        fields: ['sensor'],
      },
    ],
  },
);
