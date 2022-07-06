import React from 'react';
import PropTypes from 'prop-types';

class SingleMainBoxFooter extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div>
        {children}
      </div>
    );
  }
}

SingleMainBoxFooter.propTypes = {
  children: PropTypes.node,
};

SingleMainBoxFooter.defaultProps = {
  children: undefined,
};

export default SingleMainBoxFooter;
