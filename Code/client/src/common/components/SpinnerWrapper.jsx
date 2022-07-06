import React from 'react';
import Spinner from './Spinner';

const SpinnerWrapper = ({ loading, children }) => {
  if (loading) return <Spinner />;
  return children;
};

export default SpinnerWrapper;
