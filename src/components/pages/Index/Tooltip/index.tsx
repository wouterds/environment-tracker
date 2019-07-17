import { format } from 'date-fns';
import { Container, Label, Value } from './styles';

interface Sample {
  value: number | null;
  time: string;
}

interface Props {
  active: boolean;
  payload: Array<{ payload: Sample }>;
  name: string;
  label: string;
  unit: string;
}

const ToolTip = (props: Props) => {
  const { active } = props;

  if (active) {
    const { unit, name } = props;
    const { payload } = props.payload[0];
    const { value, time } = payload;

    return (
      <Container>
        <Value>
          {name} {value && value.toFixed(2)}
          <span>{unit}</span>
        </Value>
        <Label>{format(time, 'MMMM Do, YYYY HH:mm a')}</Label>
      </Container>
    );
  }

  return null;
};

export default ToolTip;
