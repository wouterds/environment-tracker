import redis from 'redis';
import { promisify } from 'util';
import WebSocket from 'ws';
import Sequelize from 'sequelize';
import uuid from 'uuid';
import db from './db';
import MeasurementRepository from './repositories/measurement';

db.sync();

// Init Redis clients
const redisClient = redis.createClient({ host: 'redis' });
const redisSubscribtionClient = redis.createClient({ host: 'redis' });
const redisGetAsync = promisify(redisClient.get).bind(redisClient);

// WebSocker server
const wss = new WebSocket.Server({ port: 3000 });

// Connected clients
let connectedClients = {};

/**
 * Broadcast to all clients
 *
 * @param {mixed} data
 */
wss.broadcast = (period, data) => {
  Object.values(connectedClients).forEach((client) => {
    if ((period === null || redisClient.period === period) && redisClient.readyState === WebSocket.OPEN) {
      redisClient.send(JSON.stringify(data));
    }
  });
};

let sensors = {};
redisSubscribtionClient.on('message', async (channel, message) => {
  let sensor = message;
  let value = await redisGetAsync(`sensor:${sensor}`);

  // If there's a value, parse as json
  if (typeof value !== 'undefined') {
    value = JSON.parse(value);
  }

  // Doesn't exist yet?
  if (!sensors.hasOwnProperty(sensor)) {
    sensors[sensor] = value;
  }

  // Don't trigger update if value unchanged
  if (JSON.stringify(sensors[sensor]) === JSON.stringify(value)) {
    return;
  }

  // Cache
  sensors[sensor] = value;

  // Broadcast
  wss.broadcast(null, { type: 'sensor', sensor, data: value });

  // Debugging output
  console.log({ type: 'sensor', sensor, data: value });
});

// New connection
wss.on('connection', (ws) => {
  const id = uuid.v4();

  ws.id = id;
  connectedClients[id] = ws;

  ws.on('message', (data) => clientSendMessage(ws, data));
});

// Connected closed
wss.on('close', (ws) => {
  delete connectedClients[ws.id];
});

// Client sent us a message
const clientSendMessage = (ws, data) => {
  console.log(`Message from ${ws.id}`, data);

  const message = JSON.parse(data);

  if (message.period) {
    ws.period = message.period;
  }

  // Send all sensor data
  Object.entries(sensors).forEach(([sensor, data]) => {
    ws.send(JSON.stringify({
      type: 'sensor',
      sensor,
      data,
    }));

    broadcastChartForSensor(sensor);
  });
};

const broadcastChartForSensor = async (sensor) => {
  const periods = ['6H', '1D', '1W', '1M'];
  for (let index = 0; index < periods.length; index++) {
    const measurements = MeasurementRepository.getAveragesForPeriod(periods[index], sensor);

    // Chart events
    wss.broadcast(periods[index], {
      type: 'chart',
      sensor,
      data: measurements,
    });
  }
};

// Calculate minute averages
let sensorsLastMinute = {};
setInterval(() => {
  Object.entries(sensors).forEach(([sensor, data]) => {
    if (!sensorsLastMinute.hasOwnProperty(sensor)) {
      sensorsLastMinute[sensor] = sensor === 'pir' ? [] : {};
    }

    if (sensor === 'pir') {
      sensorsLastMinute[sensor].push(data);

      if (sensorsLastMinute[sensor].length > 60) {
        sensorsLastMinute[sensor].shift();
      }
    } else {
      Object.entries(data).forEach(([type, data]) => {
        if (!sensorsLastMinute[sensor].hasOwnProperty(type)) {
          sensorsLastMinute[sensor][type] = {
            values: [],
            unit: data.unit,
          };
        }

        sensorsLastMinute[sensor][type].values.push(data.value);

        if (sensorsLastMinute[sensor][type].values.length > 60) {
          sensorsLastMinute[sensor][type].values.shift();
        }
      });
    }
  });
}, 1000);

// Keep historical data
setInterval(() => {
  Object.entries(sensorsLastMinute).forEach(([sensor, sensorData]) => {
    if (sensor === 'pir') {
      let value = false;

      sensorData.forEach(v => {
        if (v === true) {
          value = true;
        }
      });

      MeasurementRepository.add(sensor, 'activity', value);
    } else {
      Object.entries(sensorData).forEach(([type, data]) => {
        let value = data.values.reduce((total, current) => total + current);
        value = value / data.values.length;
        value = Math.round(value * 100) / 100;

        MeasurementRepository.add(sensor, type, value);
      });
    }

    broadcastChartForSensor(sensor);
  });
}, 1000 * 30);

// Subscribe to events
redisSubscribtionClient.subscribe('sensor');
