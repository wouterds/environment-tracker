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

  return <div className={styles.container} />;
};

export default Loader;
