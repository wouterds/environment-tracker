import axios from 'axios';
import maxBy from 'lodash/maxBy';
import meanBy from 'lodash/meanBy';
import minBy from 'lodash/minBy';
import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import CustomTooltip from '../Tooltip';
import { Chart, ChartContent, ChartFooter } from './styles';

interface Props {
  sensor: string;
  unit: string;
  color: string;
}

export default (props: Props) => {
  const { sensor, unit, color } = props;
  const [data, setData] = useState<Array<{ average: number }>>([]);

  useEffect(() => {
    try {
      (async () => {
        const { data: response } = await axios.get(
          `https://tracker.wouterdeschuyter.be/api/measurements?sensor=${sensor}&groupByMinutes=10`,
        );

        setData(response);
      })().catch();
    } catch (e) {
      // silent catch error
    }
  }, [true]);

  const high = maxBy(data, 'average');
  const average = meanBy(data, 'average');
  const low = minBy(data, 'average');

  return (
    <Chart>
      <ChartContent>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={768}
            height={300}
            data={data}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <Line
              type="monotone"
              dataKey="average"
              stroke={color}
              strokeWidth={2}
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
      </ChartContent>
      <ChartFooter>
        <li>
          <label>High</label>
          <span>
            {high ? high.average.toFixed(2) : ''}
            {unit}
          </span>
        </li>
        <li>
          <label>Average</label>
          <span>
            {average ? average.toFixed(2) : ''}
            {unit}
          </span>
        </li>
        <li>
          <label>Low</label>
          <span>
            {low ? low.average.toFixed(2) : ''}
            {unit}
          </span>
        </li>
      </ChartFooter>
    </Chart>
  );
};
