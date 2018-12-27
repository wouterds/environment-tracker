import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import sagas from './sagas';

const DEFAULT_STATE = {};

const sagaMiddleware = createSagaMiddleware();

const enhancer = compose(applyMiddleware(sagaMiddleware));

const store = createStore(reducers, DEFAULT_STATE, enhancer);

sagaMiddleware.run(sagas);

export default store;
