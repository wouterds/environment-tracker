import classNames from 'classnames';
import * as React from 'react';
import Chart from './Chart';
import styles from './styles.css';
import Summary from './Summary';

interface Props {
  title: string;
  children: React.ReactNode;
  contentStyles?: any;
}

const Cell = (props: Props) => {
  const { title, children, contentStyles } = props;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <label className={styles.label}>{title}</label>
      </header>
      <div className={classNames(styles.content, contentStyles)}>
        {children}
      </div>
    </div>
  );
};

Cell.Chart = Chart;
Cell.Summary = Summary;

export default Cell;
