import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { Modal, Button, Icon, Alert } from 'antd';

import Spinner from '../../../../common/components/Spinner';
import {
  renderInput,
  required,
  email,
  phoneNumber,
  normalizePhoneNumber10,
} from '../../../../common/components/form/reduxFormComponents';

import * as actions from '../../actions';
import styles from './AddConnectedUser.m.css';

class AddConnectedUser extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleClickOnOkButton = this.handleClickOnOkButton.bind(this);
  }
  componentDidUpdate(prevProps) {
    const {
      formValues,
      clearCreateNewConnectedUser,
      addConnectedUser: { error },
    } = this.props;
    if (error && formValues !== prevProps.formValues) {
      clearCreateNewConnectedUser();
    }
  }
  handleSubmit(data) {
    const { createNewConnectedUser, organisation } = this.props;
    createNewConnectedUser({ ...data, orgId: organisation._id });
  }
  handleClickOnOkButton(e) {
    const {
      customer,
      getCustomerDetailsById,
      clearCreateNewConnectedUser, handleAddConnectedUser,
    } = this.props;
    getCustomerDetailsById({
      userType: 'bus-customers',
      url: 'bus-customers',
      uid: customer._id,
    });
    handleAddConnectedUser(e);
    clearCreateNewConnectedUser();
  }
  handleCloseModal(e) {
    const {
      clearCreateNewConnectedUser, handleAddConnectedUser,
    } = this.props;
    handleAddConnectedUser(e);
    clearCreateNewConnectedUser();
  }
  renderFormInput() {
    const {
      isShow,
      handleSubmit,
      addConnectedUser: { loading, error },
    } = this.props;
    return (
      <React.Fragment>
        <Modal
          maskClosable={false}
          destroyOnClose
          width={450}
          title="Add Connected User"
          visible={isShow}
          className="w-modal"
          onOk={null}
          onCancel={this.handleCloseModal}
          footer={null}
        >
          <form className="w-form" onSubmit={handleSubmit(this.handleSubmit)}>
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-6">
                <Field
                  name="firstname"
                  label="First Name"
                  component={renderInput}
                  required
                  validate={[required]}
                />
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6">
                <Field
                  name="lastname"
                  label="Last Name"
                  component={renderInput}
                  required
                  validate={[required]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12">
                <Field
                  name="position"
                  label="Position (Optional)"
                  component={renderInput}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12">
                <Field
                  name="email"
                  label="Email"
                  component={renderInput}
                  required
                  validate={[required, email]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12">
                <Field
                  name="phone"
                  label="Phone"
                  component={renderInput}
                  required
                  validate={[required, phoneNumber]}
                  normalize={normalizePhoneNumber10}
                />
              </div>
            </div>
            {
              (error && error.response && error.response.status >= 500) && (
                <React.Fragment>
                  <br />
                  <Alert
                    message="Error"
                    description={error.message}
                    type="error"
                    showIcon
                  />
                </React.Fragment>
              )
            }
            <br />
            <div className="text-center">
              {
                loading ? (
                  <Spinner />
                ) : (
                  <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    style={{ width: 200, fontSize: 14 }}
                  >
                    SUBMIT
                  </Button>
                )
              }
            </div>
          </form>
        </Modal >
      </React.Fragment>
    );
  }
  renderSuccessed() {
    const {
      isShow,
    } = this.props;
    return (
      <React.Fragment>
        <Modal
          maskClosable={false}
          destroyOnClose
          closable={false}
          width={450}
          title="Add Connected User"
          visible={isShow}
          footer={null}
          className="w-modal"
          onOk={null}
          onCancel={null}
        >
          <div className={styles.successedModal}>
            <Icon type="check-circle" className={styles['successedModal-icon']} />
            <br />
            <div className={styles['successedModal-message']}>
              Create connected user successed
            </div>
            <br />
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: 200, fontSize: 14 }}
              onClick={this.handleClickOnOkButton}
            >
              Ok
            </Button>
          </div>
        </Modal >
      </React.Fragment>
    );
  }
  render() {
    const {
      addConnectedUser: {
        data, error,
      },
    } = this.props;
    if (data !== null && error === null) {
      return this.renderSuccessed();
    }
    return this.renderFormInput();
  }
}

AddConnectedUser.propTypes = {
  isShow: PropTypes.bool.isRequired,
  handleAddConnectedUser: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createNewConnectedUser: PropTypes.func.isRequired,
  organisation: PropTypes.object.isRequired,
  addConnectedUser: PropTypes.object.isRequired,
  clearCreateNewConnectedUser: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  getCustomerDetailsById: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formValues: getFormValues('addConnectedUser')(state),
  addConnectedUser: state.admin.accounts.customers.addConnectedUser,
  customer: state.admin.accounts.customers.details || {},
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createNewConnectedUser: actions.createNewConnectedUser,
  clearCreateNewConnectedUser: actions.clearCreateNewConnectedUser,
  getCustomerDetailsById: actions.getCustomerDetailsById,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addConnectedUser',
    destroyOnUnmount: true,
    touchOnChange: true,
  }),
)(AddConnectedUser);
