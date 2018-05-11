import { combineReducers } from 'redux';
import activeSensor from 'store/reducers/activeSensor';
import sensors from 'store/reducers/sensors';
import charts from 'store/reducers/charts';

const reducers = combineReducers({
  activeSensor,
  sensors,
  charts,
});

export { reducers };
