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

export const getAllGroupedByTimeInterval = async (
  sensorId: string,
  interval: number,
): Promise<Definition[]> => {
  return db.query(
    `
    SELECT *, AVG(value) AS value
    FROM ${SampleModel.getTableName()}
    WHERE sensorId = :sensorId
    GROUP BY (UNIX_TIMESTAMP(createdAt) DIV :interval)
    ORDER BY createdAt DESC
  `,
    {
      replacements: {
        sensorId,
        interval,
      },
      type: db.QueryTypes.SELECT,
    },
  );
};
