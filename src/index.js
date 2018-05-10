//@flow
import ReactDOM from 'react-dom';
import React from 'react';
import type { Node } from 'react';
import { Provider } from 'react-redux';
import { store } from 'store';
import { connect } from 'services/socket';
import App from 'components/App';
import styles from 'styles/core.css';

/**
 * Render the component
 *
 * @returns {Node}
 */
const Index = (): Node => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

// Get root element
const root = document.getElementById('root');

// No root element?
if (root === null) {
  throw new Error('Could not find root element!');
}

// Root class
root.className = styles.root;

// Render React application
ReactDOM.render(<Index />, root);

// Connect to socket
connect();
