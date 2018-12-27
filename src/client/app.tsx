import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import POC from './components/POC';
import store from './store';
import './styles/core.css';

render(
  <Provider store={store}>
    <POC />
  </Provider>,
  document.getElementById('root'),
);
