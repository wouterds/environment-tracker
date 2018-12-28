import { Action } from '../types';
import { FETCH, FETCH_ERROR, FETCH_SUCCESS } from './actions';
import { Sample } from './types';

export interface State {
  isLoading: boolean;
  hasError: boolean;
  samples: Sample[];
}

const EMPTY_STATE: State = {
  isLoading: false,
  hasError: false,
  samples: [],
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
      const { samples } = payload;

      return {
        ...state,
        isLoading: false,
        hasError: false,
        samples,
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
