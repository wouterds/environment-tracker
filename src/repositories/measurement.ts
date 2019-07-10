import Measurrement, { Definition } from 'models/measurement';

const add = async (data: {
  sensor: string;
  value: number;
}): Promise<Definition> => {
  const measurement = await Measurrement.create(data);

  return measurement.get({ plain: true });
};

export default {
  add,
};
