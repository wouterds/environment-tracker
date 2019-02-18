import * as sequelize from 'sequelize';
import db from '../services/database';

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
    type: { type: sequelize.STRING(16), allowNull: false },
    unit: { type: sequelize.STRING(4), allowNull: false },
  },
  {
    indexes: [
      {
        fields: ['type'],
        unique: true,
      },
    ],
  },
);
