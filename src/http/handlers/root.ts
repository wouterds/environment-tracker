import { Request, Response } from 'express';

export default (req: Request, res: Response): Response => {
  return res.status(200).send(`Hello, ${req.ip}`);
};
