import { createSelector } from 'reselect';
import { State } from './reducer';

export const selectTimeframe = (state: any) => state.timeframe;

export const getTimeframe = createSelector(
  [selectTimeframe],
  (state: State) => state.timeframe,
);
