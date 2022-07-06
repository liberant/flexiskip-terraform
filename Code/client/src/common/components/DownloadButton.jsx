import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import HandelButton from './HandelButton';
import { API_URL } from '../constants/params';

class DownloadButton extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    apiAccessToken: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  handleDownload = () => {
    const { href, apiAccessToken } = this.props;
    if (href.includes('?')) {
      const url = `${API_URL}/${href.replace('?', `?token=${apiAccessToken}&`)}`;
      window.location = url;
    } else {
      const url = `${API_URL}/${href.replace(/^\//, '')}?token=${apiAccessToken}`;
      window.location = url;
    }
  }

  render() {
    const {
      href, apiAccessToken, dispatch, ...props
    } = this.props;
    return (
      <HandelButton
        onClick={this.handleDownload}
        iconColor="white"
        bgColor="blue"
        borderColor="blue"
        shadowColor="blue"
        {...props}
      >
        <span className="handel-download" />
      </HandelButton>
    );
  }
}

export default connect(state => ({
  apiAccessToken: state.common.identity.token.value,
}))(DownloadButton);
