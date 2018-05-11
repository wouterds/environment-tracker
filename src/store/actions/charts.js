import { parse } from 'store/parsers/charts';

const SET_CHARTS = 'SET_CHARTS';

/**
 * Set charts
 *
 * @param {Object} data
 * @return {Object}
 */
const setCharts = (data) => {
  return {
    type: SET_CHARTS,
    charts: parse(data),
  };
};

export {
  SET_CHARTS,
  setCharts,
};
