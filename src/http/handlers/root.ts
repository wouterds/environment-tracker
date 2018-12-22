import { Express, Request, Response } from 'express';

type ResponseObject = [string, string];

export default (app: Express, _req: Request, res: Response): Response => {
  const routes: ResponseObject[] = [];

  app._router.stack.forEach(
    ({ route }: { route: { stack: [{ method: string }]; path: string } }) => {
      if (route) {
        routes.push([route.stack[0].method.toUpperCase(), route.path]);
      }
    },
  );

  return res.status(200).json(routes);
};
