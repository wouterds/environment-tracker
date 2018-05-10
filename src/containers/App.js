import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSensors } from 'store/selectors/sensors';
import { getActiveSensor } from 'store/selectors/activeSensor';
import { setSensors } from 'store/actions/sensors';
import { setActiveSensor } from 'store/actions/activeSensor';

const App = (WrappedComponent) => {
  class App extends Component {
    /**
     * Component will receive props
     *
     * @param {Object} nextProps
     */
    componentWillReceiveProps(nextProps) {
      const { setActiveSensor } = this.props;

      // No active sensor yet but we do have temperature sensor
      if (nextProps.sensors.temperature && !nextProps.activeSensor) {
        setActiveSensor('temperature');
      }
    }

    /**
     * Render
     *
     * @returns {Node}
     */
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  /**
   * Map state to props
   *
   * @param {Object} state
   * @return {Object}
   */
  const mapStateToProps = (state) => {
    return {
      sensors: getSensors(state),
      activeSensor: getActiveSensor(state),
    };
  };

  /**
   * Map dispatch to props
   *
   * @param {Function} dispatch
   * @return {Object}
   */
  const mapDispatchToProps = (dispatch) => {
    return {
      setSensors: (data) => {
        dispatch(setSensors(data));
      },
      setActiveSensor: (data) => {
        dispatch(setActiveSensor(data));
      },
    };
  };

  return connect(mapStateToProps, mapDispatchToProps)(App);
};

export default App;
