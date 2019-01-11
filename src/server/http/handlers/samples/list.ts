import { Request, Response } from 'express';
import * as SampleRepository from '../../../repositories/sample';
import * as SampleTransformer from '../../transformers/samples/list';

export default async (req: Request, res: Response): Promise<Response> => {
  if (!req.query.sensorId) {
    return res.sendStatus(400);
  }

  const groupByMinutes = req.query.groupByMinutes
    ? parseInt(req.query.groupByMinutes, 10)
    : undefined;

  const between = req.query.between ? req.query.between.split(',') : 0;

  let from: Date | null = null;
  let to: Date | null = null;
  if (between.length > 0) {
    from = new Date(parseInt(between[0], 10) * 1000);
    to = new Date(parseInt(between[1], 10) * 1000);
  }

  const samples = groupByMinutes
    ? await SampleRepository.getAllAveragedOut(
        req.query.sensorId,
        groupByMinutes,
        from && to ? { from, to } : undefined,
      )
    : await SampleRepository.getAll(req.query.sensorId);

  if (samples.length === 0) {
    return res.status(204).json([]);
  }

  return res
    .status(200)
    .json(
      SampleTransformer.transform(req.query.sensorId, samples, groupByMinutes),
    );
};
