import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSensors } from 'store/selectors/sensors';
import { getActiveSensor } from 'store/selectors/activeSensor';
import { setSensors } from 'store/actions/sensors';
import { setActiveSensor } from 'store/actions/activeSensor';

const App = (WrappedComponent) => {
  class App extends Component {
    /**
     * Component did mount
     */
    componentDidMount() {
      this.connect();
    }

    /**
     * Component will receive props
     *
     * @param {Object} nextProps
     */
    componentWillReceiveProps(nextProps) {
      const { setActiveSensor, activeSensor } = this.props;

      // No active sensor yet but we do have temperature sensor
      if (nextProps.sensors.temperature && !nextProps.activeSensor) {
        setActiveSensor('temperature');
      }

      if (activeSensor !== nextProps.activeSensor) {
        window.location.hash = `#${nextProps.activeSensor}`;
      }
    }

    /**
     * Connect to websocket
     */
    connect() {
      // Source
      // const source = `${location.protocol === 'https:' ? 'wss' : 'ws'}:/${location.host}/api`;
      const source = 'wss://tracker.wouterdeschuyter.be/api';

      // Open connection
      const websocket = new WebSocket(source);

      // Subscribe to new messages
      websocket.onmessage = this.newMessage;
    };

    /**
     * New message from socket
     *
     * @param {Object} rawData
     */
    newMessage = (event: Object) => {
      const { setSensors } = this.props;
      const data = JSON.parse(event.data);

      switch (data.type) {
        // Sensor data
        case 'sensor-data':
          setSensors(data);
          break;
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
