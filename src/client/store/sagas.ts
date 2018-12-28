import { all } from 'redux-saga/effects';
import samples from './samples/sagas';
import sensors from './sensors/sagas';
import timeframes from './timeframe/sagas';

export default function*() {
  yield all([...samples, ...sensors, ...timeframes]);
}
