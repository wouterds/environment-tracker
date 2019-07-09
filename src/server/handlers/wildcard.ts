import { Request, Response } from 'express';

export default (app: any) => async (
  req: Request,
  res: Response,
): Promise<void> => {
  const handle = app.getRequestHandler();

  await handle(req, res);
};
