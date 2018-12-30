import { maxBy, minBy } from 'lodash';
import * as React from 'react';
import Cell from '../';
import { Sample } from '../../../../store/samples/types';
import { Sensor, Type } from '../../../../store/sensors/types';
import HighlightedNumber from '../../../HighlightedNumber';
import styles from './styles.css';

interface Data {
  sensor: Sensor;
  samples: Sample[];
}

interface Props {
  data: {
    [Type.ILLUMINANCE]: Data;
    [Type.HUMIDITY]: Data;
    [Type.TEMPERATURE]: Data;
    [Type.PRESSURE]: Data;
    [Type.ECO2]: Data;
  };
}

const title = (type: Type): string => {
  switch (type) {
    case Type.ECO2:
      return 'eCO2';
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

const getSummary = (
  samples: Sample[],
): {
  min: number | null;
  max: number | null;
  diff: number | null;
  current: number | null;
} => {
  const minSample = (samples.length > 0 && minBy(samples, 'value')) || null;
  const maxSample = (samples.length > 0 && maxBy(samples, 'value')) || null;

  const min = (minSample && minSample.value) || null;
  const max = (maxSample && maxSample.value) || null;
  const diff = (min !== null && max !== null && max - min) || null;
  const current = (samples.length > 0 && samples[0].value) || null;

  return { min, max, diff, current };
};

const SummnaryCell = (props: Props) => {
  const { data } = props;
  const { [Type.ILLUMINANCE]: illuminance } = data;
  const { [Type.HUMIDITY]: humidity } = data;
  const { [Type.TEMPERATURE]: temperature } = data;
  const { [Type.PRESSURE]: pressure } = data;
  const { [Type.ECO2]: eco2 } = data;

  const summaryIlluminance =
    (illuminance && getSummary(illuminance.samples)) || null;
  const summaryHumidity = (humidity && getSummary(humidity.samples)) || null;
  const summaryTemperature =
    (temperature && getSummary(temperature.samples)) || null;
  const summaryPressure = (pressure && getSummary(pressure.samples)) || null;
  const summaryECO2 = (pressure && getSummary(eco2.samples)) || null;

  return (
    <Cell title="Summary">
      <table className={styles.container}>
        <tbody>
          <tr>
            <th />
            <th>
              {temperature.sensor &&
                `${title(temperature.sensor.type)} (${
                  temperature.sensor.unit
                })`}
            </th>
            <th>
              {humidity.sensor &&
                `${title(humidity.sensor.type)} (${humidity.sensor.unit})`}
            </th>
            <th>
              {eco2.sensor &&
                `${title(eco2.sensor.type)} (${eco2.sensor.unit})`}
            </th>
            <th>
              {illuminance.sensor &&
                `${title(illuminance.sensor.type)} (${
                  illuminance.sensor.unit
                })`}
            </th>
            <th>
              {pressure.sensor &&
                `${title(pressure.sensor.type)} (${pressure.sensor.unit})`}
            </th>
          </tr>
          <tr>
            <th>Current</th>
            <td>
              <HighlightedNumber value={summaryTemperature.current} />
            </td>
            <td>
              <HighlightedNumber value={summaryHumidity.current} />
            </td>
            <td>
              <HighlightedNumber value={summaryECO2.current} />
            </td>
            <td>
              <HighlightedNumber value={summaryIlluminance.current} />
            </td>
            <td>
              <HighlightedNumber value={summaryPressure.current} />
            </td>
          </tr>
          <tr>
            <th>Min</th>
            <td>
              <HighlightedNumber value={summaryTemperature.min} />
            </td>
            <td>
              <HighlightedNumber value={summaryHumidity.min} />
            </td>
            <td>
              <HighlightedNumber value={summaryECO2.min} />
            </td>
            <td>
              <HighlightedNumber value={summaryIlluminance.min} />
            </td>
            <td>
              <HighlightedNumber value={summaryPressure.min} />
            </td>
          </tr>
          <tr>
            <th>Max</th>
            <td>
              <HighlightedNumber value={summaryTemperature.max} />
            </td>
            <td>
              <HighlightedNumber value={summaryHumidity.max} />
            </td>
            <td>
              <HighlightedNumber value={summaryECO2.max} />
            </td>
            <td>
              <HighlightedNumber value={summaryIlluminance.max} />
            </td>
            <td>
              <HighlightedNumber value={summaryPressure.max} />
            </td>
          </tr>
          <tr>
            <th>Diff</th>
            <td>
              <HighlightedNumber value={summaryTemperature.diff} />
            </td>
            <td>
              <HighlightedNumber value={summaryHumidity.diff} />
            </td>
            <td>
              <HighlightedNumber value={summaryECO2.diff} />
            </td>
            <td>
              <HighlightedNumber value={summaryIlluminance.diff} />
            </td>
            <td>
              <HighlightedNumber value={summaryPressure.diff} />
            </td>
          </tr>
        </tbody>
      </table>
    </Cell>
  );
};

export default SummnaryCell;
