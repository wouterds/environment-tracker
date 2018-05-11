import { parse } from 'store/parsers/sensors';

const SET_SENSORS = 'SET_SENSORS';

/**
 * Set sensors
 *
 * @param {Object} data
 * @return {Object}
 */
const setSensors = (data) => {
  return {
    type: SET_SENSORS,
    sensors: parse(data),
  };
};

export {
  SET_SENSORS,
  setSensors,
};
