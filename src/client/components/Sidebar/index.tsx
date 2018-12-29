import * as React from 'react';
import Loader from '../Loader';
import Navigation from './Navigation';
import styles from './styles.css';

interface Props {
  isLoading: boolean;
}

const Sidebar = (props: Props) => {
  const { isLoading } = props;

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Navigation />
      </div>
      <div className={styles.loader}>
        <Loader isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Sidebar;
