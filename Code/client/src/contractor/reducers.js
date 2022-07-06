import { combineReducers } from 'redux';
import drivers from './manageAccounts/reducerCustomers';
import vehicles from './manageVehicles/reducerVehicles';
import admins from './manageProfile/reducerAdmins';
import transactions from './manageTransactions/reducer';
import { REGISTER_PROCESSING } from './register/constants/actionTypes';
import dashboard from './dashboard/reducer';

const initialContractorStat = {
  data: [],
};

function contractor(state = initialContractorStat, action) {
  switch (action.type) {
    case REGISTER_PROCESSING:
      return { ...state, registerProcessing: action.payload };
    default:
      return state;
  }
}

export default combineReducers({
  contractor,
  drivers,
  vehicles,
  admins,
  transactions,
  dashboard,
});
