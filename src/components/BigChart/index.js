//@flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import type { Node } from 'react';
import styles from './styles.css';
import Box from 'components/Box';
import _ from 'lodash';
import cx from 'classnames';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

type State = {
  height: number,
};

type Props = {
  className?: ?string,
  label: ?string,
  colors: ?Array<string>,
  data: ?Array<number>,
  unit: ?string,
};

class BigChart extends Component<Props, State> {
  ref: ?HTMLDivElement;

  constructor() {
    super(...arguments);

    this.state = {
      height: 0,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { data } = this.props;
    const { data: newData } = nextProps;
    const { height } = this.state;
    const { height: newHeight } = nextState;

    if (height === newHeight && _.isEqual(data, newData)) {
      return false;
    }

    return true;
  }

  componentDidMount() {
    this.updateHeight();
    window.addEventListener('resize', this.updateHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeight);
  }

  componentDidUpdate() {
    this.updateHeight();
  }

  updateHeight = () => {
    const height = this.ref ? this.ref.getBoundingClientRect().height : null;

    if (!height) {
      return;
    }

    this.setState({ height });
  }

  render(): Node {
    const { height } = this.state;
    const {
      className,
      colors,
      data,
      unit,
    } = this.props;

    const low = data ? Math.min(...data) : 0;
    const high = data ? Math.max(...data) : 0;
    const formattedData = {};
    if (data && data.length) {
        data.forEach(value => {
        const mutatedData = value - low + high * 0.05; // Will render better charts
        formattedData[mutatedData] = value;
      });
    }
    const formattedChartData = Object.keys(formattedData).map(value => {
      return { v: parseFloat(value) };
    });

    return (
      <div className={cx(styles.container, className)} ref={el => this.ref = el}>
        {formattedChartData &&
          <div className={styles.chart}>
            <ResponsiveContainer height={height * 0.9}>
              <AreaChart data={formattedChartData} strokeWidth={1.5}>
                <Area type='monotone' dataKey='v' stroke={colors ? colors[0] : null} fill={colors ? colors[1] : null} />
                <Tooltip content={(data) => {
                  data = data.payload;

                  if (!data || (data && data.length === 0)) {
                    return null;
                  }

                  data = data.pop();

                  return (
                    <div className={styles.chartValue}>
                      {(Math.round(formattedData[data.value] * 100) / 100).toFixed(2)}
                      <span className={styles.unit}>{unit}</span>
                    </div>
                  );
                }} position={{ y: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        }
      </div>
    );
  }
}

export default BigChart;
