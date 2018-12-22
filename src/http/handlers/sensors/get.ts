import { Request, Response } from 'express';
import * as SensorRepository from '../../../repositories/sensor';
import * as SensorTransformer from '../../transformers/sensors/get';

export default async (req: Request, res: Response): Promise<Response> => {
  const sensor = await SensorRepository.getById(req.params.id);

  if (!sensor) {
    return res.sendStatus(404);
  }

  return res.status(200).json(SensorTransformer.transform(sensor));
};
