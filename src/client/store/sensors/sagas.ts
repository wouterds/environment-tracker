import axios, { AxiosResponse } from 'axios';
import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { API_ENDPOINT } from '../../config';
import { fetch as fetchSamples } from '../samples/actions';
import { FETCH, fetchError, fetchSuccess } from './actions';

function* fetchFlow() {
  try {
    const response: AxiosResponse = yield call(
      axios.get,
      `${API_ENDPOINT}/sensors`,
    );

    if (response.status !== 200) {
      throw new Error(`unexpected response code: ${response.status}`);
    }

    yield put(fetchSuccess(response.data));

    yield call(fetchSamples);
  } catch (error) {
    yield put(fetchError());
  }
}

function* fetchFlowWatcher() {
  yield takeEvery(FETCH, fetchFlow);
}

export default [fork(fetchFlowWatcher)];
