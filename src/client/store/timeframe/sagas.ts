import { call, fork, takeEvery } from 'redux-saga/effects';
import { fetch as fetchSamples } from '../samples/actions';
import { SET } from './actions';

function* setFlow() {
  yield call(fetchSamples);
}

function* setFlowWatcher() {
  yield takeEvery(SET, setFlow);
}

export default [fork(setFlowWatcher)];
