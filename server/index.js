import redis from 'redis';
import { promisify } from 'util';
import WebSocket from 'ws';
import Sequelize from 'sequelize';

// Init Sequelize client
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'postgres',
  database: 'demo',
  username: 'demo',
  password: 'demo',
});

// Init Redis clients
const client = redis.createClient({ host: 'redis' });
const sub = redis.createClient({ host: 'redis' });

// Get async from Redis proxy
const getAsync = promisify(client.get).bind(client);

// WebSocker server
const wss = new WebSocket.Server({ port: 3000 });

/**
 * Broadcast to all clients
 *
 * @param {mixed} data
 */
wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

let sensors = {};
sub.on('message', async (channel, message) => {
  let sensor = message;
  let value = await getAsync(`sensor:${sensor}`);

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
  wss.broadcast({ sensor, data: value });

  // Debugging output
  console.log({ sensor, data: value });
});

// New connection
wss.on('connection', (ws) => {
  // Send all sensor data
  Object.entries(sensors).forEach(([sensor, data]) => {
    ws.send(JSON.stringify({ sensor, data }));
  });
});

// Subscribe to sensor publish event
sub.subscribe('sensor');

// Measurements model
const Measurement = sequelize.define('measurement', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  sensor: Sequelize.STRING(8),
  type: Sequelize.STRING(16),
  value: Sequelize.STRING(16),
}, {
  indexes: [
    {
      fields: ['createdAt'],
    },
  ],
});

// Sync
sequelize.sync();

// Keep historical data
setInterval(() => {
  Object.entries(sensors).forEach(([sensor, data]) => {
    Object.entries(data).forEach(([type, data]) => {
      Measurement.create({
        sensor,
        type,
        value: data.value,
      });
    });
  });
}, 1000 * 60);
