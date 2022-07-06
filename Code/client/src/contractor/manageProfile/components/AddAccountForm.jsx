import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { withRouter, Link } from 'react-router-dom';

import { withPreventingCheckHOC } from '../../../common/hocs';
import { SimpleCardLayout, SimpleConfirmDlg } from '../../../common/components';

import NewAdminSubForm from './NewAdminSubForm';
import { stylesDetails } from './Styles';


const BackPreviousPage = () => (
  <div style={{ display: 'flex' }}>
    <Link to="/contractor/profile" style={stylesDetails.backArrowBox}>
      <div style={stylesDetails.backBox}>
        <span className="handel-chevron-circle-left" />
      </div>
    </Link>
    <div>
      <div style={stylesDetails.backTitle}>
        Add Admin User
      </div>
    </div>
  </div>
);

BackPreviousPage.propTypes = {
};

const stylesBtn = {
  active: {
    btnStyles: {
      backgroundColor: '#239dff',
      border: '1px solid #239dff',
      boxShadow: '0 3px 5px 0 rgba(0, 0, 0, 0.2)',
    },
    titleStyles: {
      color: '#239dff',
    },
    iconStyles: {
      color: '#ffffff',
    },
  },
  inactive: {
    btnStyles: {
      backgroundColor: 'white',
      border: '1px solid #1D415D',
      boxShadow: '0 3px 5px 0 rgba(102, 102, 102, 0.5)',
      opacity: '0.3',
    },
    titleStyles: {
      color: '#666666',
    },
    iconStyles: {
      color: '#666666',
    },
  },
};


const NEW_ADMIN_FORM = 'contractor/newAdmin';
const AdminNewForm = compose(
  reduxForm({
    form: NEW_ADMIN_FORM,
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
  admin: {
    label: 'Add Admin Details',
    render: renderHandelAdminNewForm,
    url: 'admins',
  },
};

class AddAccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: 'admin',
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
    // this.onHandleSwitchUser = this.onHandleSwitchUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitchUser = this.handleSwitchUser.bind(this);
  }

  onHandleClose() {
    this.setState({
      modalIsOpen: false,
    });
  }

  // onHandleSwitchUser(user) {
  //   const { isTouched } = this.props;

  //   if (!isTouched) {
  //     this.setState({
  //       userType: user,
  //     });
  //   } else {
  //     this.setState({
  //       userTypeCurrent: user,
  //       modalIsOpen: true,
  //     });
  //   }
  // }

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
        />
        <div>
          <SimpleCardLayout title="Add Admin Details">
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
};

AddAccountForm.defaultProps = {

};

export default withRouter(AddAccountForm);

