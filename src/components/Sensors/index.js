//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import SensorBox from 'components/SensorBox';
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
  temperature: ?Sensor,
  humidity: ?Sensor,
  pressure: ?Sensor,
  light: ?Sensor,
};

class Sensors extends Component<Props> {
  /**
   * Render sensors
   *
   * @return {Node}
   */
  render(): Node {
    const {
      className,
      temperature,
      humidity,
      pressure,
      light,
    } = this.props;

    return (
      <div className={cx(styles.container, className)}>
        {temperature && (
          <SensorBox
            className={styles.sensorBox}
            label="Temperature"
            unit={temperature.unit}
            value={formatTemperature(temperature.value)}
          />
        )}
        {humidity && (
          <SensorBox
            className={styles.sensorBox}
            label="Humidity"
            unit={humidity.unit}
            value={formatHumidity(humidity.value)}
          />
        )}
        {pressure && (
          <SensorBox
            className={styles.sensorBox}
            label="Pressure"
            unit={pressure.unit}
            value={formatPressure(pressure.value)}
          />
        )}
        {light && (
          <SensorBox
            className={styles.sensorBox}
            label="Light"
            unit={light.unit}
            value={formatLight(light.value)}
          />
        )}
      </div>
    );
  }
}

export default Sensors;
