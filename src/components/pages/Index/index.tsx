import Layout from 'components/Layout';
import Chart from './Chart';
import { Container } from './styles';

export default () => {
  return (
    <Layout>
      <Container>
        <Chart sensor="temperature" color="#e74c3c" unit="°C" />
        <Chart sensor="humidity" color="#3498db" unit="%" />
        <Chart sensor="pressure" color="#1abc9c" unit="hPa" />
        <Chart
          sensor="illuminance:full"
          color="#f1c40f"
          unit="lx"
          scale="log"
        />
      </Container>
    </Layout>
  );
};
