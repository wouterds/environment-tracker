//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styles from './styles.css';
import Box from 'components/Box';
import _ from 'lodash';
import cx from 'classnames';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

type Props = {
  className?: ?string,
  onClick?: Function,
  label: ?string,
  value: ?string,
  unit?: ?string,
  chartData?: Array<number>,
};

class Sensor extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const { value, chartData } = this.props;
    const { value: newValue, chartData: newChartData } = nextProps;

    if (_.isEqual(chartData, newChartData) && value === newValue) {
      return false;
    }

    return true;
  }

  render(): Node {
    const {
      onClick,
      className,
      label,
      value,
      unit,
      chartData,
    } = this.props;

    const low = chartData ? Math.min(...chartData) : 0;
    const high = chartData ? Math.max(...chartData) : 0;
    const formattedChartData = chartData ? chartData.map(value => {
    return { uv: value - low + high * 0.1 }; // Render nice delta chart
    }) : null;

    return (
      <div className={cx(styles.container, className)} onClick={onClick}>
        <Box className={styles.content}>
          <span className={styles.value}>{value}</span>
          <span className={styles.unit}>{unit}</span>
          <label className={styles.label}>{label}</label>
          {formattedChartData &&
            <div className={styles.chart}>
              <ResponsiveContainer height={70}>
                <AreaChart data={formattedChartData}>
                  <Area type='monotone' dataKey='uv' stroke='#eeeeee' fill='#f7f7f7' />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          }
        </Box>
      </div>
    );
  }
}

export default Sensor;
