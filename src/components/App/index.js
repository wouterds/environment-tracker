//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styles from './styles.css';
import Box from 'components/Box';
import BigChart from 'components/BigChart';
import wrapSensors from 'containers/Sensors';
import Sensors from 'components/Sensors';
import wrapNavigation from 'containers/Navigation';
import Navigation from 'components/Navigation';
import cx from 'classnames';

const WrappedSensors = wrapSensors(Sensors);
const WrappedNavigation = wrapNavigation(Navigation);

type State = {
  activeChart: string,
  activePeriod: string,
  temperatureChart: Array<number>,
  pressureChart: Array<number>,
  humidityChart: Array<number>,
  lightChart: Array<number>,
  temperature: {
    value: ?number,
    unit: ?string,
  },
  pressure: {
    value: ?number,
    unit: ?string,
  },
  humidity: {
    value: ?number,
    unit: ?string,
  },
  light: {
    value: ?number,
    unit: ?string,
  },
};

class App extends Component<{}, State> {
  /**
   * Constructor
   */
  constructor() {
    super(...arguments);

    // Default active chart, fallback to temperature
    let activeChart = 'temperature';
    if (location && location.hash) {
      activeChart = location.hash.replace('#', '');
    }

    // Default state
    this.state = {
      activeChart: activeChart,
      activePeriod: '1D',
      temperatureChart: [],
      pressureChart: [],
      humidityChart: [],
      lightChart: [],
      temperature: {
        value: null,
        unit: null,
      },
      pressure: {
        value: null,
        unit: null,
      },
      humidity: {
        value: null,
        unit: null,
      },
      light: {
        value: null,
        unit: null,
      },
    };
  }

  /**
   * Component did update
   */
  componentDidUpdate() {
    const { activeChart } = this.state;

    // Update hash on update
    window.location.hash = `#${activeChart}`;
  }

  /**
   * Parse sensor chart data
   *
   * @param {Object} data
   */
  handleSensorChartData(data: Object) {
    switch(data.sensor) {
      case 'bme280':
        this.setState({
          temperatureChart: data.data
            .map(measurement => measurement.type === 'temperature' ? parseFloat(measurement.value) : null)
            .filter(measurement => measurement !== null),
          pressureChart: data.data
            .map(measurement => measurement.type === 'pressure' ? parseFloat(measurement.value) : null)
            .filter(measurement => measurement !== null),
          humidityChart: data.data
            .map(measurement => measurement.type === 'humidity' ? parseFloat(measurement.value) : null)
            .filter(measurement => measurement !== null),
        });
        break;
      case 'bh1750':
        this.setState({
          lightChart: data.data
            .map(measurement => measurement.type === 'light' ? parseFloat(measurement.value) : null)
            .filter(measurement => measurement !== null),
          });
        break;
    }
  }

  /**
   * Render component
   *
   * @return {Node}
   */
  render(): Node {
    const {
      activeChart,
      temperatureChart,
      pressureChart,
      humidityChart,
      lightChart,
      temperature,
      pressure,
      humidity,
      light,
    } = this.state;

    let activeChartLabel = null;
    let activeChartColors = null;
    let activeChartData = null;
    let activeChartUnit = null;
    switch (activeChart) {
      case 'temperature':
        activeChartLabel = 'Temperature';
        activeChartColors = ['#ffb8b8', '#ffcccc'];
        activeChartData = temperatureChart;
        activeChartUnit = temperature.unit;
        break;
      case 'humidity':
        activeChartLabel = 'Humidity';
        activeChartColors = ['#a6cff7', '#c0ddfa'];
        activeChartData = humidityChart;
        activeChartUnit = humidity.unit;
        break;
      case 'pressure':
        activeChartLabel = 'Pressure';
        activeChartColors = ['#d6a6f7', '#e9c0fa'];
        activeChartData = pressureChart;
        activeChartUnit = pressure.unit;
        break;
      case 'light':
        activeChartLabel = 'Light';
        activeChartColors = ['#f7d487', '#fcebc4'];
        activeChartData = lightChart;
        activeChartUnit = light.unit;
        break;
    }

    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Raspberry Pi Environment Tracker</h1>
        <div className={styles.content}>
          <WrappedSensors className={(cx(styles.row, styles.rowSensors))} />

          <div className={cx(styles.row, styles.bigChartRow)}>
            <Box className={styles.bigChartBox}>
              <WrappedNavigation  />

              <BigChart
                className={styles.bigChart}
                label={activeChartLabel}
                data={activeChartData}
                colors={activeChartColors}
                unit={activeChartUnit}
              />
            </Box>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
