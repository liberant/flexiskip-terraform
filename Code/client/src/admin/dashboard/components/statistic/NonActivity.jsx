import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import { withRouter } from 'react-router-dom';

import Statistic from './Statistic';

class NonActivity extends React.Component {
  handleClick = () => {
    this.props.history.push('/admin/non-activity');
  }

  render() {
    const { value } = this.props;
    const title = {
      iconClass: 'handel-users',
      text: 'Non-Activity',
    };

    return (
      <div
        className="clickable"
        onClick={this.handleClick}
        title="Click to view"
      >
        <Statistic title={title}>
          {numeral(value).format('0,0')}
        </Statistic>
      </div>
    );
  }
}

NonActivity.propTypes = {
  value: PropTypes.number,
  history: PropTypes.object.isRequired,
};

NonActivity.defaultProps = {
  value: 0,
};

export default withRouter(NonActivity);
