import Sequelize from 'sequelize';
import model from '../models/measurement';
import db from '../db';

const add = (sensor, type, value) => {
  model.create({
    sensor,
    type,
    value,
  });
};

const getAveragesForPeriod = async (period, sensor, dataPoints = 60) => {
  let interval = '1 DAY';
  let groupByMinutes = ((1 * 60) / dataPoints) * 60;

  switch (period) {
    case '6H':
      interval = '6 HOUR';
      groupByMinutes = ((6 * 60) / dataPoints) * 60;
      break;
    case '1D':
      interval = '1 DAY';
      groupByMinutes = ((24 * 60) / dataPoints) * 60;
      break;
    case '1W':
      interval = '1 WEEK';
      groupByMinutes = ((7 * 24 * 60) / dataPoints) * 60;
      break;
    case '1M':
      interval = '1 MONTH';
      groupByMinutes = ((30 * 24 * 60) / dataPoints) * 60;
      break;
  }

  return await db.query(`
    SELECT
      type,
      IFNULL(AVG(value), 0) AS value,
      FLOOR(UNIX_TIMESTAMP(createdAt)/(${groupByMinutes})) AS timekey
    FROM measurements
    WHERE sensor = '${sensor}' AND createdAt >= DATE_SUB(NOW(), INTERVAL ${interval})
    GROUP BY sensor, type, timekey
    ORDER BY timekey ASC;
  `, {
    type: Sequelize.QueryTypes.SELECT,
  });
};

export default {
  add,
  getAveragesForPeriod,
};
