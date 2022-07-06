import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';

import { setTitle } from '../../../../common/actions';
import {
  createCouncil,
  getCouncilRegionDefinations,
  getCouncilStatesDefinations,
} from '../actions';
import { withPreventingCheckHOC } from '../../../../common/hocs';
import CouncilDetailsForm from '../components/CouncilDetailsForm';
import AdminLayout from '../../../hoc/AdminLayout';
// import { materialAllowances } from '../constants/discountDefs';
import SimpleConfirmDlg from '../../../../common/components/SimpleConfirmDlg';

/* eslint no-underscore-dangle: 0 */

const ADD_DISCOUNT_FORM = 'admin/addCouncilDetail';

const AddCouncilDetailsForm = compose(
  reduxForm({
    form: ADD_DISCOUNT_FORM,
  }),
  withPreventingCheckHOC,
)(CouncilDetailsForm);

const selector = formValueSelector(ADD_DISCOUNT_FORM);

class CouncilsManageAddPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: true,
      isEdit: true,
      // firstFetchFlag: true,
      modalIsOpen: false,
    };

    this.handleCouncilSubmit = this.handleCouncilSubmit.bind(this);
    this.handleSuccessCreate = this.handleSuccessCreate.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.reloadPage = this.reloadPage.bind(this);
  }


  componentDidMount() {
    const {
      setTitle,
      getCouncilRegionDefinations,
      regionList,
      getCouncilStatesDefinations,
      states,
    } = this.props;

    setTitle('');

    if (regionList.length < 1) {
      getCouncilRegionDefinations();
    }

    if (states.length < 1) {
      getCouncilStatesDefinations();
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.discountsListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  async handleCouncilSubmit(values) {
    if (!values) {
      return;
    }

    const {
      code,
      name,
      region,
      state,
      postCodes,
      branding,
      surcharge,
      status,
    } = values;

    const data = {
      code,
      name,
      state: state.name,
      region,
      postCodes,
      surcharge,
      status,
      branding: branding && branding.length > 0 ? branding[0] : '',
    };

    await this.props.createCouncil({ url: 'councils', data });
  }

  handleSuccessCreate() {
    // await delay(ALERT_DISPLAY_DURATION);
    this.openModal();
    // this.props.history.push('/admin/manage-discounts');
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.props.history.push('/admin/manage-councils');
  }

  reloadPage() {
    window.location.reload();
  }

  render() {
    const {
      modalIsOpen, isAdd, isEdit, status,
    } = this.state;
    const {
      region, regionList,
      state, postcodeList,
      states,
    } = this.props;

    const { dirty, submitSucceeded } = this.props.form;
    if (!dirty && submitSucceeded && !modalIsOpen) {
      this.handleSuccessCreate();
    }

    return (
      <div className="x_panel_">
        <SimpleConfirmDlg
          modalIsOpen={modalIsOpen}
          title="Council Created"
          bottomTitle="Add Another Council"
          handleButtonClick={this.closeModal}
        />
        <AddCouncilDetailsForm
          addFlag={isAdd}
          editFlag={isEdit}
          regions={regionList}
          region={region}
          state={state}
          states={states}
          status={status}
          postcodes={postcodeList}
          onSubmit={this.handleCouncilSubmit}
        />
      </div>
    );
  }
}

CouncilsManageAddPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  // discountsListLoaded: PropTypes.bool.isRequired,
  createCouncil: PropTypes.func.isRequired,
  history: PropTypes.any.isRequired,
  form: PropTypes.any.isRequired,
  regionList: PropTypes.array.isRequired,
  region: PropTypes.any.isRequired,
  state: PropTypes.any.isRequired,
  states: PropTypes.any.isRequired,
  postcodeList: PropTypes.any.isRequired,
  getCouncilRegionDefinations: PropTypes.func.isRequired,
  getCouncilStatesDefinations: PropTypes.func.isRequired,
};

CouncilsManageAddPage.defaultProps = {
};

export default compose(
  AdminLayout,

  connect(
    (state) => {
      const stateSelected = selector(state, 'state') || {
        name: 'QLD',
        description: 'Queensland',
        postCodes: [],
      };
      // const regionList = state.admin.councils.councils.regions || [];
      const states = state.admin.councils.councils.states || [];
      // let tmpRegionList = [];
      // if (regionList.length > 0) {
      //   tmpRegionList = regionList.filter(t => t.state === stateSelected.name);
      // }
      const regionSelected = selector(state, 'region') || '';
      let postcodeList = ['0000', '9999'];
      if (states.length > 0) {
        const tmpState = states.find(s => s.name === stateSelected.name);
        if (tmpState) {
          postcodeList = tmpState.postCodes;
        }
      }

      return ({
        form: state.form['admin/addCouncilDetail'] || {},
        state: stateSelected,
        region: regionSelected,
        regionList: state.admin.councils.councils.regions || [],
        postcodeList,
        states,
      });
    },
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      createCouncil: (data) => {
        const action = createCouncil(data);
        dispatch(action);
        return action.promise;
      },

      getCouncilRegionDefinations: (data) => {
        const action = getCouncilRegionDefinations(data);
        dispatch(action);
        return action.promise;
      },

      getCouncilStatesDefinations: (data) => {
        const action = getCouncilStatesDefinations(data);
        dispatch(action);
        return action.promise;
      },

    }),
  ),
)(CouncilsManageAddPage);
