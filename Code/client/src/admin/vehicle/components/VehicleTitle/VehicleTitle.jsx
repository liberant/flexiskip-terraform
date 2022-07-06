import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import './VehicleTitle.css';

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
  },
  backArrowBox: {
    display: 'flex',
    alignItems: 'center',
    color: '#1D415D',
  },
};


class VehicleTitle extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleAnchorOnClick = this.handleAnchorOnClick.bind(this);
  }

  handleAnchorOnClick() {
    const { history } = this.props;
    history.go(-1);
  }

  render() {
    const { vehicle } = this.props;
    return (
      <div className="vehicle-detail-title">
        <a style={stylesDetails.backArrowBox} onClick={this.handleAnchorOnClick}>
          <div style={stylesDetails.backBox}>
            <span className="handel-chevron-circle-left" />
          </div>
        </a>{vehicle && vehicle.model}
      </div>
    );
  }
}

VehicleTitle.propTypes = {
  history: PropTypes.object.isRequired,
  vehicle: PropTypes.object.isRequired,
};

export default withRouter(VehicleTitle);
