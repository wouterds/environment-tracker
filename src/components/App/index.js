//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styles from './styles.css';
import Box from 'components/Box';
import BigChart from 'components/BigChart';
import wrapSensors from 'containers/Sensors';
import Sensors from 'components/Sensors';
import cx from 'classnames';

const WrappedSensors = wrapSensors(Sensors);

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
   * Render navigation
   */
  renderNavigation(): Node {
    const {
      activeChart,
      activePeriod,
      temperature,
      pressure,
      humidity,
      light,
    } = this.state;

    const temperatureValue = temperature.value ? temperature.value.toFixed(2) : null;
    const humidityValue = humidity.value ? humidity.value.toFixed(2) : null;
    const pressureValue = pressure.value ? pressure.value.toFixed(pressure.value > 100 ? 0 : 2) : null;
    const lightValue = light.value ? light.value.toFixed(light.value > 100 ? 0 : 2) : null;

    return (
      <div className={styles.legend}>
        <div className={styles.left}>
          <select className={styles.mobileSelect} defaultValue={activeChart} onChange={(event) => this.setState({ activeChart: event.target.value })}>
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="pressure">Pressure</option>
            <option value="light">Light</option>
          </select>

          <ul>
            <li className={cx(styles.legendItem, activeChart === 'temperature' ? styles.active : null)} onClick={() => this.setState({ activeChart: 'temperature' })}>
              Temperature &middot; {temperatureValue}
              <span className={styles.legendUnit}>{temperature.unit}</span>
            </li>
            <li className={cx(styles.legendItem, activeChart === 'humidity' ? styles.active : null)} onClick={() => this.setState({ activeChart: 'humidity' })}>
              Humidity &middot; {humidityValue}
              <span className={styles.legendUnit}>{humidity.unit}</span>
            </li>
            <li className={cx(styles.legendItem, activeChart === 'pressure' ? styles.active : null)} onClick={() => this.setState({ activeChart: 'pressure' })}>
              Pressure &middot; {pressureValue}
              <span className={styles.legendUnit}>{pressure.unit}</span>
            </li>
            <li className={cx(styles.legendItem, activeChart === 'light' ? styles.active : null)} onClick={() => this.setState({ activeChart: 'light' })}>
              Light &middot; {lightValue}
              <span className={styles.legendUnit}>{light.unit}</span>
            </li>
          </ul>
        </div>
        <div className={styles.right}>
          <ul>
            <li className={cx(styles.legendItem, activePeriod === '1D' ? styles.active : null)} onClick={() => alert('🚧 🛠 🔜')}>
              1D
            </li>
            <li className={cx(styles.legendItem, activePeriod === '1W' ? styles.active : null)} onClick={() => alert('🚧 🛠 🔜')}>
              1W
            </li>
            <li className={cx(styles.legendItem, activePeriod === '1M' ? styles.active : null)} onClick={() => alert('🚧 🛠 🔜')}>
              1M
            </li>
          </ul>
        </div>
      </div>
    );
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
              {this.renderNavigation()}

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
