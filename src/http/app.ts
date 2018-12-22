import { config } from 'dotenv';
import * as express from 'express';
import Handlers from './handlers';

// Load .env
config();

// Create http app
const app = express();

// Routes
app.get('/', Handlers.Root);
app.get('/sensors', Handlers.Sensors.List);
app.get('/sensors/:id', Handlers.Sensors.Get);

// Start http app
app.listen(3000);

/* tslint:disable */
console.log('Application is running 🚀');
