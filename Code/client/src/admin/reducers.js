import { combineReducers } from 'redux';

import accounts from './manageAccounts/reducerCustomers';
import products from './manageProducts/reducerProducts';
import productRequests from './productRequests/reducerProductRequests';
import collectionRequests from './collectionRequests/reducers';
import discounts from './manageDiscountCodes/reducerDiscounts';
import manageTransactions from './manageTransactions/reducerManageTransactions';
import manageDisputes from './manageDisputes/reducerManageDisputes';
import councils from './manageCouncils/reducerCouncils';
import dumpsites from './manageDumpsites/reducer';
import advertising from './manageAdvertising/reducer';
import dashboard from './dashboard/reducer';
import productTypes from './manageProductTypes/reducers';
import nonActivity from './non-activity/reducers';
import connectedUserProfile from './connectedUserProfile/reducers';
import vehicle from './vehicle/reducers';
import supplier from './supplier/reducers';

export default combineReducers({
  accounts,
  dashboard,
  products,
  productRequests,
  collectionRequests,
  discounts,
  manageTransactions,
  manageDisputes,
  councils,
  dumpsites,
  advertising,
  productTypes,
  nonActivity,
  connectedUserProfile,
  vehicle,
  supplier
});
