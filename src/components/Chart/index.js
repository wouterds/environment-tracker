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
  formatter: ?Function,
};

class Chart extends Component<Props, State> {
  ref: ?HTMLDivElement;

  /**
   * Constructor
   */
  constructor() {
    super(...arguments);

    this.state = {
      height: 0,
    };
  }

  /**
   * Should component update
   *
   * @param {Object} nextProps
   * @param {Object} nextState
   * @return {boolean}
   */
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

  /**
   * Component did mount
   */
  componentDidMount() {
    this.updateHeight();
    window.addEventListener('resize', this.updateHeight);
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeight);
  }

  /**
   * Component did update
   */
  componentDidUpdate() {
    this.updateHeight();
  }

  /**
   * Update height
   */
  updateHeight = () => {
    const height = this.ref ? this.ref.getBoundingClientRect().height : null;

    if (!height) {
      return;
    }

    this.setState({ height });
  }

  /**
   * Render
   *
   * @type {Node}
   */
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
    let formattedChartDataMap = {};
    const formattedChartData = data ? data.map(value => {
      // Will render fancier charts
      const mutatedData = value - low + high * 0.05;

      // Also add to map so we can display real value
      formattedChartDataMap[mutatedData] = value;

      return { v: parseFloat(mutatedData) };
    }) : null;

    return (
      <div className={cx(styles.container, className)} ref={el => this.ref = el}>
        {formattedChartData &&
          <div className={styles.chart}>
            <ResponsiveContainer height={height * 0.9}>
              <AreaChart data={formattedChartData} strokeWidth={1.5}>
                <Area animationDuration={500} type='monotone' dataKey='v' stroke={colors ? colors[0] : null} fill={colors ? colors[1] : null} />
                <Tooltip animationDuration={250} content={(data) => this.renderTooltip(formattedChartDataMap, data)} position={{ y: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        }
      </div>
    );
  }

  /**
   * Render tooltips
   *
   * @param {Object} data
   * @return {Node}
   */
  renderTooltip = (formattedChartDataMap: Object, data: Object): Node => {
    const { unit, formatter } = this.props;
    const { payload } = data;

    if (!payload || (payload && payload.length === 0)) {
      return null;
    }

    if (!formatter) {
      return null;
    }

    return (
      <div className={styles.value}>
        {formatter(formattedChartDataMap[payload.pop().value])}
        <span className={styles.unit}>{unit}</span>
      </div>
    );
  }
}

export default Chart;
