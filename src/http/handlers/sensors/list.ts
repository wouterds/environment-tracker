import { Request, Response } from 'express';

export default (_req: Request, res: Response): Response => {
  res.status(200);
  res.send('Work in progress!');

  return res;
};
