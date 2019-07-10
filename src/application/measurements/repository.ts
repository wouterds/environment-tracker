import Model from 'application/measurements/model';
import Measurement, { Sensor } from 'domain/measurements/measurement';
import MeasurementRepositoryInterface from 'domain/measurements/repository';

class MeasurementRepository implements MeasurementRepositoryInterface {
  public add = async (data: {
    sensor: Sensor;
    value: number;
  }): Promise<Measurement> => {
    const measurement = await Model.create(data);

    return measurement.get({ plain: true });
  };
}

export default new MeasurementRepository();
