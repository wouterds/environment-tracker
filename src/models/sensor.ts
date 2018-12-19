import * as sequelize from 'sequelize';
import db from '../services/database';

export interface Definition {
  id: string;
  name: string;
  type: string;
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
    name: { type: sequelize.STRING(32), allowNull: false },
    type: { type: sequelize.STRING(8), allowNull: false },
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
