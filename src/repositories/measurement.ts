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

const getBySensorGroupedPerMinutes = async (
  sensor: string,
  groupedPerMinutes: number,
): Promise<Array<{ average: number; dtime: string }>> => {
  const rows = await db.query(
    `
      SELECT
      AVG(\`value\`) AS \`average\`,
      CONVERT((MIN(\`createdAt\`) DIV :groupedPerMinutes) * :groupedPerMinutes, DATETIME) AS \`dtime\`
      FROM \`Measurements\`
      WHERE \`sensor\` = :sensor
      GROUP BY \`createdAt\` DIV :groupedPerMinutes
  `,
    {
      replacements: {
        sensor,
        groupedPerMinutes: groupedPerMinutes * 100,
      },
      type: QueryTypes.SELECT,
      raw: true,
    },
  );

  return rows;
};

export default {
  add,
  getBySensorGroupedPerMinutes,
};
