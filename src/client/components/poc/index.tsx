import axios, { AxiosResponse } from 'axios';
import { subHours } from 'date-fns';
import * as React from 'react';
import Chart from '../chart';
import styles from './styles.css';

interface Sensor {
  id: string;
  type: string;
  unit: string;
}

interface Sample {
  id: string;
  value: number | null;
  date: string;
}

interface Data {
  sensor: Sensor;
  samples: Sample[];
}

interface State {
  illuminance?: Data;
  temperature?: Data;
  humidity?: Data;
  pressure?: Data;
  eco2?: Data;
}

class ProofOfConcept extends React.Component<{}, State> {
  public state: State = {};

  public componentDidMount() {
    this.fetch();
  }

  public render() {
    const { illuminance, temperature, humidity, eco2, pressure } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.cell}>
            {temperature && (
              <Chart
                syncId="sync-charts"
                identifier={temperature.sensor.type}
                name="Temperature"
                color="#ff7675"
                data={[...temperature.samples].reverse()}
                unit={temperature.sensor.unit}
              />
            )}
          </div>
          <div className={styles.cell}>
            {humidity && (
              <Chart
                syncId="sync-charts"
                identifier={humidity.sensor.type}
                name="Relative Humidity"
                color="#74b9ff"
                data={[...humidity.samples].reverse()}
                unit={humidity.sensor.unit}
              />
            )}
          </div>
          <div className={styles.cell}>
            {eco2 && (
              <Chart
                syncId="sync-charts"
                identifier={eco2.sensor.type}
                name="eCO2"
                color="#55efc4"
                data={[...eco2.samples].reverse()}
                unit={eco2.sensor.unit}
              />
            )}
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.cell} />
          <div className={styles.cell}>
            {illuminance && (
              <Chart
                syncId="sync-charts"
                identifier={illuminance.sensor.type}
                name="Illuminance"
                color="#fdcb6e"
                scale="log"
                data={[...illuminance.samples].reverse()}
                unit={illuminance.sensor.unit}
              />
            )}
          </div>
          <div className={styles.cell}>
            {pressure && (
              <Chart
                syncId="sync-charts"
                identifier={pressure.sensor.type}
                name="Pressure"
                color="#a29bfe"
                data={[...pressure.samples].reverse()}
                unit={pressure.sensor.unit}
              />
            )}
          </div>
        </div>
      </div>
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
          this.setState({
            illuminance: {
              sensor,
              samples: samplesResponse.data,
            },
          });
          break;
        case 'HUMIDITY':
          this.setState({
            humidity: {
              sensor,
              samples: samplesResponse.data,
            },
          });
          break;
        case 'PRESSURE':
          this.setState({
            pressure: {
              sensor,
              samples: samplesResponse.data,
            },
          });
          break;
        case 'TEMPERATURE':
          this.setState({
            temperature: {
              sensor,
              samples: samplesResponse.data,
            },
          });
          break;
        case 'ECO2':
          this.setState({
            eco2: {
              sensor,
              samples: samplesResponse.data,
            },
          });
          break;
      }
    }
  };
}

export default ProofOfConcept;
