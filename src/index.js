//@flow
import ReactDOM from 'react-dom';
import React from 'react';
import type { Node } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducers } from 'store/reducers';
import wrapApp from 'containers/App';
import App from 'components/App';
import styles from 'styles/core.css';

const WrappedApp = wrapApp(App);

/**
 * Render the component
 *
 * @returns {Node}
 */
const Index = (): Node => {
  return (
    <Provider store={createStore(reducers)}>
      <WrappedApp />
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
