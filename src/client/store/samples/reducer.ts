import { filter } from 'lodash';
import { Action } from '../types';
import { FETCH, FETCH_ERROR, FETCH_SUCCESS, FINISHED } from './actions';
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
      const { samples: newSamples } = payload;
      let { samples } = state;

      const sensorId = newSamples ? newSamples[0].sensorId : null;

      samples = filter(
        samples,
        (sample: Sample) => sample.sensorId !== sensorId,
      );

      samples = [...samples, ...newSamples];

      return {
        ...state,
        hasError: false,
        samples,
      };
    case FINISHED:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_ERROR:
      return {
        ...state,
        hasError: true,
      };
    default:
      return state;
  }
};
