import { all } from 'redux-saga/effects';

import listSaga from './list/sagas';
import viewSaga from './view/sagas';
import editSaga from './edit/sagas';

export default function* rootSaga() {
  yield all([
    listSaga(),
    viewSaga(),
    editSaga(),
  ]);
}
