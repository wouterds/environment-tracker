import { combineReducers } from 'redux';
import sensors from 'store/reducers/sensors';

const reducers = combineReducers({
  sensors,
});

export { reducers };
