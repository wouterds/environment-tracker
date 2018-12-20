import * as sequelize from 'sequelize';
import db from '../services/database';

export interface Definition {
  id: string;
  sensorId: string;
  value: number;
}

export default db.define<Definition, Partial<Definition>>(
  'sample',
  {
    id: {
      primaryKey: true,
      type: sequelize.UUID,
      defaultValue: sequelize.UUIDV4,
    },
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
