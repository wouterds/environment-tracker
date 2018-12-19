import SensorModel, { Definition, Type } from '../models/sensor';

export const getByType = async (type: Type): Promise<Definition | null> => {
  return SensorModel.findOne({ where: { type } });
};
