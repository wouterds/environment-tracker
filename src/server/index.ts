// tslint:disable-next-line
require('dotenv').config();
import cors from 'cors';
import express from 'express';
import next from 'next';
import handlers from './handlers';

const port = process.env.PORT || 3000;
const config: { [key: string]: string | boolean } = {};

if (process.env.NODE_ENV !== 'production') {
  config.dev = true;
  config.dir = './src';
}

const app = next(config);

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(cors());
    server.get('/api/measurements', handlers.Measurements);
    server.get('*', handlers.Wildcard(app));

    server.listen(port, () => {
      // tslint:disable-next-line
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(e => {
    // tslint:disable-next-line
    console.error(e.stack);

    process.exit(1);
  });
