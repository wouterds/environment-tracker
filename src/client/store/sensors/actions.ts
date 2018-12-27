import { createAction } from 'redux-actions';
import { Sensor } from './types';

export const FETCH = 'sensors.fetch';
export const FETCH_SUCCESS = 'sensors.fetchSuccess';
export const FETCH_ERROR = 'sensors.fetchError';

export const fetch = createAction(FETCH);
export const fetchSuccess = createAction(
  FETCH_SUCCESS,
  (sensors: Sensor[]) => ({
    sensors,
  }),
);
export const fetchError = createAction(FETCH_ERROR);
