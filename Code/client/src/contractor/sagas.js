import { all } from 'redux-saga/effects';
import loginSaga from './login/sagas';
import registerSaga from './register/sagas';
import resetPasswordSaga from './resetPassword/sagas';
import driversSaga from './manageAccounts/sagas';
import vehiclesSaga from './manageVehicles/sagas';
import adminsSaga from './manageProfile/sagas';
import transactionsSaga from './manageTransactions/sagas';
import dashboardSaga from './dashboard/sagas';


export default function* contractorSaga() {
  yield all([
    loginSaga(),
    registerSaga(),
    resetPasswordSaga(),
    driversSaga(),
    vehiclesSaga(),
    adminsSaga(),
    transactionsSaga(),
    dashboardSaga(),
  ]);
}
