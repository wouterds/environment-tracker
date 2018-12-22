import { config } from 'dotenv';
import * as express from 'express';
import Handlers from './handlers';

config();

const app = express();

app.get('/', (req, res) => Handlers.Root(app, req, res));
app.get('/sensors', Handlers.Sensors.List);
app.get('/sensors/:id', Handlers.Sensors.Get);
app.get('/samples', Handlers.Samples.List);

app.listen(3000);

/* tslint:disable */
console.log('Application is running 🚀');
