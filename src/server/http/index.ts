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
    server.get(
      '/api/measurements/:sensor/averages',
      handlers.measurements.averages,
    );
    server.get('/api/measurements/:sensor/last', handlers.measurements.last);
    server.get('/api/ping', handlers.ping);
    server.get('*', handlers.wildcard(app));

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
