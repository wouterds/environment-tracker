import { Request, Response } from 'express';

export default (request: Request, response: Response): Response => {
  response.status(200);
  response.send(`Hello, ${request.ip}`);

  return response;
};
