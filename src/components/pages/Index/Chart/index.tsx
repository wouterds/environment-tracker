import axios from 'axios';
import Spinner from 'components/Spinner';
import maxBy from 'lodash/maxBy';
import meanBy from 'lodash/meanBy';
import minBy from 'lodash/minBy';
import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import CustomTooltip from '../Tooltip';
import {
  Chart,
  ChartContent,
  ChartFooter,
  CurrentValue,
  Title,
} from './styles';

interface Props {
  sensor: string;
  unit: string;
  color: string;
  syncId?: string;
  resolution: string;
}

export default (props: Props) => {
  const { sensor, unit, color, resolution, syncId } = props;
  const [data, setData] = useState<Array<{ value: number }>>([]);
  const [currentValue, setCurrentValue] = useState<number | null>(null);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const { data: response } = await axios.get(
          `${process.env.WEB_API_ENDPOINT}/measurements/${sensor}/averages?resolution=${resolution}`,
        );

        setData(response);
      } catch (e) {
        // tslint:disable-next-line
        console.error(e);
      }
    };

    const fetchCurrentValue = async () => {
      try {
        const { data: response } = await axios.get(
          `${process.env.SENSORS_API_ENDPOINT}/${sensor.replace(':', '/')}`,
        );

        setCurrentValue(response);
      } catch (e) {
        // tslint:disable-next-line
        console.error(e);
      }
    };

    fetchChart().catch();
    fetchCurrentValue().catch();

    const chartInterval = setInterval(fetchChart, 30000);
    const currentValueInterval = setInterval(fetchCurrentValue, 10000);

    return () => {
      clearInterval(chartInterval);
      clearInterval(currentValueInterval);
    };
  }, [sensor, resolution]);

  const high = maxBy(data, 'value');
  const average = meanBy(data, 'value') || null;
  const low = minBy(data, 'value');
  const last = data ? data[data.length - 1] : null;

  return (
    <Chart>
      <ChartContent>
        <Title>{sensor}</Title>
        {currentValue !== null && (
          <CurrentValue>
            {currentValue.toFixed(2)}
            <span>{unit}</span>
          </CurrentValue>
        )}
        {data.length === 0 && <Spinner />}
        {data.length > 0 && (
          <ResponsiveContainer width="99.9%" height="99.8%">
            <LineChart
              data={data}
              margin={{ left: 0, right: 0 }}
              syncId={syncId}
            >
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth="0.1rem"
                dot={false}
              />
              <YAxis domain={['auto', 'auto']} hide={true} />

              <Tooltip
                cursor={false}
                content={(tooltipProps: any) => (
                  <CustomTooltip {...tooltipProps} unit={unit} name={name} />
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartContent>
      <ChartFooter>
        <li>
          <label>Low</label>
          <span>
            {low ? (
              <>
                {low.value.toFixed(2)}
                <span>{unit}</span>
              </>
            ) : (
              '--'
            )}
          </span>
        </li>
        <li>
          <label>High</label>
          <span>
            {high ? (
              <>
                {high.value.toFixed(2)}
                <span>{unit}</span>
              </>
            ) : (
              '--'
            )}
          </span>
        </li>
        <li>
          <label>Average</label>
          <span>
            {average ? (
              <>
                {average.toFixed(2)}
                <span>{unit}</span>
              </>
            ) : (
              '--'
            )}
          </span>
        </li>
        <li>
          <label>Last</label>
          <span>
            {last ? (
              <>
                {last.value.toFixed(2)}
                <span>{unit}</span>
              </>
            ) : (
              '--'
            )}
          </span>
        </li>
      </ChartFooter>
    </Chart>
  );
};
