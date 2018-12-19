import { config } from 'dotenv';
import * as express from 'express';

// Load .env
config();

// Create http server
const app = express();

// Routes
app.get(
  '/',
  (_request: express.Request, response: express.Response): express.Response =>
    response.sendStatus(200),
);

// Start http server
app.listen(3000);

/* tslint:disable */
console.log('Application running 🚀');
