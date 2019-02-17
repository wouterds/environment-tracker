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
          {item === 3 && '3 hours'}
          {item === 6 && '6 hours'}
          {item === 12 && '12 hours'}
          {item === 24 && '1 day'}
          {item === 48 && '2 days'}
          {item === 72 && '3 days'}
          {item === 168 && '1 week'}
          {item === 336 && '2 weeks'}
          {item === 504 && '3 weeks'}
          {item === 672 && '1 month'}
          {item === 1344 && '2 months'}
        </li>
      ))}
    </ul>
  );
};

export default withContainer(Navigation);
