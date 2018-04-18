const redis = require('redis');
const client = redis.createClient({ host: 'redis' });
const sub = redis.createClient({ host: 'redis' });
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

client.on('error', function (err) {
  console.error(`Error (client): ${err}`);
});

sub.on('error', function (err) {
  console.error(`Error (sub): ${err}`);
});

let sensors = {};
sub.on('message', async (channel, message) => {
  let sensor = message;
  let value = await getAsync(`sensor:${sensor}`);

  if (typeof value !== 'undefined') {
    value = JSON.parse(value);
  }

  if (!sensors.hasOwnProperty(sensor)) {
    sensors[sensor] = value;
  }

  if (JSON.stringify(sensors[sensor]) === JSON.stringify(value)) {
    return;
  }

  sensors[sensor] = value;

  wss.broadcast({ sensor, data: value });

  console.log(`Value updated for ${sensor}`, value);
});

wss.on('connection', (ws) => {
  Object.entries(sensors).forEach(([sensor, data]) => {
    ws.send(JSON.stringify({ sensor, data }));
  });
});

sub.subscribe('sensor');
