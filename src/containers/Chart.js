import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getActiveSensor } from 'store/selectors/activeSensor';
import { getCharts } from 'store/selectors/charts';

const Chart = (WrappedComponent) => {
  class Chart extends Component {
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
    const activeSensor = getActiveSensor(state);
    const charts = getCharts(state);

    return {
      label: _.capitalize(activeSensor),
      data: charts ? charts[activeSensor] : [],
      colors: ['#F00', '#0F0'],
      unit: 'tmp',
    };
  };

  return connect(mapStateToProps)(Chart);
};

export default Chart;
