import { Request, Response } from 'express';
import { BAD_REQUEST, NO_CONTENT } from 'http-status';
import MeasurementRepository from 'repositories/measurement';

export default async (req: Request, res: Response): Promise<void> => {
  const { sensor } = req.params;

  if (!sensor) {
    res.sendStatus(BAD_REQUEST);
    return;
  }

  const measurement = await MeasurementRepository.getLastValueBySensor(sensor);

  if (!measurement) {
    res.sendStatus(NO_CONTENT);
    return;
  }

  res.json({
    value: measurement.value,
    dtime: measurement.createdAt,
  });
};
