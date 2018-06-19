//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import { format as formatTemperature } from 'formatters/temperature';
import { format as formatPressure } from 'formatters/pressure';
import { format as formatHumidity } from 'formatters/humidity';
import { format as formatCo2 } from 'formatters/co2';
import { format as formatLight } from 'formatters/light';
import cx from 'classnames';
import styles from './styles.css';

type Sensor = {
  value: number,
  unit: string,
};

type Props = {
  className?: ?string,
  activePeriod: ?string,
  periods: Array<string>,
  activeSensor: ?string,
  temperature: ?Sensor,
  humidity: ?Sensor,
  pressure: ?Sensor,
  co2: ?Sensor,
  light: ?Sensor,
  setActiveSensor: Function,
  setActivePeriod: Function,
};

class Navigation extends Component<Props> {
  /**
   * Render navigation
   *
   * @return {Node}
   */
  render(): Node {
    const {
      activePeriod,
      periods,
      activeSensor,
      temperature,
      pressure,
      humidity,
      co2,
      light,
      setActiveSensor,
      setActivePeriod,
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
            {co2 && (<option value="co2">CO2</option>)}
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
            {co2 && (
              <li
                className={cx(styles.item, activeSensor === 'co2' ? styles.active : null)}
                onClick={() => setActiveSensor('co2')}
                >
                CO2 &middot; {formatCo2(co2.value)}
                <span className={styles.legendUnit}>{co2.unit}</span>
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
          <ul>
            {periods.map((period) => (
              <li key={`period-item-${period}`}
                className={cx(styles.item, activePeriod === period ? styles.active : null)}
                onClick={() => setActivePeriod(period)}>
                {period}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Navigation;
