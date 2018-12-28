import * as React from 'react';
import { Sample } from '../../store/samples/types';
import { Sensor, Type } from '../../store/sensors/types';
import withContainer from './container';

interface Props {
  timeframe: number;
  timeframes: number[];
  sensors: Sensor[];
  samples: {
    [Type.ILLUMINANCE]: Sample[];
    [Type.HUMIDITY]: Sample[];
    [Type.TEMPERATURE]: Sample[];
    [Type.PRESSURE]: Sample[];
    [Type.ECO2]: Sample[];
  };
}

class App extends React.Component<Props> {
  public render() {
    console.log({ props: this.props });

    return <div />;
  }
}

export default withContainer(App);
