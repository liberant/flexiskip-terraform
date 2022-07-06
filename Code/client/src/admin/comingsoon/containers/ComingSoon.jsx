import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AdminLayout from '../../hoc/AdminLayout';
import { setTitle } from '../../../common/actions';


class ComingSoon extends React.Component {
  constructor(props) {
    super(props);

    const { common, history } = props;
    if (common.identity.userType !== 'SUPERADMIN') {
      if (common.identity.userType === 'contractor' && common.identity.isLoggedIn) {
        history.push('/contractor/dashboard');
      } else {
        history.push('/contractor/login');
      }
    }
  }

  componentDidMount() {
    const { setTitle } = this.props;

    setTitle('');
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: 42,
          color: '#239dff',
        }}
      >
        <div>
          The page is coming soon......
        </div>
      </div>);
  }
}

ComingSoon.propTypes = {
  setTitle: PropTypes.func.isRequired,
  common: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
};

ComingSoon.defaultProps = {

};

export default compose(
  AdminLayout,
  connect(
    state => state,
    dispatch => ({
      setTitle: title => dispatch(setTitle(title)),
    }),
  ),
)(ComingSoon);
