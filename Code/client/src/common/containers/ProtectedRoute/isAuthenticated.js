import { UserRedirectPathEnum, UserLoginPathEnum } from '../../constants/routesConfig';

/**
 * check the userType & logged status.
 * return the validation result
 *   isAllowed  --- Boolean
 *   userType   --- String
 *
 */
const isAuthenticated = userTypetoCheck => ({
  isLoggedIn,
  userType,
}) => {
  const isAllowed = isLoggedIn && userType === userTypetoCheck;
  let redirectTo = '/login';

  if (isAllowed || (!isAllowed && isLoggedIn)) {
    redirectTo = UserRedirectPathEnum[userType];
  }

  if (!isAllowed || !isLoggedIn) {
    redirectTo = UserLoginPathEnum[userType];
  }


  return { isAllowed, redirectTo };
};

export default isAuthenticated;
