//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styles from './styles.css';
import Box from 'components/Box';
import wrapSensors from 'containers/Sensors';
import Sensors from 'components/Sensors';
import wrapNavigation from 'containers/Navigation';
import Navigation from 'components/Navigation';
import wrapChart from 'containers/Chart';
import Chart from 'components/Chart';
import cx from 'classnames';

const WrappedSensors = wrapSensors(Sensors);
const WrappedNavigation = wrapNavigation(Navigation);
const WrappedChart = wrapChart(Chart);

class App extends Component<{}> {
  /**
   * Render component
   *
   * @return {Node}
   */
  render(): Node {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Raspberry Pi Environment Tracker</h1>
        <div className={styles.content}>
          <WrappedSensors className={(cx(styles.row, styles.rowSensors))} />

          <div className={cx(styles.row, styles.chartRow)}>
            <Box className={styles.chartBox}>
              <WrappedNavigation  />

              <WrappedChart className={styles.chart} />
            </Box>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
