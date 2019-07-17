import { subDays, subMonths, subWeeks, subYears } from 'date-fns';
import { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status';
import MeasurementRepository from 'repositories/measurement';

export default async (req: Request, res: Response): Promise<void> => {
  const { sensor } = req.params;
  const { resolution } = req.query;

  if (!sensor) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  if (!resolution) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  const to = new Date();
  let from: Date | null = null;

  switch (resolution) {
    case '1d':
      from = subDays(to, 1);
      break;
    case '1w':
      from = subWeeks(to, 1);
      break;
    case '1m':
      from = subMonths(to, 1);
      break;
    case '1y':
      from = subYears(to, 1);
      break;
  }

  if (!from) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  const measurements = await MeasurementRepository.getBySensorAndBetweenDatesAndWithDataPoints(
    sensor,
    from,
    to,
    120,
  );

  res.json(measurements);
};
