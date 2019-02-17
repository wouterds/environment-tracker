import { format } from 'date-fns';
import { isEqual } from 'lodash';
import * as React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Sample } from '../../store/samples/types';
import styles from './styles.css';
import ToolTip from './ToolTip';

export enum Scale {
  AUTO = 'auto',
  LOG = 'log',
}

interface Props {
  isLoading: boolean;
  name: string;
  unit: string;
  identifier: string;
  syncId?: string;
  strokeColor: string;
  fillColor: string;
  scale?: Scale;
  data: Sample[];
}

class Chart extends React.Component<Props> {
  public shouldComponentUpdate(nextProps: Props) {
    return !isEqual(nextProps, this.props);
  }

  public render() {
    const {
      data,
      identifier,
      strokeColor,
      fillColor,
      scale,
      syncId,
      name,
      unit,
      isLoading,
    } = this.props;

    return (
      <div className={styles.container}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            syncId={syncId}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#3a4456" />
            <YAxis
              yAxisId={identifier}
              scale={scale || 'auto'}
              domain={['auto', 'auto']}
              unit={unit}
              stroke="#3a4456"
            />
            <Area
              type="monotone"
              dataKey="value"
              yAxisId={identifier}
              stroke={strokeColor}
              fill={fillColor}
              dot={false}
              activeDot={{ fill: '#FFF', r: 1 }}
              connectNulls={true}
            />
            <XAxis
              dataKey="date"
              name={name}
              padding={{ left: 0, right: 0 }}
              stroke="#3a4456"
              tickFormatter={time => format(time, 'HH:mm a')}
            />
            {!isLoading && (
              <Tooltip
                cursor={{ stroke: 'rgba(255, 255, 255, 0.25)', strokeWidth: 1 }}
                content={(props: any) => (
                  <ToolTip {...props} unit={unit} name={name} />
                )}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Chart;
