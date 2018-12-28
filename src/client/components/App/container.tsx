import * as React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fetch as fetchSensors } from '../../store/sensors/actions';
import { getSensors } from '../../store/sensors/selectors';
import { TIMEFRAMES } from '../../store/timeframe/config';

interface Props {
  fetchSensors: () => void;
}

const wrapApp = (WrappedComponent: any) => {
  class App extends React.Component<Props> {
    public componentDidMount() {
      this.fetch();
    }

    public render() {
      const props = {
        ...this.props,
        timeframes: TIMEFRAMES,
      };

      return <WrappedComponent {...props} />;
    }

    private fetch = () => {
      this.props.fetchSensors();
    };
  }

  const mapStateToProps = (state: any) =>
    createStructuredSelector({
      sensors: getSensors,
    })(state);

  const mapDispatchToProps = {
    fetchSensors,
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App);
};

export default wrapApp;
