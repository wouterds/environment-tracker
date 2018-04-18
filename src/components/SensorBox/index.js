//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styles from './styles.css';
import Box from 'components/Box';
import cx from 'classnames';

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

    return (
      <div className={cx(styles.container, className)}>
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
