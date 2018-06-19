import { SET_ACTIVE_PERIOD } from 'store/actions/activePeriod';

const DEFAULT_ACTIVE_PERIOD = '1D';

const activePeriod = (state = DEFAULT_ACTIVE_PERIOD, action) => {
  switch (action.type) {
    case SET_ACTIVE_PERIOD:
      return action.period;
    default:
      return state;
  }
};

export default activePeriod;
