import { Request, Response } from 'express';
import * as SensorRepository from '../../../repositories/sensor';
import * as SensorTransformer from '../../transformers/sensors/list';

export default async (_req: Request, res: Response): Promise<Response> => {
  const sensors = await SensorRepository.getAll();

  if (sensors.length === 0) {
    return res.status(204).json([]);
  }

  return res.status(200).json(SensorTransformer.transform(sensors));
};
