import { SET_SENSORS } from 'store/actions/sensors';

const EMPTY_SENSORS = {};

const sensors = (state = EMPTY_SENSORS, action) => {
  switch (action.type) {
    case SET_SENSORS:
      return {
        ...state,
        ...action.sensors
      };
    default:
      return state;
  }
};

export default sensors;
