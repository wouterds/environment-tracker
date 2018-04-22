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
  label: ?string,
  colors: ?Array<string>,
  data: ?Array<number>,
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
    } = this.props;

    const low = data ? Math.min(...data) : 0;
    const high = data ? Math.max(...data) : 0;
    const formattedChartData = data ? data.map(value => {
      return { uv: value - low + high * 0.05 }; // Render nice delta chart
    }) : null;

    return (
      <div className={cx(styles.container, className)} ref={el => this.ref = el}>
        {formattedChartData &&
          <div className={styles.chart}>
            <ResponsiveContainer height={height * 0.9}>
              <AreaChart data={formattedChartData} strokeWidth={1.5}>
                <Area type='monotone' dataKey='uv' stroke={colors ? colors[0] : null} fill={colors ? colors[1] : null} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        }
      </div>
    );
  }
}

export default BigChart;
