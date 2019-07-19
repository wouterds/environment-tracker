import { Request, Response } from 'express';
import { NO_CONTENT } from 'http-status';

export default async (_req: Request, res: Response): Promise<void> => {
  res.sendStatus(NO_CONTENT);
};
