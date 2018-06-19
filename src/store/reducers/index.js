import { combineReducers } from 'redux';
import activeSensor from 'store/reducers/activeSensor';
import activePeriod from 'store/reducers/activePeriod';
import sensors from 'store/reducers/sensors';
import periods from 'store/reducers/periods';
import charts from 'store/reducers/charts';

const reducers = combineReducers({
  activeSensor,
  activePeriod,
  sensors,
  periods,
  charts,
});

export { reducers };
