import { Action } from '../types';
import { SET } from './actions';

export interface State {
  timeframe: number;
}

const EMPTY_STATE: State = {
  timeframe: 24,
};

export default (state: State = EMPTY_STATE, action: Action) => {
  const { type, payload } = action;

  switch (type) {
    case SET:
      return {
        ...state,
        timeframe: payload,
      };
    default:
      return state;
  }
};
