import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setSensors } from 'store/actions/sensors'

const App = (WrappedComponent) => {
  class App extends Component {
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
    };
  };

  return connect(null, mapDispatchToProps)(App);
};

export default App;
