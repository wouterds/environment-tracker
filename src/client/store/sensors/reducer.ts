import { Action } from '../types';
import { FETCH, FETCH_ERROR, FETCH_SUCCESS } from './actions';
import { Sensor } from './types';

export interface State {
  isLoading: boolean;
  hasError: boolean;
  sensors: Sensor[];
}

const EMPTY_STATE: State = {
  isLoading: false,
  hasError: false,
  sensors: [],
};

export default (state: State = EMPTY_STATE, action: Action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case FETCH_SUCCESS:
      const { sensors } = payload;

      return {
        ...state,
        isLoading: false,
        hasError: false,
        sensors,
      };
    case FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        hasError: true,
      };
    default:
      return state;
  }
};
