import React from 'react';
import PropTypes from 'prop-types';

import { MAIN_COLOR } from '../../../common/constants/styles';


const headerStyles = {
  box: {
    background: '#E9F5FF',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    lineHeight: '77px',
    width: 800,
    textAlign: 'left',
  },
};

class SingleMainBoxHeader extends React.Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    const { handleClose } = this.props;

    if (handleClose) {
      handleClose();
    }
  }

  render() {
    const { styles, closeText, title } = this.props;
    return (
      <div style={{ ...headerStyles.box, ...styles.box }}>
        <div
          style={{
            cursor: 'pointer',
            display: 'inline-block',
            marginLeft: 20,
            color: MAIN_COLOR,
            ...styles.close,
          }}
          onClick={this.handleClose}
        >
          <span style={{ fontSize: 20 }}>
            <span className="handel-cross" />
          </span>
          <span style={{
            fontSize: 16,
            display: 'inline-block',
            marginLeft: 5,
          }}
          >
            {closeText}
          </span>
        </div>
        <div style={{
          display: 'inline-block',
          marginLeft: '23%',
          fontSize: 28,
          color: '#666666',
          ...styles.title,
        }}
        >
          <span>{title}</span>
        </div>
      </div>
    );
  }
}

SingleMainBoxHeader.propTypes = {
  styles: PropTypes.any,
  closeText: PropTypes.string,
  title: PropTypes.string,
  handleClose: PropTypes.func,
};

SingleMainBoxHeader.defaultProps = {
  styles: {},
  closeText: 'Close',
  title: '',
  handleClose: null,
};

export default SingleMainBoxHeader;

