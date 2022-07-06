import React from 'react';
import PropTypes from 'prop-types';

import SingleMainBoxHeader from './SingleMainBoxHeader';
import SingleMainBoxContent from './SingleMainBoxContent';
import SingleMainBoxFooter from './SingleMainBoxFooter';

const boxStyles = {
  box: {
    borderRadius: 8,
    maxWidth: 800,
    height: 600,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 6px 8px 0 rgba(102, 102, 102, 0.7)',
    margin: 'auto',
    marginBottom: 60,
  },
};

class SingleMainBox extends React.Component {
  static Header = SingleMainBoxHeader;
  static Content = SingleMainBoxContent;
  static Footer = SingleMainBoxFooter;

  render() {
    const { children, styles } = this.props;
    return (
      <div style={{
        ...boxStyles.box,
        ...styles,
        }}
      >
        {children}
      </div>
    );
  }
}

SingleMainBox.propTypes = {
  children: PropTypes.node,
  styles: PropTypes.any,
};

SingleMainBox.defaultProps = {
  children: undefined,
  styles: {},
};

export default SingleMainBox;
