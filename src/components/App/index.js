//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styles from './styles.css';
import SensorBox from 'components/SensorBox';

declare var __PRODUCTION__:boolean;

type State = {
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
  activity: boolean,
};

class App extends Component<{}, State> {
  constructor() {
    super(...arguments);

    this.state = {
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
      activity: false,
    };
  }

  componentDidMount() {
    const websocket = new WebSocket(`ws://${__PRODUCTION__ ? location.host : 'raspberrypi2'}:3000`);

    websocket.onmessage = (data: Object) => this.socketMessage(JSON.parse(data.data));
  }

  socketMessage(data: Object) {
    switch (data.type) {
      case 'sensor-data':
        this.handleSensorData(data);
        break;
      case 'sensor-chart-data':
        this.handleSensorChartData(data);
        break;
    }
  }

  handleSensorData(data: Object) {
    switch (data.sensor) {
      case 'bme280':
        this.handleTemperatureSensorData(data.data);
        this.handlePressureSensorData(data.data);
        this.handleHumiditySensorData(data.data);
        break;
      case 'bh1750':
        this.handleLightSensorData(data.data);
        break;
      case 'pir':
        this.handleActivitySensorData(data.data);
        break;
    }
  }

  handleTemperatureSensorData(data: Object) {
    const { temperature } = this.state;

    let newTemperature = {
      value: data.temperature.value,
      unit: data.temperature.unit,
    };

    if (temperature.value !== null) {
      newTemperature.value = newTemperature.value + temperature.value;
      newTemperature.value = newTemperature.value / 2;
      newTemperature.value = Math.round(newTemperature.value * 100) / 100;
    }

    this.setState({
      temperature: newTemperature,
    });
  }

  handlePressureSensorData(data: Object) {
    const { pressure } = this.state;

    let newPressure = {
      value: data.pressure.value,
      unit: data.pressure.unit,
    };

    if (pressure.value !== null) {
      newPressure.value = newPressure.value + pressure.value;
      newPressure.value = newPressure.value / 2;
      newPressure.value = Math.round(newPressure.value * 100) / 100;
    }

    this.setState({
      pressure: newPressure,
    });
  }

  handleHumiditySensorData(data: Object) {
    const { humidity } = this.state;

    let newHumidity = {
      value: data.humidity.value,
      unit: data.humidity.unit,
    };

    if (humidity.value !== null) {
      newHumidity.value = newHumidity.value + humidity.value;
      newHumidity.value = newHumidity.value / 2;
      newHumidity.value = Math.round(newHumidity.value * 100) / 100;
    }

    this.setState({
      humidity: newHumidity,
    });
  }

  handleLightSensorData(data: Object) {
    const { light } = this.state;

    let newLight = {
      value: data.light.value,
      unit: data.light.unit,
    };

    if (light.value !== null) {
      newLight.value = newLight.value + light.value;
      newLight.value = newLight.value / 2;
      newLight.value = Math.round(newLight.value * 100) / 100;
    }

    this.setState({
      light: newLight,
    });
  }

  handleActivitySensorData(data: boolean) {
    this.setState({
      activity: data,
    });
  }

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

  render(): Node {
    const {
      temperature,
      temperatureChart,
      pressure,
      pressureChart,
      humidity,
      humidityChart,
      light,
      lightChart,
      activity,
    } = this.state;

    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Raspberry Pi Environment Tracker</h1>
        <div className={styles.content}>
          <SensorBox
            className={styles.sensorBox}
            label="Temperature"
            unit={temperature.unit}
            value={temperature.value ? temperature.value.toFixed(2) : null}
            chartData={temperatureChart}
          />
          <SensorBox
            className={styles.sensorBox}
            label="Humidity"
            unit={humidity.unit}
            value={humidity.value ? humidity.value.toFixed(2) : null}
            chartData={humidityChart}
          />
          <SensorBox
            className={styles.sensorBox}
            label="Pressure"
            unit={pressure.unit}
            value={pressure.value ? pressure.value.toFixed(pressure.value > 100 ? 0 : 2) : null}
            chartData={pressureChart}
          />
          <SensorBox
            className={styles.sensorBox}
            label="Light"
            unit={light.unit}
            value={light.value ? light.value.toFixed(light.value > 100 ? 0 : 2) : null}
            chartData={lightChart}
          />
          <SensorBox
            className={styles.sensorBox}
            label="Activity"
            value={activity ? 'Yes' : 'No'}
          />
        </div>
      </div>
    );
  }
}

export default App;
