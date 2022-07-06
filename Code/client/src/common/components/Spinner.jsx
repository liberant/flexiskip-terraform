import React from 'react';

const Spinner = () => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, width: '100%',
    height: '100%',
    zIndex: 99,
    display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff90'
  }}>
  <p className="text-center">
    <i className="fa fa-circle-o-notch fa-spin fa-3x" />
  </p>
  </div>
);

export default Spinner;
