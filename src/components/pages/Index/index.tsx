import Layout from 'components/Layout';
import { memo, useState } from 'react';
import Chart from './Chart';
import {
  ChartRow,
  Container,
  HeaderRow,
  Resolution,
  ResolutionItem,
} from './styles';

const resolutions = ['1d', '1w', '1m', '1y'];

const Index = () => {
  const [resolution, setResolution] = useState('1d');

  return (
    <Layout>
      <Container>
        <HeaderRow>
          <h1>Environment Tracker {process.env.VERSION}</h1>
          <Resolution>
            {resolutions.map(res => (
              <ResolutionItem
                key={`resolution-${res}`}
                active={res === resolution}
                onClick={() => setResolution(res)}
              >
                {res}
              </ResolutionItem>
            ))}
          </Resolution>
        </HeaderRow>
        <ChartRow>
          <Chart
            sensor="temperature"
            color="#e74c3c"
            unit="°C"
            resolution={resolution}
          />
          <Chart
            sensor="humidity"
            color="#3498db"
            unit="%"
            resolution={resolution}
          />
        </ChartRow>
        <ChartRow>
          <Chart
            sensor="pressure"
            color="#1abc9c"
            unit="hPa"
            resolution={resolution}
          />
          <Chart
            sensor="illuminance:full"
            color="#f1c40f"
            unit="lx"
            resolution={resolution}
          />
        </ChartRow>
      </Container>
    </Layout>
  );
};

export default memo(Index);
