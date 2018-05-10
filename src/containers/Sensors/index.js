import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSensors } from 'store/selectors/sensors'

const Sensors = (WrappedComponent) => {
  class Sensors extends Component {
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
      ...getSensors(state),
    };
  };

  return connect(mapStateToProps)(Sensors);
};

export default Sensors;
