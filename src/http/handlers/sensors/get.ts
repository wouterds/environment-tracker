import { Request, Response } from 'express';
import * as SensorRepository from '../../../repositories/sensor';

export default async (req: Request, res: Response): Promise<Response> => {
  const sensor = await SensorRepository.getById(req.params.id);

  if (!sensor) {
    res.status(404);
    return res;
  }

  res.status(200);
  res.json(sensor);
  return res;
};
