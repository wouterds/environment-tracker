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

// Start http app
app.listen(3000);

/* tslint:disable */
console.log('Application is running 🚀');
