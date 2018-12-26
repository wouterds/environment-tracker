import * as React from 'react';
import styles from './styles.css';

interface Props {
  value: number | null;
}

interface State {
  valueIncreased: boolean;
}

class HighlightedNumber extends React.Component<Props, State> {
  public state: State = {
    valueIncreased: false,
  };

  public componentWillReceiveProps(nextProps: Props) {
    const { valueIncreased } = this.state;

    if (this.props.value === null && nextProps.value !== null) {
      this.setState({ valueIncreased: true });
      return;
    } else if (this.props.value !== null && nextProps.value === null) {
      this.setState({ valueIncreased: true });
      return;
    }

    if (this.props.value !== null && nextProps.value !== null) {
      this.setState({
        valueIncreased:
          nextProps.value === this.props.value
            ? valueIncreased
            : nextProps.value > this.props.value,
      });
    }
  }

  public render() {
    const { valueIncreased } = this.state;
    const { value } = this.props;

    return (
      <span className={valueIncreased ? styles.increase : styles.decrease}>
        {value ? Math.round(value * 100) / 100 : value}
      </span>
    );
  }
}

export default HighlightedNumber;
