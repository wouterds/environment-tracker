import { Definition } from '../../../models/sensor';
import * as SensorGetTransformer from './get';
import { ResponseObject } from './types';

export const transform = (sensors: Definition[]): ResponseObject[] => {
  return sensors.map(SensorGetTransformer.transform);
};
