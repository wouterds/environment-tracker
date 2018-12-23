import { Request, Response } from 'express';
import * as SampleRepository from '../../../repositories/sample';
import * as SampleTransformer from '../../transformers/samples/list';

export default async (req: Request, res: Response): Promise<Response> => {
  if (!req.query.sensorId) {
    return res.sendStatus(400);
  }

  const groupingInterval = req.query.groupingInterval
    ? parseInt(req.query.groupingInterval, 10)
    : undefined;

  const samples = groupingInterval
    ? await SampleRepository.getAllAveragedOut(
        req.query.sensorId,
        groupingInterval,
      )
    : await SampleRepository.getAll(req.query.sensorId);

  if (samples.length === 0) {
    return res.status(204).json([]);
  }

  return res
    .status(200)
    .json(SampleTransformer.transform(samples, groupingInterval));
};
