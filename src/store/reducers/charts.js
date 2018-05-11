import { SET_CHARTS } from 'store/actions/charts';

const DEFAULT_CHARTS = {};

const charts = (state = DEFAULT_CHARTS, action) => {
  switch (action.type) {
    case SET_CHARTS:
      return {
        ...state,
        ...action.charts
      };
    default:
      return state;
  }
};

export default charts;
