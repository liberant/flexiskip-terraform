import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { delay } from 'redux-saga';

import { setTitle } from '../../../../common/actions';
import { ALERT_DISPLAY_DURATION } from '../../../../common/constants/params';

import {
  getDumpsiteDetailsById,
  updateDumpsiteDetails,
  deleteDumpsiteById,
  unmountClearDumpsiteDetails,
  getDumpsiteCouncilDefinations,
  getDumpsiteWastTypesList,
} from '../actions';

import { withPreventingCheckHOC } from '../../../../common/hocs';
import DumpsiteDetailsForm from '../components/DumpsiteDetailsForm';
import AdminLayout from '../../../hoc/AdminLayout';

import { WeekDayDefs } from '../constants/dumpsiteDefs';

import { Spinner } from '../../../../common/components';
import SimpleNewConfirmDlg from '../../../../common/components/SimpleNewConfirmDlg';
import { geoAddress } from '../../../../common/components/form/reduxFormComponents';

/* eslint no-restricted-globals: 0 */
/* eslint no-underscore-dangle: 0 */

const EDIT_DUMPSITE_FORM = 'admin/editDumpsiteDetail';

const EditDumpsiteDetailsForm = compose(
  reduxForm({
    form: EDIT_DUMPSITE_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(DumpsiteDetailsForm);

const selector = formValueSelector(EDIT_DUMPSITE_FORM);

class DumpsitesManageEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      firstFetchFlag: true,
      userType: 'dumpsites',
      dumpsiteId: this.props.match.params.id,

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

    this.handleDumpsiteSubmit = this.handleDumpsiteSubmit.bind(this);
    this.handleSuccesUpdate = this.handleSuccesUpdate.bind(this);
    // this.handleDeletion = this.handleDeletion.bind(this);
    this.onHandleToggleEdit = this.onHandleToggleEdit.bind(this);

    this.onHandleDeleteRequest = this.onHandleDeleteRequest.bind(this);
    this.onHandleConfirmDeleteRequest = this.onHandleConfirmDeleteRequest.bind(this);
    this.onHandleCancelDeleteRequest = this.onHandleCancelDeleteRequest.bind(this);
    this.onHandleDeleteRequestSuccess = this.onHandleDeleteRequestSuccess.bind(this);
  }


  componentDidMount() {
    const {
      setTitle, getDumpsiteDetailsById,
      councils, wasteTypes,
      getDumpsiteCouncilDefinations,
      getDumpsiteWastTypesList,
    } = this.props;
    const { userType, dumpsiteId } = this.state;

    setTitle('');
    if (councils.length < 1) {
      getDumpsiteCouncilDefinations();
    }
    if (wasteTypes.length < 1) {
      getDumpsiteWastTypesList();
    }
    getDumpsiteDetailsById({
      userType,
      url: 'dumpsites',
      uid: dumpsiteId,
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.dumpsiteDetails && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  componentWillUnmount() {
    this.props.unmountClearDumpsiteDetails();
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
      subTitle: 'By clicking DELETE, this dumpsite will be removed.',
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
    const { dumpsiteId, userType } = this.state;
    try {
      await this.props.deleteDumpsiteById({
        url: userType,
        uid: dumpsiteId,
      });

      const tmpModalContent = {
        title: 'Dumpsite Deleted',
        subTitle: 'The current dumpsite has been deleted',
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
        title: 'Dumpsite Deleted Failed',
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
    this.props.history.push('/admin/manage-dumpsites');
  }

  onHandleCancelDeleteRequest() {
    this.setState({
      modalIsOpen: false,
    });
  }

  async handleDumpsiteSubmit(values) {
    if (!values) {
      return;
    }

    const { userType, dumpsiteId } = this.state;

    const {
      code,
      openDays,
      name,
      address,
      council,
      amounts,
      wasteTypes,
    } = values;

    const tmpOpenDays = [];
    if (openDays && openDays.constructor === Array) {
      openDays.forEach((o, i) => {
        if (o && o.isOpen) {
          tmpOpenDays.push({
            fromTime: o.fromTime.text,
            toTime: o.toTime.text,
            weekDay: WeekDayDefs[i],
          });
        }
      });
    }
    const charges = [];
    if ((amounts && amounts.constructor === Array) &&
      (wasteTypes && wasteTypes.constructor === Array)) {
      amounts.forEach((a, i) => {
        if (a && wasteTypes[i]) {
          charges.push({
            amount: a,
            wasteType: wasteTypes[i],
          });
        }
      });
    }

    const data = {
      code,
      charges,
      name,
      council,
      address: address || 'N/A',
      openDays: tmpOpenDays,
    };


    await this.props.updateDumpsiteDetails({
      url: userType,
      uid: dumpsiteId,
      data,
    });

    this.setState({ isEdit: false });
  }

  async handleSuccesUpdate() {
    await delay(ALERT_DISPLAY_DURATION);
    this.props.history.push('/admin/manage-dumpsites');
  }

  render() {
    const {
      dumpsiteDetailsFlag, dumpsite,
      // form: { dirty, submitSucceeded },
      wasteTypes, openDays, councils,
    } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContent,
    } = this.state;

    if ((firstFetchFlag && !dumpsiteDetailsFlag) || (JSON.stringify(dumpsite) === '{}')) {
      return (
        <Spinner />
      );
    }

    // if (!dirty && submitSucceeded) {
    //   this.handleSuccesUpdate();
    // }

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
        <EditDumpsiteDetailsForm
          addFlag={false}
          editFlag={isEdit}
          data={{ name: dumpsite.name || '', code: dumpsite.code || '' }}
          initialValues={dumpsite}
          wasteTypes={wasteTypes}
          openDays={openDays}
          councils={councils}
          onSubmit={this.handleDumpsiteSubmit}
          handleDeletion={this.onHandleDeleteRequest}
          onToggleEdit={this.onHandleToggleEdit}
        />
      </div>
    );
  }
}

DumpsitesManageEditPage.propTypes = {
  dumpsiteDetailsFlag: PropTypes.bool.isRequired,
  dumpsite: PropTypes.any.isRequired,

  match: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,

  setTitle: PropTypes.func.isRequired,
  getDumpsiteDetailsById: PropTypes.func.isRequired,
  updateDumpsiteDetails: PropTypes.func.isRequired,
  deleteDumpsiteById: PropTypes.func.isRequired,
  unmountClearDumpsiteDetails: PropTypes.func.isRequired,
  wasteTypes: PropTypes.string.isRequired,
  openDays: PropTypes.any.isRequired,
  councils: PropTypes.any.isRequired,
  getDumpsiteCouncilDefinations: PropTypes.func.isRequired,
  getDumpsiteWastTypesList: PropTypes.func.isRequired,
};

DumpsitesManageEditPage.defaultProps = {
};

export default compose(
  AdminLayout,

  connect(
    state => ({
      dumpsiteDetailsFlag: state.common.requestFinished.dumpsiteDetails || false,
      dumpsite: state.admin.dumpsites.list.dumpsiteDetails || {},
      form: state.form['admin/editDumpsiteDetail'] || {},
      wasteType: selector(state, 'type'),
      openDays: selector(state, 'openDays'),
      wasteTypes: state.admin.dumpsites.list.wasteTypes || [],
      councils: state.admin.dumpsites.list.councils || [],
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getDumpsiteDetailsById: (data) => {
        const action = getDumpsiteDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateDumpsiteDetails: (data) => {
        const action = updateDumpsiteDetails(data);
        dispatch(action);
        return action.promise;
      },

      deleteDumpsiteById: (data) => {
        const action = deleteDumpsiteById(data);
        dispatch(action);
        return action.promise;
      },

      unmountClearDumpsiteDetails: () => {
        const action = unmountClearDumpsiteDetails();
        dispatch(action);
        return action.promise;
      },

      getDumpsiteCouncilDefinations: (data) => {
        const action = getDumpsiteCouncilDefinations(data);
        dispatch(action);
        return action.promise;
      },

      getDumpsiteWastTypesList: (data) => {
        const action = getDumpsiteWastTypesList(data);
        dispatch(action);
        return action.promise;
      },

    }),
  ),
)(DumpsitesManageEditPage);
