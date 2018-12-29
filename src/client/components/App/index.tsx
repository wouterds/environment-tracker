import * as React from 'react';
import { Sample } from '../../store/samples/types';
import { Sensor, Type } from '../../store/sensors/types';
import Sidebar from '../Sidebar';
import Cell from './Cell';
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
          <Cell title="Todo">Todo</Cell>
          <Cell.Chart data={eco2} />
        </div>
        <div className={styles.row}>
          <Cell.Chart data={temperature} />
          <Cell.Chart data={illuminance} />
        </div>
        <div className={styles.row}>
          <Cell.Chart data={humidity} />
          <Cell.Chart data={pressure} />
        </div>
      </div>
    </div>
  );
};

export default withContainer(App);
