import Measurement, { Definition } from 'models/measurement';

const add = async (data: {
  sensor: string;
  value: number;
}): Promise<Definition> => {
  const measurement = await Measurement.create(data);

  return measurement.get({ plain: true });
};

export default {
  add,
};
