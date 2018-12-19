import * as sequelize from 'sequelize';
import db from '../services/database';

export interface Definition {
  sensorId: string;
  value: number;
}

export default db.define<Definition, Partial<Definition>>(
  'sample',
  {
    sensorId: { type: sequelize.UUID, allowNull: false },
    value: { type: sequelize.FLOAT(8, 2), allowNull: false },
  },
  {
    indexes: [
      {
        fields: ['sensorId'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  },
);
