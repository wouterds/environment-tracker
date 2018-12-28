import * as React from 'react';
import withContainer from './container';
import styles from './styles.css';

interface Props {
  timeframe: number;
  timeframes: number[];
  setTimeframe: (timeframe: number) => void;
}

const Navigation = (props: Props) => {
  const { timeframe, timeframes, setTimeframe } = props;

  return (
    <ul className={styles.container}>
      {timeframes.map((item: number, index: number) => (
        <li
          key={`timeframe-${index}`}
          className={(item === timeframe && styles.active) || null}
          onClick={() => setTimeframe(item)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default withContainer(Navigation);
