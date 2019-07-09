import { DataTypes, Model } from 'sequelize';
import sequelize from 'services/database';

export interface Definition {
  id: string;
  sensor: string;
  value: number;
  createdAt: Date;
}

class Measurement extends Model {}
Measurement.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    sensor: {
      type: DataTypes.ENUM,
      values: [
        'illuminance:full',
        'illuminance:visible',
        'illuminance:ir',
        'temperature',
        'humidity',
        'pressure',
      ],
    },
    value: { type: DataTypes.FLOAT(8, 2), allowNull: false },
  },
  {
    sequelize,
    indexes: [
      {
        fields: ['sensor'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  },
);

export default Measurement;
