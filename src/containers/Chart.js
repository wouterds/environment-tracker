import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getActiveSensor } from 'store/selectors/activeSensor';
import { getSensors } from 'store/selectors/sensors';
import { getCharts } from 'store/selectors/charts';
import { format as formatTemperature } from 'formatters/temperature';
import { format as formatPressure } from 'formatters/pressure';
import { format as formatHumidity } from 'formatters/humidity';
import { format as formatLight } from 'formatters/light';

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
    const sensors = getSensors(state);
    const charts = getCharts(state);

    let colors = [];
    switch (activeSensor) {
      case 'temperature':
        colors = ['#d63031', '#fab1a0'];
        break;
      case 'humidity':
        colors = ['#0984e3', '#74b9ff'];
        break;
      case 'pressure':
        colors = ['#6c5ce7', '#a29bfe'];
        break;
      case 'light':
        colors = ['#fdcb6e', '#ffeaa7'];
        break;
    }

    let formatter = [];
    switch (activeSensor) {
      case 'temperature':
        formatter = formatTemperature;
        break;
      case 'humidity':
        formatter = formatHumidity;
        break;
      case 'pressure':
        formatter = formatPressure;
        break;
      case 'light':
        formatter = formatLight;
        break;
    }

    // TODO: See if we can provide this from the API
    let unit = sensors[activeSensor] ? sensors[activeSensor].unit : null;

    return {
      label: _.capitalize(activeSensor),
      data: charts ? charts[activeSensor] : [],
      colors,
      unit,
      formatter,
    };
  };

  return connect(mapStateToProps)(Chart);
};

export default Chart;
