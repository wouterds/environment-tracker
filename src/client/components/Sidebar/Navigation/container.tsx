import * as React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { set as setTimeframe } from '../../../store/timeframe/actions';
import { TIMEFRAMES } from '../../../store/timeframe/config';
import { getTimeframe } from '../../../store/timeframe/selectors';

const wrapNavigation = (WrappedComponent: any) => {
  const Navigation = (props: any) => {
    return <WrappedComponent {...props} timeframes={TIMEFRAMES} />;
  };

  const mapStateToProps = (state: any) => {
    return createStructuredSelector({
      timeframe: getTimeframe,
    })(state);
  };

  const mapDispatchToProps = {
    setTimeframe,
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Navigation);
};

export default wrapNavigation;
