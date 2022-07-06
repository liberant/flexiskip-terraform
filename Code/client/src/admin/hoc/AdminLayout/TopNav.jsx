import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { string, func } from 'prop-types';

import { clearIdentity } from '../../../common/actions';
import { normalizePhoneNumber10 } from '../../../common/components/form/reduxFormComponents';


/* eslint jsx-a11y/interactive-supports-focus: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */

const TopNav = ({
  avatar, phone, username, logout,
}) => (
  <div className="top_nav">
    <div className="nav_menu" style={{ backgroundColor: '#E9F5FF' }}>
      <nav>
        <div className="nav toggle">
          <a id="menu_toggle">
            <i className="fa fa-bars" />
          </a>
        </div>

        <ul className="nav navbar-nav navbar-right">
          <li style={{
            fontSize: 16,
            fontWeight: '600',
          }}
          >
            <a
              role="button"
              className="user-profile dropdown-toggle"
              data-toggle="dropdown"
              aria-expanded="false"
              style={{
                display: 'inline-block',
                borderLeft: '1px solid white',
              }}
            >
              {
                avatar ? (
                  <img src={avatar} alt={username} />
                ) : null
              }
              {username} &nbsp;
              <span className=" fa fa-angle-down" />
            </a>
            <ul className="dropdown-menu dropdown-usermenu pull-right">
              <li>
                <Link to="/admin/profile">Profile</Link>
              </li>
              <li>
                <a role="button" onClick={logout} >
                  <i className="fa fa-sign-out pull-right" /> Log Out
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>
);

TopNav.propTypes = {
  avatar: string,
  phone: string,
  username: string,
  logout: func.isRequired,
};
TopNav.defaultProps = {
  avatar: '',
  phone: '',
  username: '',
};

export default connect(
  state => ({
    avatar: state.common.identity.user.avatar,
    phone: state.common.identity.user.phone,
    username: `${state.common.identity.user.firstname || ''} ${state.common.identity.user.lastname || ''}`,
  }),
  dispatch => ({
    logout: () => dispatch(clearIdentity()),
  }),
)(TopNav);
