import { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status';
import MeasurementRepository from 'repositories/measurement';

export default async (req: Request, res: Response): Promise<void> => {
  const { sensor } = req.params;
  const { groupByMinutes } = req.query;

  if (!sensor) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  if (!groupByMinutes) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  if (isNaN(groupByMinutes) === true) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  const measurements = await MeasurementRepository.getBySensorGroupedPerMinutes(
    sensor,
    parseInt(groupByMinutes, 10),
  );

  res.json(measurements);
};
