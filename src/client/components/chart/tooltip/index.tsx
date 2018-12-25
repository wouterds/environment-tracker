import { format } from 'date-fns';
import * as React from 'react';
import styles from './styles.css';

interface Sample {
  id: string;
  value: number | null;
  date: string;
}

interface Props {
  active: boolean;
  payload: Sample[];
  name: string;
  label: string;
  unit: string;
}

const ToolTip = (props: Props) => {
  const { active } = props;

  if (active) {
    const { payload, unit, label, name } = props;

    return (
      <div className={styles.container}>
        <p className={styles.value}>
          {name} {payload[0].value} {unit}
        </p>
        <p className={styles.label}>{format(label, 'MMMM Do, YYYY HH:mm a')}</p>
      </div>
    );
  }

  return null;
};

export default ToolTip;
