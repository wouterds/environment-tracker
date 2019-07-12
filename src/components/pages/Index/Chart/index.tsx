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
}

export default (props: Props) => {
  const { sensor, unit, color, syncId } = props;
  const [data, setData] = useState<Array<{ value: number }>>([]);
  const [lastValue, setLastValue] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        (async () => {
          const { data: response } = await axios.get(
            `${process.env.WEB_API_ENDPOINT}/measurements/${sensor}/averages?groupByMinutes=10`,
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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={768}
            height={300}
            data={data}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            syncId={syncId}
          >
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
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
