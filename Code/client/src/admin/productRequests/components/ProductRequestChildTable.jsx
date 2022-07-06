import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { columnsSubItems } from './columnsDef';
/* eslint no-underscore-dangle: 0 */
/* eslint react/no-did-update-set-state: 0 */
/* eslint react/no-did-mount-set-state: 0 */

class ProductRequestChildTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedSet: [],
    };

    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  componentDidMount() {
    this.updateChildBinSetFromParent();
  }

  componentDidUpdate() {
    this.updateChildBinSetFromParent();
  }

  // Update delivery status
  onDeliveryStatusChange = (status, id) => {
    this.props.updateBinDeliveryStatusById({ uid: id, status });
  }

  updateChildBinSetFromParent() {
    const { checkall, data, parentId } = this.props;

    if (checkall && this.state.selectedSet.length !== data.length) {
      this.props.updateChildBinSet(this.state.selectedSet, true);
      this.setState({
        selectedSet: data.map(d => d._id),
      });
      this.props.updateChildBinSet(data.map(d => d._id), false, true, parentId);
    }

    if (!checkall && this.state.selectedSet.length === data.length) {
      this.props.updateChildBinSet(this.state.selectedSet, true);
      this.setState({
        selectedSet: [],
      });
      this.props.updateChildBinSet([], false, false, parentId);
    }
  }

  handleOnSelect(selectedRowKeys) {
    const { data, parentId } = this.props;
    // remove
    if (this.state.selectedSet.length > selectedRowKeys.length) {
      this.props.updateChildBinSet(this.state.selectedSet, true);
    } else {
      this.props.updateChildBinSet(selectedRowKeys, true);
    }

    this.setState({
      selectedSet: selectedRowKeys,
    });
    // re-add
    if (selectedRowKeys.length === data.length) {
      this.props.updateChildBinSet(selectedRowKeys, false, true, parentId);
    } else {
      this.props.updateChildBinSet(selectedRowKeys, false, false, parentId);
    }
  }

  render() {
    const { data } = this.props;
    return (
      <div style={{ padding: '10px 10px 30px 10px' }}>
        <Table
          rowSelection={{
            selectedRowKeys: this.state.selectedSet,
            onChange: this.handleOnSelect,
          }}
          columns={columnsSubItems}
          dataSource={data}
          pagination={false}
          rowKey="_id"
          className="row-clickable councils-table "
          style={{ backgroundColor: '#fff' }}
        />
      </div>
    );
  }
}

ProductRequestChildTable.propTypes = {
  data: PropTypes.any.isRequired,
  checkall: PropTypes.bool.isRequired,
  updateChildBinSet: PropTypes.func.isRequired,
  parentId: PropTypes.string.isRequired,
  updateBinDeliveryStatusById: PropTypes.func.isRequired,
};

export default ProductRequestChildTable;
