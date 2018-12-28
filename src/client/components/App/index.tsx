import * as React from 'react';
import { Sample } from '../../store/samples/types';
import { Sensor, Type } from '../../store/sensors/types';
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
  console.log(props);

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.column}>Col</div>
          <div className={styles.column}>Col</div>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>Col</div>
          <div className={styles.column}>Col</div>
        </div>
        <div className={styles.row}>
          <div className={styles.column}>Col</div>
          <div className={styles.column}>Col</div>
        </div>
      </div>
    </div>
  );
};

export default withContainer(App);
