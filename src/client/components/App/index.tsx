import * as React from 'react';
import { Sensor } from '../../store/sensors/types';
import withContainer from './container';

interface Props {
  timeframes: number[];
  sensors: Sensor[];
}

class App extends React.Component<Props> {
  public render() {
    console.log({ props: this.props });

    return <div />;
  }
}

export default withContainer(App);
