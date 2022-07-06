import { all } from 'redux-saga/effects';
import loginSaga from './login/sagas';
import profileSaga from './profile/sagas';
import resetPasswordSaga from './resetPassword/sagas';
import accountSaga from './manageAccounts/sagas';
import productsSaga from './manageProducts/sagas';
import productRequestsSaga from './productRequests/sagas';
import collectionRequestsSaga from './collectionRequests/sagas';
import discountsSaga from './manageDiscountCodes/sagas';
import manageTransactionsSaga from './manageTransactions/sagas';
import manageDisputesSaga from './manageDisputes/sagas';
import councilsSaga from './manageCouncils/sagas';
import dumpsitesSaga from './manageDumpsites/sagas';
import advertisingSaga from './manageAdvertising/sagas';
import dashboardSaga from './dashboard/sagas';
import productTypesSaga from './manageProductTypes/sagas';
import nonActivitySaga from './non-activity/sagas';
import connectedUserProfile from './connectedUserProfile/sagas';
import vehicle from './vehicle/sagas';
import supplier from "./supplier/sagas";

export default function* adminSaga() {
  yield all([
    loginSaga(),
    dashboardSaga(),
    profileSaga(),
    resetPasswordSaga(),
    accountSaga(),
    productsSaga(),
    productRequestsSaga(),
    collectionRequestsSaga(),
    discountsSaga(),
    manageTransactionsSaga(),
    manageDisputesSaga(),
    councilsSaga(),
    dumpsitesSaga(),
    advertisingSaga(),
    productTypesSaga(),
    nonActivitySaga(),
    connectedUserProfile(),
    vehicle(),
    supplier(),
  ]);
}
