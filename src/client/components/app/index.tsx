import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
// import { Type } from '../../../models/sensor';

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

class App extends React.Component<{}, State> {
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

    const chartData: Array<{
      illuminance: number;
      temperature: number;
      humidity: number;
      pressure: number;
      eco2: number;
    }> = [];

    let i = 0;
    for (const sample of illuminance) {
      const data: any = chartData[i] || {};

      data.illuminance = sample.value;

      chartData[i++] = data;
    }

    i = 0;
    for (const sample of temperature) {
      const data: any = chartData[i] || {};

      data.temperature = sample.value;

      chartData[i++] = data;
    }

    i = 0;
    for (const sample of humidity) {
      const data: any = chartData[i] || {};

      data.humidity = sample.value;

      chartData[i++] = data;
    }

    i = 0;
    for (const sample of pressure) {
      const data: any = chartData[i] || {};

      data.pressure = sample.value;

      chartData[i++] = data;
    }

    i = 0;
    for (const sample of eco2) {
      const data: any = chartData[i] || {};

      data.eco2 = sample.value;

      chartData[i++] = data;
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={1280}
          height={720}
          data={chartData.reverse()}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line
            type="monotone"
            dataKey="temperature"
            yAxisId="temperature"
            stroke="#e74c3c"
            dot={false}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="illuminance"
            yAxisId="illuminance"
            stroke="#f1c40f"
            dot={false}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            yAxisId="humidity"
            stroke="#3498db"
            dot={false}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="pressure"
            yAxisId="pressure"
            stroke="#1abc9c"
            dot={false}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="eco2"
            yAxisId="eco2"
            stroke="#34495e"
            dot={false}
            activeDot={false}
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis hide={true} />
          <YAxis yAxisId="temperature" hide={true} />
          <YAxis
            yAxisId="illuminance"
            hide={true}
            scale="log"
            domain={['auto', 'auto']}
          />
          <YAxis yAxisId="humidity" hide={true} />
          <YAxis yAxisId="pressure" hide={true} />
          <YAxis yAxisId="eco2" hide={true} />
          <Tooltip />
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
        `https://tracker.wouterdeschuyter.be/api/samples?sensorId=${sensor.id}`,
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

export default App;
