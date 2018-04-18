//@flow
import React, { Component } from 'react';
import type { Node } from 'react';
import styles from './styles.css';
import cx from 'classnames';

type Props = {
  children: Node,
  className: ?string,
};

class Box extends Component<Props> {
  render(): Node {
    const { children, className } = this.props;

    return (
      <div className={cx(styles.container, className)}>{children}</div>
    );
  }
}

export default Box;
