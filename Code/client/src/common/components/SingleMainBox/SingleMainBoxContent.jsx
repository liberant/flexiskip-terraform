import React from 'react';
import PropTypes from 'prop-types';

class SingleMainBoxContent extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        {children}
      </div>
    );
  }
}

SingleMainBoxContent.propTypes = {
  children: PropTypes.node,
};

SingleMainBoxContent.defaultProps = {
  children: undefined,
};

export default SingleMainBoxContent;
