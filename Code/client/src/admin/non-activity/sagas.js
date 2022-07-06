import { call, put, takeLatest, select } from 'redux-saga/effects';

import { request, buildQueryString } from '../../common/helpers';
import * as actionTypes from './constants/action-types';
import * as actions from './actions';

function* fetchItems(action) {
  const { resolve, reject } = action;
  const { pagination, search } = yield select(state => state.admin.nonActivity);
  const { current: page, pageSize: limit } = pagination;
  try {
    const response = yield call(request, {
      url: `admin/drivers/non-activity?${buildQueryString({ page, limit, s: search })}`,
      method: 'get',
      requestName: 'fetchNonActivityDrivers',
    });
    const newPag = { ...pagination };
    newPag.total = parseInt(response.headers['x-pagination-total-count'], 10);
    yield put(actions.setState({
      items: response.data,
      pagination: newPag,
    }));
    resolve(response);
  } catch (error) {
    reject(error);
  }
}

export default function* manageDisputesSaga() {
  yield takeLatest(actionTypes.FETCH_ITEMS, fetchItems);
}
