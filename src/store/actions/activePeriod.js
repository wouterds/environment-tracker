const SET_ACTIVE_PERIOD = 'SET_ACTIVE_PERIOD';

/**
 * Set active period
 *
 * @param {string} period
 * @return {Object}
 */
const setActivePeriod = (period) => {
  return {
    type: SET_ACTIVE_PERIOD,
    period,
  };
};

export {
  SET_ACTIVE_PERIOD,
  setActivePeriod,
};
