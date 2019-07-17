import Measurement, { Definition } from 'models/measurement';
import { QueryTypes } from 'sequelize';
import db from 'services/database';

const add = async (data: {
  sensor: string;
  value: number;
}): Promise<Definition> => {
  const measurement = await Measurement.create(data);

  return measurement.get({ plain: true });
};

const getBySensorAndBetweenDatesAndWithDataPoints = async (
  sensor: string,
  from: Date,
  to: Date,
  dataPoints: number,
): Promise<Array<{ average: number; time: string }>> => {
  const rows = await db.query(
    `
      SELECT
        AVG(\`value\`) AS \`value\`,
        createdAt AS time
      FROM Measurements
      WHERE sensor = :sensor
        AND createdAt >= :from
        AND createdAt <= :to
      GROUP BY FLOOR((
        TIMESTAMPDIFF(MINUTE, :from, createdAt) / TIMESTAMPDIFF(MINUTE, :from, :to)
      ) * :dataPoints)
      ORDER BY createdAt ASC
  `,
    {
      replacements: {
        sensor,
        from,
        to,
        dataPoints,
      },
      type: QueryTypes.SELECT,
      raw: true,
    },
  );

  return rows;
};

const getLastValueBySensor = async (
  sensor: string,
): Promise<Definition | null> => {
  const measurement = await Measurement.findOne({
    where: { sensor },
    limit: 1,
    order: [['createdAt', 'DESC']],
  });

  if (!measurement) {
    return null;
  }

  return measurement;
};

export default {
  add,
  getBySensorAndBetweenDatesAndWithDataPoints,
  getLastValueBySensor,
};
