import * as React from 'react';
import { Sample } from '../../store/samples/types';
import { Sensor, Type } from '../../store/sensors/types';
import Chart from '../Chart';
import Sidebar from '../Sidebar';
import withContainer from './container';
import styles from './styles.css';

interface Data {
  sensor: Sensor;
  samples: Sample[];
}

interface Props {
  data: {
    [Type.ILLUMINANCE]: Data;
    [Type.HUMIDITY]: Data;
    [Type.TEMPERATURE]: Data;
    [Type.PRESSURE]: Data;
    [Type.ECO2]: Data;
  };
}

const App = (props: Props) => {
  const { data } = props;
  const { [Type.ILLUMINANCE]: illuminance } = data;
  const { [Type.HUMIDITY]: humidity } = data;
  const { [Type.TEMPERATURE]: temperature } = data;
  const { [Type.PRESSURE]: pressure } = data;
  const { [Type.ECO2]: eco2 } = data;

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.column} />
          <div className={styles.column}>
            {eco2.sensor && (
              <Chart
                loading={false}
                syncId="sync-charts"
                identifier={eco2.sensor.type}
                name="ECO2"
                strokeColor="rgb(129, 236, 236)"
                fillColor="rgba(129, 236, 236, 0.1)"
                data={[...eco2.samples].reverse()}
                unit={eco2.sensor.unit}
              />
            )}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>
            {temperature.sensor && (
              <Chart
                loading={false}
                syncId="sync-charts"
                identifier={temperature.sensor.type}
                name="Temperature"
                strokeColor="rgb(255, 153, 153)"
                fillColor="rgba(255, 153, 153, 0.1)"
                data={[...temperature.samples].reverse()}
                unit={temperature.sensor.unit}
              />
            )}
          </div>
          <div className={styles.column}>
            {illuminance.sensor && (
              <Chart
                loading={false}
                syncId="sync-charts"
                identifier={illuminance.sensor.type}
                name="Illuminance"
                strokeColor="rgb(255, 234, 167)"
                fillColor="rgba(255, 234, 167, 0.1)"
                data={[...illuminance.samples].reverse()}
                unit={illuminance.sensor.unit}
              />
            )}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>
            {humidity.sensor && (
              <Chart
                loading={false}
                syncId="sync-charts"
                identifier={humidity.sensor.type}
                name="Humidity"
                strokeColor="rgb(116, 185, 255)"
                fillColor="rgba(116, 185, 255, 0.1)"
                data={[...humidity.samples].reverse()}
                unit={humidity.sensor.unit}
              />
            )}
          </div>
          <div className={styles.column}>
            {pressure.sensor && (
              <Chart
                loading={false}
                syncId="sync-charts"
                identifier={pressure.sensor.type}
                name="Pressure"
                strokeColor="rgb(181, 175, 255)"
                fillColor="rgba(181, 175, 255, 0.1)"
                data={[...pressure.samples].reverse()}
                unit={pressure.sensor.unit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withContainer(App);
