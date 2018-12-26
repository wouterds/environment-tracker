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
  time: number;
  illuminance?: Data;
  temperature?: Data;
  humidity?: Data;
  pressure?: Data;
  eco2?: Data;
}

class ProofOfConcept extends React.Component<{}, State> {
  public state: State = {
    time: 24,
  };

  public componentDidMount() {
    this.fetch();
  }

  public componentDidUpdate(_prevProps: {}, prevState: State) {
    if (prevState.time !== this.state.time) {
      this.fetch();
    }
  }

  public render() {
    const {
      illuminance,
      temperature,
      humidity,
      eco2,
      pressure,
      time,
    } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.cell}>
            {temperature && (
              <Chart
                syncId="sync-charts"
                identifier={temperature.sensor.type}
                name="Temperature"
                strokeColor="rgb(255, 153, 153)"
                fillColor="rgba(255, 153, 153, 0.1)"
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
                strokeColor="rgb(116, 185, 255)"
                fillColor="rgba(116, 185, 255, 0.1)"
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
                strokeColor="rgb(129, 236, 236)"
                fillColor="rgba(129, 236, 236, 0.1)"
                data={[...eco2.samples].reverse()}
                unit={eco2.sensor.unit}
              />
            )}
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.cell}>
            <div className={styles.content}>
              <label className={styles.label}>Time range</label>
              <ul className={styles.timeRangeSelector}>
                <li
                  className={time === 24 && styles.active}
                  onClick={() => this.setState({ time: 24 })}
                >
                  24H
                </li>
                <li
                  className={time === 36 && styles.active}
                  onClick={() => this.setState({ time: 36 })}
                >
                  36H
                </li>
                <li
                  className={time === 48 && styles.active}
                  onClick={() => this.setState({ time: 48 })}
                >
                  48H
                </li>
                <li
                  className={time === 60 && styles.active}
                  onClick={() => this.setState({ time: 60 })}
                >
                  60H
                </li>
                <li
                  className={time === 72 && styles.active}
                  onClick={() => this.setState({ time: 72 })}
                >
                  72H
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.cell}>
            {illuminance && (
              <Chart
                syncId="sync-charts"
                identifier={illuminance.sensor.type}
                name="Illuminance"
                strokeColor="rgb(255, 234, 167)"
                fillColor="rgba(255, 234, 167, 0.1)"
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
                strokeColor="rgb(181,  175,  255)"
                fillColor="rgba(181, 175, 255, 0.1)"
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
    const { time } = this.state;

    const sensorsResponse: AxiosResponse = await axios.get(
      'https://tracker.wouterdeschuyter.be/api/sensors',
    );

    for (const sensor of sensorsResponse.data) {
      const samplesResponse: AxiosResponse = await axios.get(
        `https://tracker.wouterdeschuyter.be/api/samples?sensorId=${
          sensor.id
        }&groupByMinutes=10&between=${Math.floor(
          subHours(new Date(), time).getTime() / 1000,
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
