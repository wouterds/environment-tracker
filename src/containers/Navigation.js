import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSensors } from 'store/selectors/sensors';
import { getActiveSensor } from 'store/selectors/activeSensor';
import { setActiveSensor } from 'store/actions/activeSensor';
import { getPeriods } from 'store/selectors/periods';
import { getActivePeriod } from 'store/selectors/activePeriod';
import { setActivePeriod } from 'store/actions/activePeriod';

const Navigation = (WrappedComponent) => {
  class Navigation extends Component {
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
      activeSensor: getActiveSensor(state),
      periods: getPeriods(state),
      activePeriod: getActivePeriod(state),
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
      setActiveSensor: (sensor) => {
        dispatch(setActiveSensor(sensor));
      },
      setActivePeriod: (period) => {
        dispatch(setActivePeriod(period));
      },
    };
  };

  return connect(mapStateToProps, mapDispatchToProps)(Navigation);
};

export default Navigation;
