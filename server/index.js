import redis from 'redis';
import { promisify } from 'util';
import WebSocket from 'ws';

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
