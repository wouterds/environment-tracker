import axios from 'axios';
import Layout from 'components/Layout';
import { useEffect, useState } from 'react';
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

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
      <LineChart width={768} height={300} data={data}>
        <Line
          type="monotone"
          dataKey="average"
          stroke="#e74c3c"
          strokeWidth={2}
          dot={false}
        />
        <YAxis domain={['auto', 'auto']} unit={' °C'} stroke="#aaa" />
        <XAxis dataKey="dtime" stroke="#aaa" />
        <Tooltip />
      </LineChart>
    </Layout>
  );
};
