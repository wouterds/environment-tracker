//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styles from './styles.css';
import Box from 'components/Box';

type Props = {
  label: ?string,
  value: ?string,
  unit?: ?string,
};

class SensorBox extends Component<Props> {
  render(): Node {
    const {
      label,
      value,
      unit,
    } = this.props;

    return (
      <div className={styles.container}>
        <Box className={styles.content}>
          <span className={styles.value}>{value}</span>
          <span className={styles.unit}>{unit}</span>
          <label className={styles.label}>{label}</label>
        </Box>
      </div>
    );
  }
}

export default SensorBox;
