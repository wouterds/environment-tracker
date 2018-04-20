//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styles from './styles.css';
import Box from 'components/Box';
import cx from 'classnames';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

type Props = {
  className?: ?string,
  label: ?string,
  value: ?string,
  unit?: ?string,
  chartData?: Array<number>,
};

class SensorBox extends Component<Props> {
  render(): Node {
    const {
      className,
      label,
      value,
      unit,
      chartData,
    } = this.props;
    const formattedChartData = chartData ? chartData.map(value => {
      return { uv: value };
    }) : null;

    return (
      <div className={cx(styles.container, className)}>
        <Box className={styles.content}>
          <span className={styles.value}>{value}</span>
          <span className={styles.unit}>{unit}</span>
          <label className={styles.label}>{label}</label>
          {formattedChartData &&
            <div className={styles.chart}>
              <ResponsiveContainer height={65}>
                <AreaChart data={formattedChartData}>
                  <Area type='monotone' dataKey='uv' stroke='#eeeeee' fill='#fafafa' />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          }
        </Box>
      </div>
    );
  }
}

export default SensorBox;
