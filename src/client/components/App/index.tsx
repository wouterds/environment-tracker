import * as React from 'react';
import { Sample } from '../../store/samples/types';
import { Sensor, Type } from '../../store/sensors/types';
import Sidebar from '../Sidebar';
import withContainer from './container';
import styles from './styles.css';

interface Props {
  timeframe: number;
  timeframes: number[];
  sensors: Sensor[];
  samples: {
    [Type.ILLUMINANCE]: Sample[];
    [Type.HUMIDITY]: Sample[];
    [Type.TEMPERATURE]: Sample[];
    [Type.PRESSURE]: Sample[];
    [Type.ECO2]: Sample[];
  };
}

const App = (props: Props) => {
  console.log(props);

  return (
    <div className={styles.container}>
      <Sidebar />
    </div>
  );
};

export default withContainer(App);
