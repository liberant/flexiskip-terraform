import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({
  src, style, width, height,
}) => {
  const extStyle = {
    objectFit: 'cover',
    borderRadius: '100%',
    width: `${width}px`,
    height: `${height}px`,
    ...style,
  };

  return (
    <img src={src} style={extStyle} alt="" />
  );
};

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  style: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
};

Avatar.defaultProps = {
  width: 100,
  height: 100,
  style: {},
};

export default Avatar;
