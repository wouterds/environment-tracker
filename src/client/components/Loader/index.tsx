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
    <svg className={styles.container} viewBox="0 0 50 50">
      <circle
        className={styles.circle}
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      />
    </svg>
  );
};

export default Loader;
