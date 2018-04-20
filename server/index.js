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
  wss.broadcast({ type: 'sensor-data', sensor, data: value });

  // Debugging output
  console.log({ type: 'sensor-data', sensor, data: value });
});

// New connection
wss.on('connection', (ws) => {
  // Send all sensor data
  Object.entries(sensors).forEach(([sensor, data]) => {
    ws.send(JSON.stringify({ type: 'sensor-data', sensor, data }));

    broadcastChartForSensor(sensor);
  });
});

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

const broadcastChartForSensor = async (sensor) => {
  let measurements = await sequelize.query(`
    SELECT
      sensor,
      type,
      AVG(CAST(value AS DECIMAL)) AS value,
      TO_TIMESTAMP(FLOOR((EXTRACT(EPOCH FROM "createdAt") / 900 )) * 900) AT TIME ZONE 'UTC' as time_interval
    FROM measurements
    WHERE sensor = '${sensor}' AND "createdAt" >= NOW() - '1 DAY'::INTERVAL
    GROUP BY sensor, type, time_interval
    ORDER BY time_interval ASC;
  `, { type: Sequelize.QueryTypes.SELECT });

  // Chart events
  wss.broadcast({ type: 'sensor-chart-data', sensor, data: measurements });
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

      Measurement.create({
        sensor,
        type: 'activity',
        value,
      });
    } else {
      Object.entries(sensorData).forEach(([type, data]) => {
        let value = data.values.reduce((total, current) => total + current);
        value = value / data.values.length;
        value = Math.round(value * 100) / 100;

        Measurement.create({
          sensor,
          type,
          value,
        });
      });
    }

    broadcastChartForSensor(sensor);
  });
}, 1000 * 60);

// Sync DB
sequelize.sync();

// Subscribe to events
sub.subscribe('sensor');
