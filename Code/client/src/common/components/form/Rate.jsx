import React from 'react';
import { Rate as AntRate } from 'antd';

/**
 * A wrapper of ant design Rate input
 * with predefined styles
 */
const Rate = (props) => {
  const style = {
    color: '#239dff',
    fontSize: '12px',
  };

  const subProps = {
    allowHalf: true,
    style,
    ...props,
  };

  return (
    <AntRate {...subProps} />
  );
};

export default Rate;
