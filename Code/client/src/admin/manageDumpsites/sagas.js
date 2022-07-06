import { all } from 'redux-saga/effects';

import listSaga from './list/sagas';
import addSaga from './add/saga';
import viewSaga from './view/sagas';
import editSaga from './edit/sagas';

export default function* rootSaga() {
  yield all([
    listSaga(),
    addSaga(),
    viewSaga(),
    editSaga(),
  ]);
}
