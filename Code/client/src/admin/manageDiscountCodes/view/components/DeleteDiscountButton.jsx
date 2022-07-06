import React from 'react';
import PropTypes from 'prop-types';
import { Popconfirm } from 'antd';
import { connect } from 'react-redux';

import * as actions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';
import HandelButton from '../../../../common/components/HandelButton';

class DeleteDiscountButton extends React.Component {
  static propTypes = {
    deleteDiscount: PropTypes.func.isRequired,
    deleting: PropTypes.bool.isRequired,
    discount: PropTypes.object.isRequired,
  }

  handleDelete = async () => {
    const { discount, deleteDiscount } = this.props;
    deleteDiscount(discount._id);
  }

  render() {
    const { deleting } = this.props;
    return (
      <Popconfirm
        title="Are you sure delete this item?"
        onConfirm={this.handleDelete}
        okText="Yes"
        cancelText="No"
      >
        <div style={{ display: 'inline-block' }}>
          <HandelButton
            label="Delete"
            borderColor="red"
            iconColor="white"
            shadowColor="red"
            bgColor="red"
            loading={deleting}
          >
            <span className="handel-bin" />
          </HandelButton>
        </div>
      </Popconfirm>
    );
  }
}

export default connect(
  state => ({
    deleting: state.common.loading.deleteDiscount || false,
  }),
  dispatch => bindActionCreators({
    deleteDiscount: actions.deleteDiscount,
  }, dispatch),
)(DeleteDiscountButton);
