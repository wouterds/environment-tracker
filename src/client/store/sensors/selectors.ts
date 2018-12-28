import { createSelector } from 'reselect';
import { State } from './reducer';

export const selectSensors = (state: any) => state.sensors;

export const getSensors = createSelector(
  [selectSensors],
  (state: State) => state.sensors,
);
