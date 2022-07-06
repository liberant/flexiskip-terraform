import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';

import * as actions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';
import Avatar from '../../../../common/components/Avatar';
import RelativeTime from './RelativeTime';
import EditNoteForm from './EditNoteForm';

import styles from './NoteItem.m.css';

class ReportNoteItem extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    deleteNote: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
  }

  state = {
    deleting: false,
    editing: false,
  }

  handleDelete = async () => {
    const note = this.props.data;
    this.setState({ deleting: true });
    try {
      await this.props.deleteNote(note);
      this.setState({ deleting: false });
    } catch (error) {
      this.setState({ deleting: false });
    }
  }

  enableEditing = () => {
    this.setState({ editing: true });
  }

  disableEditing = () => {
    this.setState({ editing: false });
  }

  handleUpdatingNote = async (values) => {
    await this.props.updateNote(values);
    this.setState({ editing: false });
  }

  render() {
    const { data } = this.props;
    const { user, isAuthor } = data;
    const { deleting, editing } = this.state;
    return (
      <div className="row">
        <div className="col-sm-1 text-center">
          <Avatar src={user.avatar} width={60} height={60} style={{ display: 'inline-block' }} />
        </div>
        <div className="col-sm-11">
          <div className={styles.content}>
            <p><strong className={styles.title}>{`${user.firstname} ${user.lastname}`}</strong></p>
            <p className={styles.time}><RelativeTime value={data.createdAt} /></p>
            {!editing && (<div>{data.content}</div>)}

            {isAuthor && (
              editing ? (
                <EditNoteForm
                  noteId={data._id}
                  initialValues={data}
                  onSubmit={this.handleUpdatingNote}
                  onCancel={this.disableEditing}
                  form={`editNote${data._id}`}
                />
              ) : (
                <div className={styles.buttons} >
                  <Button
                    shape="circle"
                    size="large"
                    className={styles.btnBlue}
                    onClick={this.enableEditing}
                  >
                    <span className="handel-pencil" />
                  </Button>
                  <Popconfirm
                    title="Are you sure delete this note?"
                    onConfirm={this.handleDelete}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="danger"
                      shape="circle"
                      size="large"
                      loading={deleting}
                      className={styles.btnRed}
                    >
                      {!deleting && (<span className="handel-bin" />)}
                    </Button>
                  </Popconfirm>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  undefined,
  dispatch => bindActionCreators({
    deleteNote: actions.deleteDisputeNote,
    updateNote: actions.updateDisputeNote,
  }, dispatch),
)(ReportNoteItem);
