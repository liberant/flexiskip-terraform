import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { request } from '../../../common/helpers';
import * as actionTypes from './constants/actionTypes';

function* updateCollectionRequest(action) {
  const { resolve, reject, payload: colReq } = action;

  try {
    const response = yield call(request, {
      url: `admin/collection-requests/${colReq._id}`,
      method: 'put',
      requestName: 'updateCollectionRequest',
      data: {
        status: colReq.status,
        collectionAddress: colReq.collectionAddress,
        comment: colReq.comment,
        disposalSite: colReq.disposalSite,
        disposalAddress: colReq.disposalAddress,
        disposalLocation: colReq.disposalLocation,
        binUpdates: colReq.binUpdates,
      },
    });
    yield put(push(`/admin/collection-requests-view/${colReq._id}`));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* collectionRequestsSaga() {
  yield takeLatest(actionTypes.UPDATE_ITEM, updateCollectionRequest);
}
