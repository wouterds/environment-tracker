import axios from 'axios';
import maxBy from 'lodash/maxBy';
import meanBy from 'lodash/meanBy';
import minBy from 'lodash/minBy';
import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import CustomTooltip from '../Tooltip';
import { Chart, ChartContent, ChartFooter, LastValue } from './styles';

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
  const [lastValue, setLastValue] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        (async () => {
          const { data: response } = await axios.get(
            `${process.env.WEB_API_ENDPOINT}/measurements/${sensor}/averages?resolution=${resolution}`,
          );

          setData(response);
        })().catch();
      } catch (e) {
        // silent catch error
      }

      try {
        (async () => {
          const { data: response } = await axios.get(
            `${process.env.WEB_API_ENDPOINT}/measurements/${sensor}/last`,
          );

          setLastValue(response.value);
        })().catch();
      } catch (e) {
        // silent catch error
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [true]);

  const high = maxBy(data, 'value');
  const average = meanBy(data, 'value') || null;
  const low = minBy(data, 'value');
  const last = data ? data[data.length - 1] : null;

  return (
    <Chart>
      <ChartContent>
        {lastValue && (
          <LastValue>
            {lastValue.toFixed(2)}
            <span>{unit}</span>
          </LastValue>
        )}
        <ResponsiveContainer width="99.9%" height="99.8%">
          <LineChart data={data} margin={{ left: 0, right: 0 }} syncId={syncId}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth="0.1rem"
              dot={false}
            />
            <YAxis domain={['auto', 'auto']} hide={true} />
            {data.length > 0 && (
              <Tooltip
                cursor={false}
                content={(tooltipProps: any) => (
                  <CustomTooltip {...tooltipProps} unit={unit} name={name} />
                )}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
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
