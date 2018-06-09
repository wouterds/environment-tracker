//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import SensorComponent from 'components/Sensor';
import { format as formatTemperature } from 'formatters/temperature';
import { format as formatPressure } from 'formatters/pressure';
import { format as formatHumidity } from 'formatters/humidity';
import { format as formatLight } from 'formatters/light';
import { format as formatCo2 } from 'formatters/co2';
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
  co2: ?Sensor,
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
      co2,
      light,
    } = this.props;

    return (
      <div className={cx(styles.container, className)}>
        {temperature && (
          <SensorComponent
            className={styles.sensorBox}
            label="Temperature"
            unit={temperature.unit}
            value={formatTemperature(temperature.value)}
          />
        )}
        {humidity && (
          <SensorComponent
            className={styles.sensorBox}
            label="Humidity"
            unit={humidity.unit}
            value={formatHumidity(humidity.value)}
          />
        )}
        {pressure && (
          <SensorComponent
            className={styles.sensorBox}
            label="Pressure"
            unit={pressure.unit}
            value={formatPressure(pressure.value)}
          />
        )}
        {co2 && (
          <SensorComponent
            className={styles.sensorBox}
            label="CO2"
            unit={co2.unit}
            value={formatCo2(co2.value)}
          />
        )}
        {light && (
          <SensorComponent
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
