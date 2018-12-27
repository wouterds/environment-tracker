import { all } from 'redux-saga/effects';
import sensors from './sensors/sagas';

export default function*() {
  yield all([...sensors]);
}
