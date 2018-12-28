import { combineReducers } from 'redux';
import samples from './samples/reducer';
import sensors from './sensors/reducer';

export default combineReducers({
  sensors,
  samples,
});
