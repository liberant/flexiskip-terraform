import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import './UserTitle.css';

export const stylesDetails = {
  backBox: {
    cursor: 'pointer',
    outline: 'none',
    color: '#1D415D',
    fontSize: 48,
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 600,
    lineHeight: '34px',
    marginRight: 5,
  },
  backArrowBox: {
    display: 'flex',
    alignItems: 'center',
    color: '#1D415D',
  },
};


class UserTitle extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleAnchorOnClick = this.handleAnchorOnClick.bind(this);
  }

  handleAnchorOnClick() {
    const { history } = this.props;
    history.go(-1);
  }

  render() {
    const { type, user } = this.props;
    return (
      <div className="profile-user-title">
        <a style={stylesDetails.backArrowBox} onClick={this.handleAnchorOnClick}>
          <div style={stylesDetails.backBox}>
            <span className="handel-chevron-circle-left" />
          </div>
        </a>{`${type} ${user && user.uId}`}
      </div>
    );
  }
}

UserTitle.propTypes = {
  history: PropTypes.object.isRequired,
  type: PropTypes.oneOf([
    'User',
    'Driver',
  ]).isRequired,
  user: PropTypes.object.isRequired,
};

export default withRouter(UserTitle);
