import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';

import { setTitle } from '../../../../common/actions';
import { createDumpsite, getDumpsiteCouncilDefinations, getDumpsiteWastTypesList } from '../actions';
import { withPreventingCheckHOC } from '../../../../common/hocs';
import DumpsiteDetailsForm from '../components/DumpsiteDetailsForm';
import AdminLayout from '../../../hoc/AdminLayout';
import { WeekDayDefs } from '../constants/dumpsiteDefs';
import SimpleConfirmDlg from '../../../../common/components/SimpleConfirmDlg';
import { geoAddress } from '../../../../common/components/form/reduxFormComponents';

/* eslint no-underscore-dangle: 0 */

const ADD_DUMPSITE_FORM = 'admin/addDumpsiteDetail';

const AddDumpsiteDetailsForm = compose(
  reduxForm({
    form: ADD_DUMPSITE_FORM,
  }),
  withPreventingCheckHOC,
)(DumpsiteDetailsForm);

const selector = formValueSelector(ADD_DUMPSITE_FORM);

class DumpsitesManageAddPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: true,
      isEdit: true,
      // firstFetchFlag: true,
      modalIsOpen: false,
    };

    this.handleDumpsiteSubmit = this.handleDumpsiteSubmit.bind(this);
    this.handleSuccessCreate = this.handleSuccessCreate.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.reloadPage = this.reloadPage.bind(this);
  }


  componentDidMount() {
    const {
      setTitle, getDumpsiteCouncilDefinations,
      getDumpsiteWastTypesList,
      councils, wasteTypes,
    } = this.props;

    setTitle('');

    if (councils.length < 1) {
      getDumpsiteCouncilDefinations();
    }
    if (wasteTypes.length < 1) {
      getDumpsiteWastTypesList();
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.dumpsitesListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  async handleDumpsiteSubmit(values) {
    if (!values) {
      return;
    }

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
            fromTime: o.fromTime.text || '08:30 AM',
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

    await this.props.createDumpsite({ url: 'dumpsites', data });
  }

  handleSuccessCreate() {
    // await delay(ALERT_DISPLAY_DURATION);
    this.openModal();
    // this.props.history.push('/admin/manage-dumpsites');
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.props.history.push('/admin/manage-dumpsites');
  }

  reloadPage() {
    window.location.reload();
  }

  render() {
    const { modalIsOpen, isAdd, isEdit } = this.state;
    const { wasteTypes, councils, openDays } = this.props;

    const { dirty, submitSucceeded } = this.props.form;
    if (!dirty && submitSucceeded && !modalIsOpen) {
      this.handleSuccessCreate();
    }

    return (
      <div className="x_panel_">
        <SimpleConfirmDlg
          modalIsOpen={modalIsOpen}
          title="Dumpsite Created"
          bottomTitle="Add Another Dumpsite"
          handleButtonClick={this.closeModal}
        />
        <AddDumpsiteDetailsForm
          addFlag={isAdd}
          editFlag={isEdit}
          wasteTypes={wasteTypes}
          openDays={openDays}
          councils={councils}
          onSubmit={this.handleDumpsiteSubmit}
        />
      </div>
    );
  }
}

DumpsitesManageAddPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  // dumpsitesListLoaded: PropTypes.bool.isRequired,
  createDumpsite: PropTypes.func.isRequired,
  history: PropTypes.any.isRequired,
  form: PropTypes.any.isRequired,
  // wasteType: PropTypes.string,
  councils: PropTypes.array.isRequired,
  wasteTypes: PropTypes.array.isRequired,
  getDumpsiteCouncilDefinations: PropTypes.func.isRequired,
  getDumpsiteWastTypesList: PropTypes.func.isRequired,
  openDays: PropTypes.any.isRequired,
};

DumpsitesManageAddPage.defaultProps = {
  // wasteType: 'Type 1',
};

export default compose(
  AdminLayout,

  connect(
    state => ({
      dumpsites: state.admin.dumpsites,
      form: state.form['admin/addDumpsiteDetail'] || {},
      wasteType: selector(state, 'type'),
      openDays: selector(state, 'openDays'),
      wasteTypes: state.admin.dumpsites.dumpsites.wasteTypes || [],
      councils: state.admin.dumpsites.dumpsites.councils || [],
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      createDumpsite: (data) => {
        const action = createDumpsite(data);
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
)(DumpsitesManageAddPage);
