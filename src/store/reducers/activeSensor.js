import { SET_ACTIVE_SENSOR } from 'store/actions/activeSensor';

const EMPTY_ACTIVE_SENSOR = null;

const activeSensor = (state = EMPTY_ACTIVE_SENSOR, action) => {
  switch (action.type) {
    case SET_ACTIVE_SENSOR:
      return action.sensor;
    default:
      return state;
  }
};

export default activeSensor;
