import * as React from 'react';
import Navigation from './Navigation';
import styles from './styles.css';

const Sidebar = () => {
  return (
    <div className={styles.container}>
      <Navigation />
    </div>
  );
};

export default Sidebar;
