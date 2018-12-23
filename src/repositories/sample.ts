import SampleModel, { Definition } from '../models/sample';
import db from '../services/database';

export const add = async (
  sensorId: string,
  value: number,
): Promise<Definition> => {
  return SampleModel.create({
    sensorId,
    value,
  });
};

export const getAll = async (sensorId: string): Promise<Definition[]> => {
  return SampleModel.findAll({
    where: { sensorId },
    order: [['createdAt', 'DESC']],
  });
};

export const getAllAveragedOut = async (
  sensorId: string,
  minutes: number,
): Promise<Definition[]> => {
  const rows = await db.query(
    `
    SELECT
      *,
      AVG(value) AS value,
      FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(createdAt) / (60 * :minutes)) * 60 * :minutes, '%Y-%m-%d %H:%i:%s') AS createdAt
    FROM ${SampleModel.getTableName()}
    WHERE sensorId = :sensorId
    GROUP BY createdAt
    ORDER BY createdAt DESC
  `,
    {
      replacements: {
        sensorId,
        minutes,
      },
      type: db.QueryTypes.SELECT,
    },
  );

  return rows.map((object: Definition) => ({
    ...object,
    // can't have an id for an averaged out value
    id: null,
    // casted as string because we do some funky stuff with it
    createdAt: new Date(object.createdAt),
  }));
};
