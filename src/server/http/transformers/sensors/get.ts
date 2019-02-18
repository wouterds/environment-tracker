import { Definition } from '../../../models/sensor';
import { ResponseObject } from './types';

export const transform = (sensor: Definition): ResponseObject => {
  return {
    id: sensor.id,
    description: sensor.description,
    type: sensor.type,
    unit: sensor.unit,
  };
};
