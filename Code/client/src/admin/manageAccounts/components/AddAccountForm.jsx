import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { withPreventingCheckHOC } from '../../../common/hocs';
import { ActionButton, SimpleCardLayout, SimpleConfirmDlg } from '../../../common/components';

import NewResidentialCustomerSubForm from './NewResidentialCustomerSubForm';
import NewBusinessCustomerSubForm from './NewBusinessCustomerSubForm';
import NewBusinessContractorSubForm from './NewBusinessContractorSubForm';
import NewHandelAdminSubForm from './NewHandelAdminSubForm';
import NewDriverSubForm from './NewDriverSubForm';
import NewCouncilOfficerSubForm from './NewCouncilOfficerSubForm';

import { setTab } from '../actions';

import { stylesDetails } from './Styles';
import { geoAddress } from '../../../common/components/form/reduxFormComponents';

import {
  getCouncilList,
} from '../actions';

// mapping between userType and tabIndex in manage account page
const tabMapping = [
  { userType: 'residential', tabIndex: 0 },
  { userType: 'businessCustomer', tabIndex: 1 },
  { userType: 'businessContractor', tabIndex: 2 },
  { userType: 'driver', tabIndex: 3 },
  { userType: 'councilOfficer', tabIndex: 4 },
  { userType: 'handelAdmin', tabIndex: 5 },
];

const BackPreviousPage = props => (
  <div style={{ display: 'flex' }}>
    <Link to="/admin/manage-accounts" style={stylesDetails.backArrowBox}>
      <div style={stylesDetails.backBox}>
        <span className="handel-chevron-circle-left" />
      </div>
    </Link>
    <div>
      <div style={stylesDetails.backTitle}>
        {props.name}
      </div>
      <div style={stylesDetails.backText}>
        {props.code}
      </div>
    </div>
  </div>
);

BackPreviousPage.propTypes = {
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
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

const stylesBtnContractor = {
  active: {
    btnStyles: {
      lineHeight: '34px',
      backgroundColor: '#239dff',
      border: '1px solid #239dff',
      boxShadow: '0 3px 5px 0 rgba(0, 0, 0, 0.2)',
    },
    titleStyles: {
      color: '#239dff',
    },
    iconStyles: {
      fontSize: 22,
      color: '#ffffff',
    },
  },
  inactive: {
    btnStyles: {
      lineHeight: '34px',
      backgroundColor: 'white',
      border: '1px solid #1D415D',
      boxShadow: '0 3px 5px 0 rgba(102, 102, 102, 0.5)',
      opacity: '0.3',
    },
    titleStyles: {
      color: '#666666',
    },
    iconStyles: {
      fontSize: 22,
      color: '#666666',
    },
  },
};

const UserTypeButtons = props => (
  <div style={{ margin: '30px 0' }}>
    <ActionButton
      title="Residential Customer"
      spanName="handel-home"
      stylesExtra={
        props.userType === 'residential' ? stylesBtn.active : stylesBtn.inactive
      }
      handleClick={() => props.handleSwitchUser('residential')}
    />

    <ActionButton
      title="Business Customer"
      spanName="handel-business"
      stylesExtra={
        props.userType === 'businessCustomer' ? stylesBtn.active : stylesBtn.inactive
      }
      handleClick={() => props.handleSwitchUser('businessCustomer')}
    />

    <ActionButton
      title="Business Contractor"
      spanName="handel-handshake"
      stylesExtra={
        props.userType === 'businessContractor' ? stylesBtnContractor.active : stylesBtnContractor.inactive
      }
      handleClick={() => props.handleSwitchUser('businessContractor')}
    />

    <ActionButton
      title="Driver"
      spanName="handel-driver"
      stylesExtra={
        props.userType === 'driver' ? stylesBtn.active : stylesBtn.inactive
      }
      handleClick={() => props.handleSwitchUser('driver')}
    />

    <ActionButton
      title="Council Officer"
      spanName="handel-business"
      stylesExtra={
        props.userType === 'councilOfficer' ? stylesBtn.active : stylesBtn.inactive
      }
      handleClick={() => props.handleSwitchUser('councilOfficer')}
    />

    <ActionButton
      title="handel: Admin"
      spanName="handel-admin"
      stylesExtra={
        props.userType === 'handelAdmin' ? stylesBtn.active : stylesBtn.inactive
      }
      handleClick={() => props.handleSwitchUser('handelAdmin')}
    />
  </div>
);
UserTypeButtons.propTypes = {
  handleSwitchUser: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
};


const NEW_RESIDENTIAL_CUSTOMER_FORM = 'admin/newResidentialCustomer';
const ResidentialCustomerNewForm = compose(
  reduxForm({
    form: NEW_RESIDENTIAL_CUSTOMER_FORM,
  }),
  withPreventingCheckHOC,
)(NewResidentialCustomerSubForm);

const renderResidentialCustomerNewForm = (props) => (
  <ResidentialCustomerNewForm
    onSubmit={props.onHandleSubmit}
    isSaving={props.isSaving}
    dataCustomer={props.dataCustomer}
    handleSubmitWithPayment={props.handleSubmitWithPayment}
  />
);

renderResidentialCustomerNewForm.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const NEW_BUSINESS_CUSTOMER_FORM = 'admin/newBusinessCustomer';
const BusinessCustomerNewForm = compose(
  reduxForm({
    form: NEW_BUSINESS_CUSTOMER_FORM,
  }),
  withPreventingCheckHOC,
)(NewBusinessCustomerSubForm);

const renderBusinessCustomerNewForm = props => (
  <BusinessCustomerNewForm
    onSubmit={props.onHandleSubmit}
    isSaving={props.isSaving}
  />
);
renderBusinessCustomerNewForm.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const NEW_BUSINESS_CONTRACTOR_FORM = 'admin/newBusinessContractor';
const BusinessContractorNewForm = compose(
  reduxForm({
    form: NEW_BUSINESS_CONTRACTOR_FORM,
  }),
  withPreventingCheckHOC,
)(NewBusinessContractorSubForm);

const renderBusinessContractorNewForm = props => (
  <BusinessContractorNewForm
    onSubmit={props.onHandleSubmit}
    isSaving={props.isSaving}
  />
);
renderBusinessContractorNewForm.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const NEW_DRIVER_FORM = 'admin/newDriver';
const DriverNewForm = compose(
  reduxForm({
    form: NEW_DRIVER_FORM,
    touchOnChange: true,
    touchOnBlur: true,
  }),
  withPreventingCheckHOC,
)(NewDriverSubForm);

const renderDriverNewForm = props => (
  <DriverNewForm
    contractorList={props.contractorList}
    onSubmit={props.onHandleSubmit}
    getCustomersList={props.getCustomersList}
    isSaving={props.isSaving}
  />
);
renderDriverNewForm.propTypes = {
  contractorList: PropTypes.array.isRequired,
  onHandleSubmit: PropTypes.func.isRequired,
  getCustomersList: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const NEW_HANDEL_ADMIN_FORM = 'admin/newHandelAdmin';
const HandelAdminNewForm = compose(
  reduxForm({
    form: NEW_HANDEL_ADMIN_FORM,
  }),
  withPreventingCheckHOC,
)(NewHandelAdminSubForm);

const renderHandelAdminNewForm = props => (
  <HandelAdminNewForm
    onSubmit={props.onHandleSubmit}
    isSaving={props.isSaving}
  />
);
renderHandelAdminNewForm.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const NEW_COUNCIL_OFFICER_FORM = 'admin/newCouncilOfficer';
const CouncilOfficerNewForm = compose(
  reduxForm({
    form: NEW_COUNCIL_OFFICER_FORM,
  }),
  withPreventingCheckHOC,
)(NewCouncilOfficerSubForm);

const renderCouncilOfficerNewForm = props => {
  return (
    <CouncilOfficerNewForm
      onSubmit={props.onHandleSubmit}
      isSaving={props.isSaving}
      councilList={props.councilList}
    />
  );
}
renderCouncilOfficerNewForm.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  councilList: PropTypes.array,
};

const AddNewArray = {
  residential: {
    label: 'Residential Customer',
    render: renderResidentialCustomerNewForm,
    url: 'res-customers',
  },
  businessCustomer: {
    label: 'Business Customer',
    render: renderBusinessCustomerNewForm,
    url: 'bus-customers',
  },
  businessContractor: {
    label: 'Business Contractor',
    render: renderBusinessContractorNewForm,
    url: 'contractors',
  },
  driver: {
    label: 'Driver',
    render: renderDriverNewForm,
    url: 'drivers',
  },
  handelAdmin: {
    label: 'handel: Admin',
    render: renderHandelAdminNewForm,
    url: 'admins',
  },
  councilOfficer: {
    label: 'Council Officer',
    render: renderCouncilOfficerNewForm,
    url: 'council-officers',
  },
};

function getUserTypeByTabIdx(tabIdx) {
  const item = tabMapping.find(item => item.tabIndex === tabIdx);
  return item.userType;
}

function getTabIdxByUserType(userType) {
  const item = tabMapping.find(item => item.userType === userType);
  return item.tabIndex;
}

class AddAccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      nextUserType: "residential",
      modalContent: {
        styles: {
          modal: { top: 430 },
          title: {
            color: "#f06666",
          },
          buttonText: {
            color: "white",
            backgroundColor: "#f06666",
          },
        },
        title: "You're Losing Your Input",
        subTitle: "If you change the user type, you will lose the input.",
        buttonText: "Confirm",
        bottomTitle: "No, Stay here",
      },
      saveWithPayment: false
    };

    this.onHandleClose = this.onHandleClose.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onTabChangeConfirmed = this.onTabChangeConfirmed.bind(this);
  }

  componentDidMount(){
    const { fetchCouncilList } = this.props;
    fetchCouncilList();
  }

  onHandleClose() {
    this.setState({
      modalIsOpen: false,
    });
  }

  onTabChange(user) {
    const { isTouched, setTab } = this.props;
    if (!isTouched) {
      setTab(getTabIdxByUserType(user));
    } else {
      this.setState({
        nextUserType: user,
        modalIsOpen: true,
      });
    }
  }

  onTabChangeConfirmed() {
    const { nextUserType } = this.state;
    if (!nextUserType) {
      return;
    }
    this.props.setTab(getTabIdxByUserType(nextUserType));
    this.setState({ modalIsOpen: false });
  }

  handleSubmit(data) {
    const { onHandleSubmit, userType } = this.props;
    if (onHandleSubmit) {
      onHandleSubmit(data, AddNewArray[userType].url);
    }
  }

  render() {
    const { modalIsOpen, modalContent } = this.state;
    const {
      contractorList,
      getCustomersList,
      isSaving,
      userType,
      dataCustomer,
      handleSubmitWithPayment,
      councilList
    } = this.props;
    return (
      <div>
        <SimpleConfirmDlg
          modalIsOpen={modalIsOpen}
          styles={modalContent.styles}
          title={modalContent.title}
          subTitle={modalContent.subTitle}
          buttonText={modalContent.buttonText}
          bottomTitle={modalContent.bottomTitle}
          handleButtonClick={this.onTabChangeConfirmed}
          handleNoButtonClick={this.onHandleClose}
        >
          <span style={{ fontSize: 68, color: "#f06666" }}>
            <span className="handel-question" />
          </span>
        </SimpleConfirmDlg>
        <BackPreviousPage name="Add User" code="" />
        <UserTypeButtons
          userType={userType}
          handleSwitchUser={this.onTabChange}
        />
        <div>
          <SimpleCardLayout title={`Add New ${AddNewArray[userType].label}`}>
            {AddNewArray[userType].render({
              contractorList,
              onHandleSubmit: this.handleSubmit,
              getCustomersList,
              isSaving,
              dataCustomer,
              handleSubmitWithPayment,
              councilList,
            })}
          </SimpleCardLayout>
        </div>
      </div>
    );
  }
}

AddAccountForm.propTypes = {
  onHandleSubmit: PropTypes.func.isRequired,
  isTouched: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  contractorList: PropTypes.array.isRequired,
  getCustomersList: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
  setTab: PropTypes.func.isRequired,
};

AddAccountForm.defaultProps = {

};

export default compose(
  withRouter,
  connect(
    state => ({
      userType: getUserTypeByTabIdx(state.admin.accounts.customers.tab),
      councilList: state.admin.accounts.customers.councilList || [],
    }),
    dispatch => ({
      // change current tab
      setTab: tabIndex => dispatch(setTab(tabIndex)),
      fetchCouncilList: () => {
        const action = getCouncilList();
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(AddAccountForm);
