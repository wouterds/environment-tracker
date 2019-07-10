import { Sensor } from 'domain/measurements/measurement';
import sequelize from 'infrastructure/database/service';
import { DataTypes, Model } from 'sequelize';

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
      values: Object.values(Sensor),
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
