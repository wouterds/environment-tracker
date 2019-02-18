import * as React from 'react';
import Cell from '../';
import { Sample } from '../../../../store/samples/types';
import { Sensor, Type } from '../../../../store/sensors/types';
import Chart, { Scale } from '../../../Chart';
import styles from './styles.css';

interface Data {
  sensor: Sensor;
  samples: Sample[];
}

interface Props {
  isLoading: boolean;
  data: Data;
}

const title = (type: Type): string => {
  switch (type) {
    case Type.ILLUMINANCE:
      return 'Illuminance';
    case Type.PRESSURE:
      return 'Pressure';
    case Type.TEMPERATURE:
      return 'Temperature';
    case Type.HUMIDITY:
      return 'Relative Humidity';
  }

  return 'Unknown';
};

const color = (type: Type): string => {
  switch (type) {
    case Type.ILLUMINANCE:
      return '255, 234, 167';
    case Type.PRESSURE:
      return '181, 175, 255';
    case Type.TEMPERATURE:
      return '255, 153, 153';
    case Type.HUMIDITY:
      return '116, 185, 255';
  }

  return '255, 255, 255';
};

const scale = (type: Type): Scale => {
  switch (type) {
    case Type.ILLUMINANCE:
      return Scale.LOG;
  }

  return Scale.AUTO;
};

const ChartCell = (props: Props) => {
  const { data, isLoading } = props;
  const { sensor, samples } = data;

  if (!sensor) {
    return null;
  }

  const { type, unit } = sensor;

  return (
    <Cell title={title(type)} contentStyles={styles.content}>
      {samples.length > 0 && (
        <Chart
          syncId="sync-charts"
          isLoading={isLoading}
          identifier={type}
          name={title(type)}
          strokeColor={`rgb(${color(type)})`}
          fillColor={`rgba(${color(type)}, 0.1)`}
          scale={scale(type)}
          data={[...samples].reverse()}
          unit={unit}
        />
      )}
    </Cell>
  );
};

export default ChartCell;
