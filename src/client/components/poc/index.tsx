import axios, { AxiosResponse } from 'axios';
import { subHours } from 'date-fns';
import { maxBy, minBy } from 'lodash';
import * as React from 'react';
import Chart from '../chart';
import HighlightedNumber from '../highlightednumber';
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
  loading: boolean;
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
    loading: false,
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
      loading,
    } = this.state;

    const temperatureMin = temperature
      ? minBy(temperature.samples, 'value')
      : null;
    const temperatureMinValue = temperatureMin ? temperatureMin.value : null;
    const temperatureMax = temperature
      ? maxBy(temperature.samples, 'value')
      : null;
    const temperatureMaxValue = temperatureMax ? temperatureMax.value : null;

    const humidityMin = humidity ? minBy(humidity.samples, 'value') : null;
    const humidityMinValue = humidityMin ? humidityMin.value : null;
    const humidityMax = humidity ? maxBy(humidity.samples, 'value') : null;
    const humidityMaxValue = humidityMax ? humidityMax.value : null;

    const eco2Min = eco2 ? minBy(eco2.samples, 'value') : null;
    const eco2MinValue = eco2Min ? eco2Min.value : null;
    const eco2Max = eco2 ? maxBy(eco2.samples, 'value') : null;
    const eco2MaxValue = eco2Max ? eco2Max.value : null;

    const illuminanceMin = illuminance
      ? minBy(illuminance.samples, 'value')
      : null;
    const illuminanceMinValue = illuminanceMin ? illuminanceMin.value : null;
    const illuminanceMax = illuminance
      ? maxBy(illuminance.samples, 'value')
      : null;
    const illuminanceMaxValue = illuminanceMax ? illuminanceMax.value : null;

    const pressureMin = pressure ? minBy(pressure.samples, 'value') : null;
    const pressureMinValue = pressureMin ? pressureMin.value : null;
    const pressureMax = pressure ? maxBy(pressure.samples, 'value') : null;
    const pressureMaxValue = pressureMax ? pressureMax.value : null;

    return (
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.cell}>
            <div className={styles.content}>
              <label className={styles.chartLabel}>Temperature</label>
            </div>
            {temperature && (
              <Chart
                loading={loading}
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
            <div className={styles.content}>
              <label className={styles.chartLabel}>Relative humidity</label>
            </div>
            {humidity && (
              <Chart
                loading={loading}
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
            <div className={styles.content}>
              <label className={styles.chartLabel}>eCO2</label>
            </div>
            {eco2 && (
              <Chart
                loading={loading}
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
              <div className={styles.infoRow}>
                <div className={styles.infoColumn}>
                  <label className={styles.label}>Time range</label>
                  <ul className={styles.timeRangeSelector}>
                    <li
                      className={time === 6 ? styles.active : null}
                      onClick={() => this.setState({ time: 6 })}
                    >
                      6H
                    </li>
                    <li
                      className={time === 12 ? styles.active : null}
                      onClick={() => this.setState({ time: 12 })}
                    >
                      12H
                    </li>
                    <li
                      className={time === 24 ? styles.active : null}
                      onClick={() => this.setState({ time: 24 })}
                    >
                      24H
                    </li>
                    <li
                      className={time === 36 ? styles.active : null}
                      onClick={() => this.setState({ time: 36 })}
                    >
                      36H
                    </li>
                    <li
                      className={time === 48 ? styles.active : null}
                      onClick={() => this.setState({ time: 48 })}
                    >
                      48H
                    </li>
                    <li
                      className={time === 60 ? styles.active : null}
                      onClick={() => this.setState({ time: 60 })}
                    >
                      60H
                    </li>
                    <li
                      className={time === 72 ? styles.active : null}
                      onClick={() => this.setState({ time: 72 })}
                    >
                      72H
                    </li>
                    <li
                      className={time === 84 ? styles.active : null}
                      onClick={() => this.setState({ time: 84 })}
                    >
                      84H
                    </li>
                    <li
                      className={time === 168 ? styles.active : null}
                      onClick={() => this.setState({ time: 168 })}
                    >
                      168H
                    </li>
                  </ul>
                </div>
                <div className={styles.infoColumnFill}>
                  <label className={styles.label}>Activity status</label>
                  <span className={styles.activity}>
                    {loading ? 'Loading..' : 'Idle'}
                  </span>
                </div>
              </div>
              <div className={styles.infoRow}>
                <table className={styles.table}>
                  <tbody>
                    <tr>
                      <th />
                      <th>
                        <span className={styles.label}>
                          Temperature{' '}
                          {temperature && `(${temperature.sensor.unit})`}
                        </span>
                      </th>
                      <th>
                        <span className={styles.label}>
                          Relative Humidity{' '}
                          {humidity && `(${humidity.sensor.unit})`}
                        </span>
                      </th>
                      <th>
                        <span className={styles.label}>
                          eCO2 {eco2 && `(${eco2.sensor.unit})`}
                        </span>
                      </th>
                      <th>
                        <span className={styles.label}>
                          Illuminance{' '}
                          {illuminance && `(${illuminance.sensor.unit})`}
                        </span>
                      </th>
                      <th>
                        <span className={styles.label}>
                          Pressure {pressure && `(${pressure.sensor.unit})`}
                        </span>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <span className={styles.label}>Min</span>
                      </th>
                      <td>
                        <HighlightedNumber value={temperatureMinValue} />
                      </td>
                      <td>
                        <HighlightedNumber value={humidityMinValue} />
                      </td>
                      <td>
                        <HighlightedNumber value={eco2MinValue} />
                      </td>
                      <td>
                        <HighlightedNumber value={illuminanceMinValue} />
                      </td>
                      <td>
                        <HighlightedNumber value={pressureMinValue} />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <span className={styles.label}>Max</span>
                      </th>
                      <td>
                        <HighlightedNumber value={temperatureMaxValue} />
                      </td>
                      <td>
                        <HighlightedNumber value={humidityMaxValue} />
                      </td>
                      <td>
                        <HighlightedNumber value={eco2MaxValue} />
                      </td>
                      <td>
                        <HighlightedNumber value={illuminanceMaxValue} />
                      </td>
                      <td>
                        <HighlightedNumber value={pressureMaxValue} />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <span className={styles.label}>Diff</span>
                      </th>
                      <td>
                        <HighlightedNumber
                          value={
                            (temperatureMaxValue ? temperatureMaxValue : 0) -
                            (temperatureMinValue ? temperatureMinValue : 0)
                          }
                        />
                      </td>
                      <td>
                        <HighlightedNumber
                          value={
                            (humidityMaxValue ? humidityMaxValue : 0) -
                            (humidityMinValue ? humidityMinValue : 0)
                          }
                        />
                      </td>
                      <td>
                        <HighlightedNumber
                          value={
                            (eco2MaxValue ? eco2MaxValue : 0) -
                            (eco2MinValue ? eco2MinValue : 0)
                          }
                        />
                      </td>
                      <td>
                        <HighlightedNumber
                          value={
                            (illuminanceMaxValue ? illuminanceMaxValue : 0) -
                            (illuminanceMinValue ? illuminanceMinValue : 0)
                          }
                        />
                      </td>
                      <td>
                        <HighlightedNumber
                          value={
                            (pressureMaxValue ? pressureMaxValue : 0) -
                            (pressureMinValue ? pressureMinValue : 0)
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={styles.cell}>
            <div className={styles.content}>
              <label className={styles.chartLabel}>Illuminance</label>
            </div>
            {illuminance && (
              <Chart
                loading={loading}
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
            <div className={styles.content}>
              <label className={styles.chartLabel}>Pressure</label>
            </div>
            {pressure && (
              <Chart
                loading={loading}
                syncId="sync-charts"
                identifier={pressure.sensor.type}
                name="Pressure"
                strokeColor="rgb(181, 175, 255)"
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

    this.setState({ loading: true });

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

    await new Promise(r => setTimeout(r, 1500));

    this.setState({ loading: false });
  };
}

export default ProofOfConcept;
