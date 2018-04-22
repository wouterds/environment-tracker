//@flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import type { Node } from 'react';
import styles from './styles.css';
import Box from 'components/Box';
import _ from 'lodash';
import cx from 'classnames';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

type State = {
  height: number,
};

type Props = {
  className?: ?string,
  chartData?: Array<number>,
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
    const { chartData } = this.props;
    const { chartData: newChartData } = nextProps;
    const { height } = this.state;
    const { height: newHeight } = nextState;

    if (height === newHeight && _.isEqual(chartData, newChartData)) {
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
      chartData,
    } = this.props;

    const low = chartData ? Math.min(...chartData) : 0;
    const formattedChartData = chartData ? chartData.map(value => {
      return { uv: value - low }; // Subtract low, we'll render the delta
    }) : null;

    return (
      <div className={cx(styles.container, className)} ref={el => this.ref = el}>
        {formattedChartData &&
          <div className={styles.chart}>
            <ResponsiveContainer height={height * 0.9}>
              <AreaChart data={formattedChartData} strokeWidth={1.5}>
                <Area type='monotone' dataKey='uv' stroke='#eeeeee' fill='#f7f7f7' />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        }
      </div>
    );
  }
}

export default BigChart;
