//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styles from './styles.css';

type State = {
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
    const websocket = new WebSocket('ws://raspberrypi2');

    websocket.onmessage = (data: Object) => this.handleSensorData(JSON.parse(data.data));
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
      case 'tmp102':
        break; // tmp102 seems to be less accurate
        // this.handleTemperatureSensorData(data.data);
        // break;
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

  render(): Node {
    const {
      temperature,
      pressure,
      humidity,
      light,
      activity,
    } = this.state;

    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Raspberry Pi Environment Tracker</h1>
        <ul className={styles.list}>
          <li>Temperature: {temperature.value && temperature.value.toFixed(2)} {temperature.unit}</li>
          <li>Humidity: {humidity.value && humidity.value.toFixed(2)}{humidity.unit}</li>
          <li>Pressure: {pressure.value && pressure.value.toFixed(2)} {pressure.unit}</li>
          <li>Light: {light.value && light.value.toFixed(2)} {light.unit}</li>
          <li>Activity: {activity ? 'Yes' : 'No'}</li>
        </ul>
      </div>
    );
  }
}

export default App;
