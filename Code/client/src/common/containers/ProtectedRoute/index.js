// export * from './ProtectedRoute';

import ProtectedRoute from './ProtectedRoute';

import {
  superadminUserAuthenticated,
  // superadminUserNotAuthenticated,
  businessadminUserAuthenticated,
  // businessadminUserNotAuthenticated,
  customerUserAuthenticated,
  contractorUserAuthenticated,
} from './routeValidation';


export {
  superadminUserAuthenticated,
  // superadminUserNotAuthenticated,
  businessadminUserAuthenticated,
  // businessadminUserNotAuthenticated,
  contractorUserAuthenticated,
  customerUserAuthenticated,
  // customerUserNotAuthenticated,
  ProtectedRoute,
};
