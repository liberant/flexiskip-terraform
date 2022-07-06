import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Pagination, List } from 'antd';

import * as actions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';
import NoteItem from './NoteItem';

class ReportNotes extends React.Component {
  static propTypes = {
    disputeId: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    fetchDisputeNotes: PropTypes.func.isRequired,
    setNoteState: PropTypes.func.isRequired,
    notes: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const {
      fetchDisputeNotes,
      disputeId,
    } = this.props;
    fetchDisputeNotes(disputeId);
  }

  handlePageChange = (page) => {
    const {
      fetchDisputeNotes, setNoteState, pagination,
      disputeId,
    } = this.props;
    const newPag = {
      ...pagination,
      current: page,
    };
    setNoteState({ notePagination: newPag });
    fetchDisputeNotes(disputeId);
  }

  handlePageSizeChange = (value) => {
    const {
      fetchDisputeNotes, setNoteState, pagination,
      disputeId,
    } = this.props;
    const newPag = {
      ...pagination,
      current: 1,
      pageSize: parseInt(value, 10),
    };
    setNoteState({ notePagination: newPag });
    fetchDisputeNotes(disputeId);
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
    loading: state.common.loading.fetchDisputeNotes || false,
    notes: state.admin.manageDisputes.view.notes,
    pagination: state.admin.manageDisputes.view.notePagination,
  }),
  dispatch => bindActionCreators({
    fetchDisputeNotes: actions.fetchDisputeNotes,
    setNoteState: actions.setNoteState,
  }, dispatch),
)(ReportNotes);
