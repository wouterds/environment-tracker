import { SET_ACTIVE_SENSOR } from 'store/actions/activeSensor';

const DEFAULT_ACTIVE_SENSOR = location && location.hash ? location.hash.replace('#', '') : null;

const activeSensor = (state = DEFAULT_ACTIVE_SENSOR, action) => {
  switch (action.type) {
    case SET_ACTIVE_SENSOR:
      return action.sensor;
    default:
      return state;
  }
};

export default activeSensor;
