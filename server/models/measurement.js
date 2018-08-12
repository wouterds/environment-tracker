import Sequelize from 'sequelize';
import db from '../db';

export default db.define(
  'measurement',
  {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    sensor: Sequelize.STRING(8),
    type: Sequelize.STRING(16),
    value: Sequelize.DOUBLE,
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    }
  },
  {
    timestamps: false,
    indexes: [
      { fields: ['sensor', 'type'] },
      { fields: ['value'] },
      { fields: ['createdAt'] },
    ],
  },
);
