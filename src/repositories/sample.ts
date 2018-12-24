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

interface Between {
  from: Date;
  to: Date;
}

export const getAllAveragedOut = async (
  sensorId: string,
  minutes: number,
  between?: Between,
): Promise<Definition[]> => {
  /* tslint:disable */
  console.log({ between });

  const rows = await db.query(
    `
    SELECT
      *,
      AVG(value) AS value,
      FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(createdAt) / (60 * :minutes)) * 60 * :minutes, '%Y-%m-%d %H:%i:%s') AS createdAt
    FROM ${SampleModel.getTableName()}
    WHERE sensorId = :sensorId
    ${
      between
        ? `AND createdAt BETWEEN FROM_UNIXTIME(${Math.floor(
            between.from.getTime() / 1000,
          )}) AND FROM_UNIXTIME(${Math.floor(between.to.getTime() / 1000)})`
        : ''
    }
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
