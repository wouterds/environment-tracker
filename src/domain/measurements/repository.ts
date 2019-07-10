import Measurement, { Sensor } from './measurement';

export default interface MeasurementRepositoryInterface {
  add: (data: { sensor: Sensor; value: number }) => Promise<Measurement>;
}
