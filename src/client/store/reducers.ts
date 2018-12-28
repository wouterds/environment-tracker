import { combineReducers } from 'redux';
import samples from './samples/reducer';
import sensors from './sensors/reducer';
import timeframe from './timeframe/reducer';

export default combineReducers({
  sensors,
  samples,
  timeframe,
});
