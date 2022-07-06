import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { string, bool, any, func } from 'prop-types';


/**
 * ProtectedRoute
 *
 * userType: ./routesConfig.js: UserTypeEnum
 */
const propTypes = {
  isLoggedIn: bool.isRequired,
  userType: string.isRequired,
  redirectTo: string,
  condition: func.isRequired,
  component: func.isRequired,

  location: any,
};

const defaultProps = {
  redirectTo: '/',
  location: {
    pathname: '/',
    search: '',
    hash: '',
    key: '8ze5c2',
  },
};

const ProtectedRoute = (props) => {
  const {
    // from state.auth
    isLoggedIn,
    userType,

    // from self props.
    redirectTo: redirectToFromRoute,
    condition,
    component: Component,

    // from parent props.
    ...rest
  } = props;
  return (
    <Route
      {...rest}
      render={(props) => {
        const { isAllowed, redirectTo } = condition ? condition({ isLoggedIn, userType }) : { isAllowed: false, redirectTo: '/login' };

        return (isAllowed) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
                pathname: redirectTo || redirectToFromRoute,
                state: { from: props.location },
              }}
          />
          );
      }}
    />
  );
};

ProtectedRoute.propTypes = propTypes;
ProtectedRoute.defaultProps = defaultProps;

const mapStateToProps = (state) => {
  const { isLoggedIn, userType } = (state.common.identity || { isLoggedIn: false, userType: 'Guest' });

  return {
    isLoggedIn,
    userType,
  };
};

export default connect(mapStateToProps)(ProtectedRoute);

