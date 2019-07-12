import { format } from 'date-fns';
import { Container, Label, Value } from './styles';

interface Sample {
  average: number | null;
  dtime: string;
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
    const { average, dtime } = payload;

    return (
      <Container>
        <Value>
          {name} {average && average.toFixed(2)}
          <span>{unit}</span>
        </Value>
        <Label>{format(dtime, 'MMMM Do, YYYY HH:mm a')}</Label>
      </Container>
    );
  }

  return null;
};

export default ToolTip;
