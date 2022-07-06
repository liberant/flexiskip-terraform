import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';

import { withPreventingCheckHOC } from '../../../common/hocs';
import { SimpleCardLayout, SimpleConfirmDlg } from '../../../common/components';

import NewAdminSubForm from './NewAdminSubForm';

import { stylesDetails } from './Styles';


const BackPreviousPage = props => (
  <div style={{ display: 'flex' }}>
    <div style={stylesDetails.backArrowBox} onClick={props.goBack}>
      <div style={stylesDetails.backBox}>
        <span className="handel-chevron-circle-left" />
      </div>
    </div>
    <div>
      <div style={stylesDetails.backTitle}>
        Add Driver
      </div>
    </div>
  </div>
);

BackPreviousPage.propTypes = {
  goBack: PropTypes.func.isRequired,
};

const NEW_ADMIN_FORM = 'contractor/newDriver';
const AdminNewForm = compose(
  reduxForm({
    form: NEW_ADMIN_FORM,
    touchOnChange: true,
    touchOnBlur: true,
  }),
  withPreventingCheckHOC,
)(NewAdminSubForm);

const renderHandelAdminNewForm = props => (
  <AdminNewForm onSubmit={props.onHandleSubmit} />
);
renderHandelAdminNewForm.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
};

const AddNewArray = {
  driver: {
    label: 'Driver Details',
    render: renderHandelAdminNewForm,
    url: 'drivers',
  },
};

class AddAccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: 'driver',
      modalIsOpen: false,
      userTypeCurrent: 'admin',
      modalContent: {
        styles: {
          modal: { top: 430 },
          title: {
            color: '#f06666',
          },
          buttonText: {
            color: 'white',
            backgroundColor: '#f06666',
          },
        },
        title: 'You\'re Losing Your Input',
        subTitle: 'If you change the user type, you will lose the input.',
        buttonText: 'Confirm',
        bottomTitle: 'No, Stay here',
      },
    };

    this.onHandleClose = this.onHandleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitchUser = this.handleSwitchUser.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
  }

  onHandleClose() {
    this.setState({
      modalIsOpen: false,
    });
  }

  handleSubmit(data) {
    const { onHandleSubmit } = this.props;
    const { userType } = this.state;

    if (onHandleSubmit) {
      onHandleSubmit(data, AddNewArray[userType].url);
    }
  }

  handleSwitchUser() {
    const { userTypeCurrent } = this.state;
    if (!userTypeCurrent) {
      return;
    }

    this.setState({ userType: userTypeCurrent, modalIsOpen: false });
  }

  handleGoBack() {
    this.props.history.goBack();
  }

  render() {
    const { userType, modalIsOpen, modalContent } = this.state;
    return (
      <div>
        <SimpleConfirmDlg
          modalIsOpen={modalIsOpen}
          styles={modalContent.styles}
          title={modalContent.title}
          subTitle={modalContent.subTitle}
          buttonText={modalContent.buttonText}
          bottomTitle={modalContent.bottomTitle}
          handleButtonClick={this.handleSwitchUser}
          handleNoButtonClick={this.onHandleClose}
        >
          <span style={{ fontSize: 68, color: '#f06666' }}>
            <span className="handel-question" />
          </span>
        </SimpleConfirmDlg>
        <BackPreviousPage
          name="Add User"
          code=""
          goBack={this.handleGoBack}
        />
        <div>
          <SimpleCardLayout title="Driver Details">
            {
              AddNewArray[userType].render({ onHandleSubmit: this.handleSubmit })
            }
          </SimpleCardLayout>
        </div>
      </div>
    );
  }
}

AddAccountForm.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
  history: PropTypes.any.isRequired,
};

AddAccountForm.defaultProps = {

};

export default withRouter(AddAccountForm);

