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
};

class SensorBox extends Component<Props> {
  render(): Node {
    const {
      className,
      label,
      value,
      unit,
    } = this.props;
    const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    ];

    return (
      <div className={cx(styles.container, className)}>
        <Box className={styles.content}>
          <span className={styles.value}>{value}</span>
          <span className={styles.unit}>{unit}</span>
          <label className={styles.label}>{label}</label>

          <div className={styles.chart}>
            <ResponsiveContainer height={75}>
              <AreaChart data={data}>
                <Area type='monotone' dataKey='uv' stroke='#eeeeee' fill='#fafafa' />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Box>
      </div>
    );
  }
}

export default SensorBox;
