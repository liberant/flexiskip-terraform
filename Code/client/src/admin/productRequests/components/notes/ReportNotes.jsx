import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Pagination, List } from 'antd';

import * as actions from '../../actions';
import { bindActionCreators } from '../../../../common/helpers';
import NoteItem from './NoteItem';

class ReportNotes extends React.Component {
  static propTypes = {
    productRequests: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    fetchBinRequestNotes: PropTypes.func.isRequired,
    setNoteState: PropTypes.func.isRequired,
    notes: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const {
      fetchBinRequestNotes,
      productRequests,
    } = this.props;
    fetchBinRequestNotes(productRequests._id);
  }

  handlePageChange = (page) => {
    const {
      fetchBinRequestNotes, setNoteState, pagination,
      productRequests,
    } = this.props;
    const newPag = {
      ...pagination,
      current: page,
    };
    setNoteState({ notePagination: newPag });
    fetchBinRequestNotes(productRequests._id);
  }

  handlePageSizeChange = (value) => {
    const {
      fetchBinRequestNotes, setNoteState, pagination,
      productRequests,
    } = this.props;
    const newPag = {
      ...pagination,
      current: 1,
      pageSize: parseInt(value, 10),
    };
    setNoteState({ notePagination: newPag });
    fetchBinRequestNotes(productRequests._id);
  }

  render() {
    const {
      loading, notes, pagination,
    } = this.props;
    return (
      <React.Fragment>
        <div className="w-panel">
          <div className="w-title">
            <h2>Notes</h2>
          </div>
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={notes}
            renderItem={item => (
              <List.Item key={item._id}>
                <NoteItem data={item} />
              </List.Item>
              )
            }
          />
        </div>
        <div className="bottom-toolbar">
          <div />
          <Pagination className="w-pagination" {...pagination} onChange={this.handlePageChange} />
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
    productRequests: state.admin.productRequests.productRequests.productRequests || {},
    loading: state.common.loading.fetchBinRequestNotes || false,
    notes: state.admin.productRequests.productRequests.notes,
    pagination: state.admin.productRequests.productRequests.notePagination,
  }),
  dispatch => bindActionCreators({
    fetchBinRequestNotes: actions.fetchBinRequestNotes,
    setNoteState: actions.setNoteState,
  }, dispatch),
)(ReportNotes);
