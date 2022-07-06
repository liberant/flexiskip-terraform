import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { delay } from 'redux-saga';

import { setTitle } from '../../../common/actions';
import { ALERT_DISPLAY_DURATION } from '../../../common/constants/params';

import {
  getAdvertisingDetailsById,
  updateAdvertisingDetails,
  deleteAdvertisingById,
  unmountClearAdvertisingDetails,
  publishAdvertising,
} from '../actions';

import { withPreventingCheckHOC } from '../../../common/hocs';
import AdvertisingDetailsForm from '../components/AdvertisingDetailsForm';
import AdminLayout from '../../hoc/AdminLayout';


import { Spinner } from '../../../common/components';
import SimpleNewConfirmDlg from '../../../common/components/SimpleNewConfirmDlg';

/* eslint no-restricted-globals: 0 */
/* eslint no-underscore-dangle: 0 */

const EDIT_ADVERTISING_FORM = 'admin/editAdvertisingDetail';

const EditAdvertisingDetailsForm = compose(
  reduxForm({
    form: EDIT_ADVERTISING_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(AdvertisingDetailsForm);

const selector = formValueSelector(EDIT_ADVERTISING_FORM);

class AdvertisingManageEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      firstFetchFlag: true,
      userType: 'advertising',
      advertisingId: this.props.match.params.id,

      modalIsOpen: false,
      modalContent: {
        styles: { modal: { top: 430 } },
        title: 'Email Sent',
        subTitle: 'Password reset instructions is sent to',
        buttonText: 'OK',
        bottomTitle: '',
        handleButtonClick: () => { },
        handleNoButtonClick: () => { },
      },
    };

    this.handleAdvertisingSubmit = this.handleAdvertisingSubmit.bind(this);
    this.handleSuccesUpdate = this.handleSuccesUpdate.bind(this);
    // this.handleDeletion = this.handleDeletion.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);

    this.onHandleDeleteRequest = this.onHandleDeleteRequest.bind(this);
    this.onHandleConfirmDeleteRequest = this.onHandleConfirmDeleteRequest.bind(this);
    this.onHandleCancelDeleteRequest = this.onHandleCancelDeleteRequest.bind(this);
    this.onHandleDeleteRequestSuccess = this.onHandleDeleteRequestSuccess.bind(this);
    this.onHandlePublishAdvertising = this.onHandlePublishAdvertising.bind(this);
  }


  componentDidMount() {
    const {
      setTitle, getAdvertisingDetailsById,
    } = this.props;
    const { userType, advertisingId } = this.state;

    setTitle('');

    getAdvertisingDetailsById({
      userType,
      url: 'advertising',
      uid: advertisingId,
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.advertisingDetails && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  componentWillUnmount() {
    this.props.unmountClearAdvertisingDetails();
  }

  onHandleToggleEdit() {
    const { isEdit } = this.state;
    this.setState({
      isEdit: !isEdit,
    });
  }

  onHandleDeleteRequest() {
    const tmpModalContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, this advertising will be removed.',
      buttonText: 'DELETE',
      bottomTitle: 'Do not Delete',
      styles: {
        title: {
          color: '#f06666',
        },
        buttonText: {
          color: 'white',
          backgroundColor: '#f06666',
        },
      },
      handleButtonClick: this.onHandleConfirmDeleteRequest,
      handleNoButtonClick: this.onHandleCancelDeleteRequest,
    };

    this.setState({
      modalIsOpen: true,
      modalContent: tmpModalContent,
    });
  }

  async onHandleConfirmDeleteRequest() {
    const { advertisingId, userType } = this.state;
    try {
      await this.props.deleteAdvertisingById({
        url: userType,
        uid: advertisingId,
      });

      const tmpModalContent = {
        title: 'Advertising Deleted',
        subTitle: 'The current advertising has been deleted',
        buttonText: 'OK',
        bottomTitle: '',
        styles: {
          // modal: { top: 430 },
          bottomTitle: {
            display: 'none',
          },
        },
        handleButtonClick: this.onHandleDeleteRequestSuccess,
      };
      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
      });
    } catch (error) {
      const tmpModalContent = {
        title: 'Advertising Deleted Failed',
        subTitle: `Error occured: ${error.message}`,
        buttonText: 'OK',
        bottomTitle: '',
        styles: {
          title: {
            color: '#f06666',
          },
          buttonText: {
            color: 'white',
            backgroundColor: '#f06666',
          },
          bottomTitle: {
            display: 'none',
          },
        },
        handleButtonClick: this.onHandleCancelDeleteRequest,
      };

      this.setState({
        modalIsOpen: true,
        modalContent: tmpModalContent,
      });
    }
  }

  onHandleDeleteRequestSuccess() {
    this.props.history.push('/admin/manage-advertising');
  }

  onHandleCancelDeleteRequest() {
    this.setState({
      modalIsOpen: false,
    });
  }

  onHandlePublishAdvertising() {
    const { publishAdvertising } = this.props;
    const { advertisingId } = this.state;
    publishAdvertising({
      uid: advertisingId,
    });
  }

  async handleAdvertisingSubmit(values) {
    if (!values) {
      return;
    }

    const { advertisingId } = this.state;

    const {
      title, content, startDate, endDate, status, section, image,
    } = values;

    const data = {
      title,
      content,
      status,
      section,
      image,
      startDate,
      endDate,
    };

    await this.props.updateAdvertisingDetails({
      url: 'ads',
      uid: advertisingId,
      data,
    });

    this.setState({ isEdit: false });
  }

  async handleSuccesUpdate() {
    await delay(ALERT_DISPLAY_DURATION);
    this.props.history.push('/admin/manage-advertising');
  }

  render() {
    const {
      advertisingDetailsFlag, advertising, section,
      // form: { dirty, submitSucceeded },
    } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContent,
    } = this.state;

    if ((firstFetchFlag && !advertisingDetailsFlag) || (JSON.stringify(advertising) === '{}')) {
      return (
        <Spinner />
      );
    }

    return (
      <div className="x_panel_">
        <SimpleNewConfirmDlg
          modalIsOpen={modalIsOpen}
          styles={modalContent.styles}
          title={modalContent.title}
          subTitle={modalContent.subTitle}
          buttonText={modalContent.buttonText}
          bottomTitle={modalContent.bottomTitle}
          handleButtonClick={modalContent.handleButtonClick}
          handleNoButtonClick={modalContent.handleNoButtonClick}
        >
          <span style={modalContent.styles.icon}>
            <span className={modalContent.iconSpanName} />
          </span>
        </SimpleNewConfirmDlg>
        <EditAdvertisingDetailsForm
          addFlag={false}
          isPublish={!advertising.published}
          isEdit={!advertising.published}
          editFlag={isEdit}
          section={section}
          data={{ name: advertising.title || '', code: '' }}
          initialValues={advertising}
          onSubmit={this.handleAdvertisingSubmit}
          handleDeletion={this.onHandleDeleteRequest}
          onToggleEdit={this.onHandleToggleEdit}
          publishAdvertising={this.onHandlePublishAdvertising}
        />
      </div>
    );
  }
}

AdvertisingManageEditPage.propTypes = {
  advertisingDetailsFlag: PropTypes.bool.isRequired,
  advertising: PropTypes.any.isRequired,
  section: PropTypes.string.isRequired,
  match: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,

  setTitle: PropTypes.func.isRequired,
  getAdvertisingDetailsById: PropTypes.func.isRequired,
  updateAdvertisingDetails: PropTypes.func.isRequired,
  deleteAdvertisingById: PropTypes.func.isRequired,
  unmountClearAdvertisingDetails: PropTypes.func.isRequired,
  publishAdvertising: PropTypes.func.isRequired,
};

AdvertisingManageEditPage.defaultProps = {
};

export default compose(
  AdminLayout,

  connect(
    state => ({
      advertisingDetailsFlag: state.common.requestFinished.advertisingDetails || false,
      advertising: state.admin.advertising.advertising.advertisingDetails || {},
      form: state.form['admin/editAdvertisingDetail'] || {},
      section: selector(state, 'section') || 'Horizontal',
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getAdvertisingDetailsById: (data) => {
        const action = getAdvertisingDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateAdvertisingDetails: (data) => {
        const action = updateAdvertisingDetails(data);
        dispatch(action);
        return action.promise;
      },

      deleteAdvertisingById: (data) => {
        const action = deleteAdvertisingById(data);
        dispatch(action);
        return action.promise;
      },

      unmountClearAdvertisingDetails: () => {
        const action = unmountClearAdvertisingDetails();
        dispatch(action);
        return action.promise;
      },

      publishAdvertising: (data) => {
        const action = publishAdvertising(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(AdvertisingManageEditPage);
