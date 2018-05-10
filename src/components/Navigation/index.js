//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import { format as formatTemperature } from 'formatters/temperature';
import { format as formatPressure } from 'formatters/pressure';
import { format as formatHumidity } from 'formatters/humidity';
import { format as formatLight } from 'formatters/light';
import cx from 'classnames';
import styles from './styles.css';

type Sensor = {
  value: number,
  unit: string,
};

type Props = {
  className?: ?string,
  activeSensor: ?string,
  temperature: ?Sensor,
  humidity: ?Sensor,
  pressure: ?Sensor,
  light: ?Sensor,
  setActiveSensor: Function,
};

class Navigation extends Component<Props> {
  /**
   * Render navigation
   *
   * @return {Node}
   */
  render(): Node {
    const {
      activeSensor,
      temperature,
      pressure,
      humidity,
      light,
      setActiveSensor,
    } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <select
            className={styles.mobileSelect}
            defaultValue={activeSensor}
            onChange={(event) => setActiveSensor(event.target.value)}
            >
            {temperature && (<option value="temperature">Temperature</option>)}
            {humidity && (<option value="humidity">Humidity</option>)}
            {pressure && (<option value="pressure">Pressure</option>)}
            {light && (<option value="light">Light</option>)}
          </select>

          <ul>
            {temperature && (
              <li
                className={cx(styles.item, activeSensor === 'temperature' ? styles.active : null)}
                onClick={() => setActiveSensor('temperature')}
                >
                Temperature &middot; {formatTemperature(temperature.value)}
                <span className={styles.legendUnit}>{temperature.unit}</span>
              </li>
            )}
            {humidity && (
              <li
                className={cx(styles.item, activeSensor === 'humidity' ? styles.active : null)}
                onClick={() => setActiveSensor('humidity')}
                >
                Humidity &middot; {formatHumidity(humidity.value)}
                <span className={styles.legendUnit}>{humidity.unit}</span>
              </li>
            )}
            {pressure && (
              <li
                className={cx(styles.item, activeSensor === 'pressure' ? styles.active : null)}
                onClick={() => setActiveSensor('pressure')}
                >
                Pressure &middot; {formatPressure(pressure.value)}
                <span className={styles.legendUnit}>{pressure.unit}</span>
              </li>
            )}
            {light && (
              <li
                className={cx(styles.item, activeSensor === 'light' ? styles.active : null)}
                onClick={() => setActiveSensor('light')}
                >
                Light &middot; {formatLight(light.value)}
                <span className={styles.legendUnit}>{light.unit}</span>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.right}>
          {/* <ul>
            <li
              className={cx(styles.item, activePeriod === '1D' ? styles.active : null)}
              onClick={() => alert('🚧 🛠 🔜')}>
              1D
            </li>
            <li
              className={cx(styles.item, activePeriod === '1W' ? styles.active : null)}
              onClick={() => alert('🚧 🛠 🔜')}>
              1W
            </li>
            <li
              className={cx(styles.item, activePeriod === '1M' ? styles.active : null)}
              onClick={() => alert('🚧 🛠 🔜')}>
              1M
            </li>
          </ul> */}
        </div>
      </div>
    );
  }
}

export default Navigation;
