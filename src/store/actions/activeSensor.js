const SET_ACTIVE_SENSOR = 'SET_ACTIVE_SENSOR';

/**
 * Set active sensor
 *
 * @param {string} sensor
 * @return {Object}
 */
const setActiveSensor = (sensor) => {
  return {
    type: SET_ACTIVE_SENSOR,
    sensor,
  };
};

export {
  SET_ACTIVE_SENSOR,
  setActiveSensor,
};
