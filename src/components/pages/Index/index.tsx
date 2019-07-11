import axios from 'axios';
import Layout from 'components/Layout';
import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { Chart, Container } from './styles';

export default () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      (async () => {
        const { data: response } = await axios.get(
          'https://tracker.wouterdeschuyter.be/api/measurements?sensor=temperature&groupByMinutes=10',
        );

        setData(response);
      })().catch();
    } catch (e) {
      // silent catch error
    }
  }, [true]);

  return (
    <Layout>
      <Container>
        <Chart>
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
                stroke="#e74c3c"
                strokeWidth={2}
                dot={false}
              />
              <YAxis domain={['auto', 'auto']} hide={true} />
              <Tooltip cursor={false} />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
      </Container>
    </Layout>
  );
};
