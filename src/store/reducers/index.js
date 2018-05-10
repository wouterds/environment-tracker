import { combineReducers } from 'redux';
import sensors from 'store/reducers/sensors';
import activeSensor from 'store/reducers/activeSensor';

const reducers = combineReducers({
  sensors,
  activeSensor,
});

export { reducers };
