import SampleModel, { Definition } from '../models/sample';

export const add = async (
  sensorId: string,
  value: number,
): Promise<Definition> => {
  return SampleModel.create({
    sensorId,
    value,
  });
};

export const getAll = async (sensorId: string): Promise<Definition[]> => {
  return SampleModel.findAll({
    where: { sensorId },
    order: [['createdAt', 'DESC']],
  });
};
