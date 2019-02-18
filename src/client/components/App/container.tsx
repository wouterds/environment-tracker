import { filter, find } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getIsLoading, getSamples } from '../../store/samples/selectors';
import { Sample } from '../../store/samples/types';
import { fetch as fetchSensors } from '../../store/sensors/actions';
import { getSensors } from '../../store/sensors/selectors';
import { Sensor, Type } from '../../store/sensors/types';

interface Props {
  fetchSensors: () => void;
  sensors: Sensor[];
  samples: Sample[];
  isLoading: boolean;
}

const wrapApp = (WrappedComponent: any) => {
  class App extends React.Component<Props> {
    public componentDidMount() {
      this.fetch();
    }

    public render() {
      const { sensors, samples, isLoading } = this.props;

      const illuminanceSensor = find(sensors, { type: Type.ILLUMINANCE });
      const humiditySensor = find(sensors, { type: Type.HUMIDITY });
      const temperatureSensor = find(sensors, { type: Type.TEMPERATURE });
      const pressureSensor = find(sensors, { type: Type.PRESSURE });

      const props = {
        isLoading,
        data: {
          [Type.ILLUMINANCE]: {
            sensor: illuminanceSensor,
            samples:
              (illuminanceSensor
                ? filter(samples, { sensorId: illuminanceSensor.id })
                : []) || [],
          },
          [Type.HUMIDITY]: {
            sensor: humiditySensor,
            samples:
              (humiditySensor
                ? filter(samples, { sensorId: humiditySensor.id })
                : []) || [],
          },
          [Type.TEMPERATURE]: {
            sensor: temperatureSensor,
            samples:
              (temperatureSensor
                ? filter(samples, { sensorId: temperatureSensor.id })
                : []) || [],
          },
          [Type.PRESSURE]: {
            sensor: pressureSensor,
            samples:
              (pressureSensor
                ? filter(samples, { sensorId: pressureSensor.id })
                : []) || [],
          },
        },
      };

      return <WrappedComponent {...props} />;
    }

    private fetch = () => {
      this.props.fetchSensors();
    };
  }

  const mapStateToProps = (state: any) => {
    return createStructuredSelector({
      sensors: getSensors,
      samples: getSamples,
      isLoading: getIsLoading,
    })(state);
  };

  const mapDispatchToProps = {
    fetchSensors,
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App);
};

export default wrapApp;
