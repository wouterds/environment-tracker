import axios, { AxiosResponse } from 'axios';
import { subHours } from 'date-fns';
import { maxBy, minBy } from 'lodash';
import * as React from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import '../../styles/core.css';

interface Sample {
  id: string;
  value: number | null;
  date: string;
}

interface State {
  illuminance: Sample[];
  temperature: Sample[];
  humidity: Sample[];
  pressure: Sample[];
  eco2: Sample[];
}

class ProofOfConcept extends React.Component<{}, State> {
  public state: State = {
    illuminance: [],
    temperature: [],
    humidity: [],
    pressure: [],
    eco2: [],
  };

  public componentDidMount() {
    this.fetch();
  }

  public render() {
    const { illuminance, temperature, humidity, eco2, pressure } = this.state;

    interface ChartRow {
      illuminance: number | null;
      temperature: number | null;
      humidity: number | null;
      pressure: number | null;
      eco2: number | null;
    }

    const chartRows: ChartRow[] = [];

    let i = 0;
    for (const sample of illuminance) {
      const chartRow: ChartRow = chartRows[i] || {};

      chartRow.illuminance = sample.value;

      chartRows[i++] = chartRow;
    }

    i = 0;
    for (const sample of temperature) {
      const chartRow: ChartRow = chartRows[i] || {};

      chartRow.temperature = sample.value;

      chartRows[i++] = chartRow;
    }

    i = 0;
    for (const sample of humidity) {
      const chartRow: ChartRow = chartRows[i] || {};

      chartRow.humidity = sample.value;

      chartRows[i++] = chartRow;
    }

    i = 0;
    for (const sample of pressure) {
      const chartRow: ChartRow = chartRows[i] || {};

      chartRow.pressure = sample.value;

      chartRows[i++] = chartRow;
    }

    i = 0;
    for (const sample of eco2) {
      const chartRow: ChartRow = chartRows[i] || {};

      chartRow.eco2 = sample.value;

      chartRows[i++] = chartRow;
    }

    const illuminanceMin = minBy(chartRows, 'illuminance');
    const illuminanceMax = maxBy(chartRows, 'illuminance');
    const temperatureMin = minBy(chartRows, 'temperature');
    const temperatureMax = maxBy(chartRows, 'temperature');
    const humidityMin = minBy(chartRows, 'humidity');
    const humidityMax = maxBy(chartRows, 'humidity');
    const pressureMin = minBy(chartRows, 'pressure');
    const pressureMax = maxBy(chartRows, 'pressure');
    const eco2Min = minBy(chartRows, 'eco2');
    const eco2Max = maxBy(chartRows, 'eco2');

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartRows.reverse()}
          margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        >
          <Line
            type="monotone"
            dataKey="temperature"
            yAxisId="temperature"
            stroke="#ff7675"
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            connectNulls={true}
          />
          <Line
            type="monotone"
            dataKey="illuminance"
            yAxisId="illuminance"
            stroke="#fdcb6e"
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            connectNulls={true}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            yAxisId="humidity"
            stroke="#0984e3"
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            connectNulls={true}
          />
          <Line
            type="monotone"
            dataKey="pressure"
            yAxisId="pressure"
            stroke="#a29bfe"
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            connectNulls={true}
          />
          <Line
            type="monotone"
            dataKey="eco2"
            yAxisId="eco2"
            stroke="#55efc4"
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            connectNulls={true}
          />
          <XAxis hide={true} />
          <YAxis
            yAxisId="temperature"
            hide={true}
            domain={[
              temperatureMin && temperatureMin.temperature
                ? temperatureMin.temperature * 0.8
                : 0,
              temperatureMax && temperatureMax.temperature
                ? temperatureMax.temperature * 1.2
                : 0,
            ]}
          />
          <YAxis
            yAxisId="illuminance"
            hide={true}
            scale="log"
            domain={[
              illuminanceMin && illuminanceMin.illuminance
                ? illuminanceMin.illuminance * 0.8
                : 0,
              illuminanceMax && illuminanceMax.illuminance
                ? illuminanceMax.illuminance * 1.2
                : 0,
            ]}
          />
          <YAxis
            yAxisId="humidity"
            hide={true}
            domain={[
              humidityMin && humidityMin.humidity
                ? humidityMin.humidity * 0.8
                : 0,
              humidityMax && humidityMax.humidity
                ? humidityMax.humidity * 1.2
                : 0,
            ]}
          />
          <YAxis
            yAxisId="pressure"
            hide={true}
            domain={[
              pressureMin && pressureMin.pressure
                ? pressureMin.pressure * 0.8
                : 0,
              pressureMax && pressureMax.pressure
                ? pressureMax.pressure * 1.2
                : 0,
            ]}
          />
          <YAxis
            yAxisId="eco2"
            hide={true}
            domain={[
              eco2Min && eco2Min.eco2 ? eco2Min.eco2 * 0.8 : 0,
              eco2Max && eco2Max.eco2 ? eco2Max.eco2 * 1.2 : 0,
            ]}
          />
          <Tooltip cursor={{ stroke: '#FFF', strokeWidth: 1.5 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  private fetch = async () => {
    const sensorsResponse: AxiosResponse = await axios.get(
      'https://tracker.wouterdeschuyter.be/api/sensors',
    );

    for (const sensor of sensorsResponse.data) {
      const samplesResponse: AxiosResponse = await axios.get(
        `https://tracker.wouterdeschuyter.be/api/samples?sensorId=${
          sensor.id
        }&groupByMinutes=20&between=${Math.floor(
          subHours(new Date(), 24).getTime() / 1000,
        )},${Math.floor(new Date().getTime() / 1000)}`,
      );

      switch (sensor.type) {
        case 'ILLUMINANCE':
          this.setState({ illuminance: samplesResponse.data });
          break;
        case 'HUMIDITY':
          this.setState({ humidity: samplesResponse.data });
          break;
        case 'PRESSURE':
          this.setState({ pressure: samplesResponse.data });
          break;
        case 'TEMPERATURE':
          this.setState({ temperature: samplesResponse.data });
          break;
        case 'ECO2':
          this.setState({ eco2: samplesResponse.data });
          break;
      }
    }
  };
}

export default ProofOfConcept;
