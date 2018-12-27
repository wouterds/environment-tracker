import * as React from 'react';
import styles from './styles.css';

interface Props {
  value: number | null;
}

interface State {
  direction: 'increase' | 'decrease' | null;
}

class HighlightedNumber extends React.Component<Props, State> {
  public state: State = {
    direction: null,
  };

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.value === null && nextProps.value !== null) {
      this.setState({ direction: 'increase' });
      return;
    } else if (this.props.value !== null && nextProps.value === null) {
      this.setState({ direction: 'decrease' });
      return;
    }

    if (this.props.value !== null && nextProps.value !== null) {
      this.setState({
        direction:
          nextProps.value === this.props.value
            ? null
            : nextProps.value > this.props.value
            ? 'increase'
            : 'decrease',
      });
    }
  }

  public render() {
    const { direction } = this.state;
    const { value } = this.props;

    return (
      <span
        className={
          direction === 'increase'
            ? styles.increase
            : direction === 'decrease'
            ? styles.decrease
            : null
        }
      >
        {value ? (Math.round(value * 100) / 100).toFixed(2) : value}
      </span>
    );
  }
}

export default HighlightedNumber;
