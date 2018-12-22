import { Request, Response } from 'express';
import * as SensorRepository from '../../../repositories/sensor';

export default async (req: Request, res: Response): Promise<Response> => {
  const sensor = await SensorRepository.getById(req.params.id);

  if (!sensor) {
    return res.sendStatus(404);
  }

  return res.status(200).json(sensor);
};
