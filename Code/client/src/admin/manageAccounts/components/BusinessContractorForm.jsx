import React from 'react';
import { withRouter } from 'react-router-dom';
import { any, bool, func } from 'prop-types';

import { SimpleCardLayout } from '../../../common/components';

import HeaderSubForm from './HeaderSubForm';
import AccountDetailsSubForm from './AccountDetailsSubForm';
import BusinessDetailsSubForm from './BusinessDetailsSubForm';
import PaymentInformationSubForm from './PaymentInformationSubForm';
import CommonLocalDataTable from '../../../common/components/CommonLocalDataTable';
import {
  columnsContractorAdmin,
  columnsVehicle,
  columnsDrivers,
} from './columnsDef';
import { onUserClick } from '../helpers';

class BusinessContractorForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
    this.handleSearchVehicle = this.handleSearchVehicle.bind(this);
    this.handleSearchDriver = this.handleSearchDriver.bind(this);

    this.state = {
      vehicles: (this.props.data && this.props.data.vehicles) ? this.props.data.vehicles : [],
      drivers: (this.props.data && this.props.data.drivers) ? this.props.data.drivers : [],
    };
  }

  handleResetPassword() {
    this.props.onResetPassword();
  }

  handleSave() {
    this.props.handleSubmit();
  }

  handleToggleEdit() {
    this.props.onToggleEdit();
  }

  handleDeletion() {
    this.props.onDelete();
  }

  handleSearchVehicle(event) {
    const { data } = this.props;
    const allVehicles = (data && data.vehicles) ? data.vehicles : [];
    const s = event.target.value;
    const vehicles = allVehicles.filter(v => (v.regNo.indexOf(s) !== -1));
    this.setState(() => ({ vehicles, loading: true }));
  }

  handleSearchDriver(event) {
    const { data } = this.props;
    const allDrivers = (data && data.drivers) ? data.drivers : [];
    const s = event.target.value;
    const drivers = allDrivers.filter(drv => ((drv.uId.indexOf(s) !== -1) || (drv.firstname.indexOf(s) !== -1) || (drv.lastname.indexOf(s) !== -1) || (drv.phone.indexOf(s) !== -1)));
    this.setState(() => ({ drivers, loading: true }));
  }

  rowEventsUser = {
    onClick: onUserClick.bind(this),
  }

  rowEventsDriverUser = {
    onClick: (e, row) => {
      const { _id } = row;
      const { history } = this.props;
      const entireUrl = `/admin/manage-accounts/driver/${_id}?edit=true`;
      history.push(entireUrl);
    },
  }

  rowEventsVehicle = {
    onClick: (e, row) => {
      const { _id } = row;
      const { history } = this.props;
      const entireUrl = `/admin/vehicle/${_id}?edit=true`;
      history.push(entireUrl);
    },
  }

  render() {
    const {
      data, isEdit, handleSubmit,
      dirty, onDelete,
    } = this.props;
    const name = (data && data.organisation) ? data.organisation.name : '';
    const users = (data && data.contractors) ? data.contractors : [];
    const { vehicles, drivers } = this.state;
    const code = (data && data.organisation && data.organisation.abn) ?
      data.organisation.abn : '';

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <HeaderSubForm
              name={name}
              code={code}
              isEdit={isEdit}
              isDirty={dirty}
              resetPasswordFlag
              handleResetPassword={this.handleResetPassword}
              handleSave={this.handleSave}
              handleToggleEdit={this.handleToggleEdit}
              handleDeletion={onDelete}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Account Details">
              <AccountDetailsSubForm
                isEdit={isEdit}
              />
            </SimpleCardLayout>
            <SimpleCardLayout title="Payment Information">
              <PaymentInformationSubForm
                cardFieldName="organisation.payment.cardLast4Digits"
              />
            </SimpleCardLayout>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Business Details">
              <BusinessDetailsSubForm
                isEdit={isEdit}
              />
            </SimpleCardLayout>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <SimpleCardLayout title="Administrator Users">
              <CommonLocalDataTable
                selectRowFlag={false}
                data={users}
                columnsDef={columnsContractorAdmin}
              />
            </SimpleCardLayout>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <SimpleCardLayout
              title="Vehicle"
              searchFlag
              onHandleSearch={this.handleSearchVehicle}
            >
              <CommonLocalDataTable
                data={vehicles}
                columnsDef={columnsVehicle}
                selectRowFlag={false}
                rowEvents={this.rowEventsVehicle}
              />
            </SimpleCardLayout>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <SimpleCardLayout
              title="Drivers"
              searchFlag
              onHandleSearch={this.handleSearchDriver}
            >
              <CommonLocalDataTable
                data={drivers}
                columnsDef={columnsDrivers}
                selectRowFlag={false}
                rowEvents={this.rowEventsDriverUser}
              />
            </SimpleCardLayout>
          </div>
        </div>
      </form>
    );
  }
}

BusinessContractorForm.propTypes = {
  data: any.isRequired,
  isEdit: bool.isRequired,
  dirty: bool,
  handleSubmit: func.isRequired,
  onResetPassword: func.isRequired,
  onToggleEdit: func.isRequired,
  onDelete: func.isRequired,
  history: any.isRequired,
};

BusinessContractorForm.defaultProps = {
  dirty: false,
};

export default withRouter(BusinessContractorForm);
