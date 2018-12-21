import { Request, Response } from 'express';

export default (_request: Request, response: Response): Response => {
  response.status(200);
  response.send('Work in progress!');

  return response;
};
