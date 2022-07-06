import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { validateIdentity, getComponentName } from '../../common/helpers';

/**
 * Component that perform authorization checking
 *
 * If user is not authenticated or don't have permission,
 * the child components are not rendered
 */
const PermissionRequired = ({ permission, identity, children }) => {
  const isAuthenticated = validateIdentity(identity);
  if (isAuthenticated && identity.user.roles.includes(permission)) {
    return children;
  }
  return null;
};

export default connect(state => ({
  identity: state.common.identity,
}))(PermissionRequired);

/**
 * Show an error page if user does not have permission
 * else show the wrapped component
 *
 * @param {*} WrappedComponent
 */
const withPermission = permission => (WrappedComponent) => {
  const Wrapper = (props) => {
    const { identity, ...passthroughProps } = props;
    const isAuthenticated = validateIdentity(identity);
    if (isAuthenticated && identity.user.roles.includes(permission)) {
      return <WrappedComponent {...passthroughProps} />;
    }
    return (<p>You do not have permission to access this page.</p>);
  };

  Wrapper.displayName = `withPermission(${getComponentName(WrappedComponent)})`;
  Wrapper.propTypes = {
    identity: PropTypes.object.isRequired,
  };

  return connect(state => ({
    identity: state.common.identity,
  }))(Wrapper);
};


export { withPermission };

