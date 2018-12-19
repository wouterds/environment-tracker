import * as sequelize from 'sequelize';
import db from '../services/database';

export enum Sensor {
  BME280,
  SGP30,
  BH1750,
}

export enum Type {
  ILLUMINANCE,
  HUMIDITY,
  PRESSURE,
  ECO2,
  TEMPERATURE,
}

export interface Definition {
  id: string;
  description: string;
  sensor: Sensor;
  type: Type;
  unit: string;
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
