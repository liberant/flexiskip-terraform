import React, { Component } from 'react';
import { any } from 'prop-types';

class InnerDivider extends Component {
  render() {
    const {
      width,
      border,
      marginBottom,
      marginTop,
      opacity,
    } = this.props;

    return (
      <div style={{
        width, border, marginBottom, marginTop, opacity,
      }}
      />
    );
  }
}

InnerDivider.propTypes = {
  width: any,
  border: any,
  marginBottom: any,
  marginTop: any,
  opacity: any,
};

InnerDivider.defaultProps = {
  width: '100%',
  border: '1px solid #ccc',
  marginBottom: 30,
  marginTop: 0,
  opacity: '0.4',
};

export default InnerDivider;
