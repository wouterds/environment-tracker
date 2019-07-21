import axios from 'axios';
import Layout from 'components/Layout';
import { NO_CONTENT, OK } from 'http-status';
import { memo, useEffect, useState } from 'react';
import Chart from './Chart';
import {
  ChartRow,
  Column,
  Container,
  FooterColumn,
  HeaderColumn,
  LoadingRow,
  Resolution,
  ResolutionItem,
  Row,
  Status,
} from './styles';

const resolutions = ['1d', '1w', '1m', '1y'];

const Index = () => {
  const [resolution, setResolution] = useState('1d');
  const [status, setStatus] = useState<string | null>(null);
  const [statusTitle, setStatusTitle] = useState('');
  const [delay, setDelay] = useState(500);

  useEffect(() => {
    (async () => {
      if (status === 'ok') {
        return;
      }

      if (status === 'error') {
        await new Promise(resolve => setTimeout(resolve, delay));
        setDelay(delay * 1.5);
      }

      setStatus(null);

      try {
        const { status: sensorsEndpointStatus } = await axios.get(
          `${process.env.SENSORS_API_ENDPOINT}`,
        );

        if (sensorsEndpointStatus !== OK) {
          setStatus('error');
          return;
        }

        const { status: webEndpointStatus } = await axios.get(
          `${process.env.WEB_API_ENDPOINT}/ping`,
        );

        if (webEndpointStatus !== NO_CONTENT) {
          setStatus('error');
          return;
        }
      } catch (e) {
        setStatus('error');
        return;
      }

      setStatus('ok');
    })().catch();

    switch (status) {
      case 'ok':
        setStatusTitle('API is reachable');
        break;
      case 'error':
        setStatusTitle('API is not reachable');
        break;
      case null:
        setStatusTitle('Checking API connection');
        break;
    }
  }, [status]);

  return (
    <Layout>
      <Container>
        <Row>
          <HeaderColumn>
            <h1>Environment Tracker</h1>
            <Resolution>
              {status === 'ok' &&
                resolutions.map(res => (
                  <ResolutionItem
                    key={`resolution-${res}`}
                    active={res === resolution}
                    onClick={() => setResolution(res)}
                  >
                    {res}
                  </ResolutionItem>
                ))}
            </Resolution>
          </HeaderColumn>
        </Row>
        {status !== 'ok' && <LoadingRow>Connecting...</LoadingRow>}
        {status === 'ok' && (
          <>
            <ChartRow>
              <Column>
                <Chart
                  sensor="temperature"
                  color="#e74c3c"
                  unit="°C"
                  resolution={resolution}
                />
              </Column>
              <Column>
                <Chart
                  sensor="humidity"
                  color="#3498db"
                  unit="%"
                  resolution={resolution}
                />
              </Column>
            </ChartRow>
            <ChartRow>
              <Column>
                <Chart
                  sensor="pressure"
                  color="#1abc9c"
                  unit="hPa"
                  resolution={resolution}
                />
              </Column>
              <Column>
                <Chart
                  sensor="illuminance:full"
                  color="#f1c40f"
                  unit="lx"
                  resolution={resolution}
                />
              </Column>
            </ChartRow>
          </>
        )}
        <Row>
          <FooterColumn>
            <div>&copy; {new Date().getFullYear()} Wouter De Schuyter</div>
            <div>
              v{process.env.VERSION}{' '}
              <Status status={status} title={statusTitle} />
            </div>
          </FooterColumn>
        </Row>
      </Container>
    </Layout>
  );
};

export default memo(Index);
