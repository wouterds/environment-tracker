import { Request, Response } from 'express';

export default (req: Request, res: Response): Response => {
  res.status(200);
  res.send(`Hello, ${req.ip}`);
  return res;
};
