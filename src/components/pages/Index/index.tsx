import axios from 'axios';
import Layout from 'components/Layout';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default () => {
  const [data, setData] = useState([]);

  try {
    (async () => {
      const { data: response } = await axios.get(
        '/api/measurements?sensor=temperature&groupByMinutes=5',
      );

      setData(response);
    })().catch();
  } catch (e) {
    // silent catch error
  }

  return (
    <Layout>
      <AreaChart width={500} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dtime" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="average"
          stroke="#8884d8"
          fill="#8884d8"
        />
      </AreaChart>
    </Layout>
  );
};
