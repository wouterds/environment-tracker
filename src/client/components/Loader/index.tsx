import * as React from 'react';
import styles from './styles.css';

interface Props {
  isLoading: boolean;
}

const Loader = (props: Props) => {
  const { isLoading } = props;

  if (!isLoading) {
    return null;
  }

  return (
    <div className={styles.container}>
      <svg viewBox="0 0 50 50" className={styles.indicator}>
        <circle
          className={styles.circle}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
      <span className={styles.text}>Loading..</span>
    </div>
  );
};

export default Loader;
