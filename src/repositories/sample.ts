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
