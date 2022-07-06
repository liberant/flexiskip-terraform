import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { delay } from 'redux-saga';

import { setTitle } from '../../../../common/actions';
import { ALERT_DISPLAY_DURATION } from '../../../../common/constants/params';

import {
  getCouncilDetailsById,
  updateCouncilDetails,
  deleteCouncilById,
  unmountClearCouncilDetails,
  getCouncilRegionDefinations,
  getCouncilStatesDefinations,
} from '../actions';

import { withPreventingCheckHOC } from '../../../../common/hocs';
import CouncilDetailsForm from '../components/CouncilDetailsForm';
import AdminLayout from '../../../hoc/AdminLayout';

// import { materialAllowances } from '../../constants/councilDefs';
import { Spinner } from '../../../../common/components';
import SimpleNewConfirmDlg from '../../../../common/components/SimpleNewConfirmDlg';

/* eslint no-restricted-globals: 0 */
/* eslint no-underscore-dangle: 0 */

const EDIT_DISCOUNT_FORM = 'admin/editCouncilDetail';

const EditCouncilDetailsForm = compose(
  reduxForm({
    form: EDIT_DISCOUNT_FORM,
    forceUnregisterOnUnmount: true,
    enableReinitialize: true,
  }),
  withPreventingCheckHOC,
)(CouncilDetailsForm);

const selector = formValueSelector(EDIT_DISCOUNT_FORM);

class CouncilsManageEditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      firstFetchFlag: true,
      councilId: this.props.match.params.id,
      status: this.props.council.status,

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

    this.handleCouncilSubmit = this.handleCouncilSubmit.bind(this);
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
      setTitle, getCouncilDetailsById,
      getCouncilRegionDefinations,
      regionList,
      getCouncilStatesDefinations,
      states,
    } = this.props;
    const { councilId } = this.state;

    setTitle('');
    getCouncilDetailsById({
      url: 'councils',
      uid: councilId,
    });
    if (regionList.length < 1) {
      getCouncilRegionDefinations();
    }
    if (states.length < 1) {
      getCouncilStatesDefinations();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.councilDetails && !this.state.firstFetchFlag) {
      return false;
    }

    return true;
  }

  componentWillUnmount() {
    this.props.unmountClearCouncilDetails();
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
      subTitle: 'By clicking DELETE, this council will be removed.',
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
    const { councilId, userType } = this.state;
    try {
      await this.props.deleteCouncilById({
        url: userType,
        uid: councilId,
      });

      const tmpModalContent = {
        title: 'Council Deleted',
        subTitle: 'The current council has been deleted',
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
        title: 'Council Deleted Failed',
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
    this.props.history.push('/admin/manage-councils');
  }

  onHandleCancelDeleteRequest() {
    this.setState({
      modalIsOpen: false,
    });
  }

  async handleCouncilSubmit(values) {
    if (!values) {
      return;
    }

    const {
      code,
      name,
      region,
      postCodes,
      branding,
      surcharge,
      state,
      status,
    } = values;

    let stateName = '';
    let regionName = '';

    if (typeof (region) === 'string') {
      regionName = region;
    } else {
      regionName = region.name;
    }

    if (typeof (state) === 'string') {
      stateName = state;
    } else {
      stateName = state.name;
    }

    let brandingUrl = '';
    if (branding) {
      if (branding.constructor === Array) {
        brandingUrl = branding.length > 0 ? branding[0] : '';
      } else {
        brandingUrl = branding;
      }
    }


    const { councilId } = this.state;
    const data = {
      code,
      name,
      state: stateName,
      region: regionName,
      postCodes,
      surcharge,
      branding: brandingUrl,
    };
    data.status = status ? 'Active' : 'Inactive';

    await this.props.updateCouncilDetails({
      url: 'councils',
      uid: councilId,
      data,
    });

    this.setState({
      isEdit: false,
      status,
    });

    if (this.props.council && this.props.council.status !== data.status) {
      this.props.council.status = data.status;
    }
  }

  async handleSuccesUpdate() {
    await delay(ALERT_DISPLAY_DURATION);
    this.props.history.push('/admin/manage-councils');
  }

  render() {
    const {
      councilDetails, council,
      region, regionList,
      state, postcodeList,
      states,
    } = this.props;
    const {
      firstFetchFlag, isEdit,
      modalIsOpen, modalContent, status,
    } = this.state;

    if ((firstFetchFlag && !councilDetails) || (JSON.stringify(council) === '{}')) {
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

        <EditCouncilDetailsForm
          addFlag={false}
          editFlag={isEdit}
          data={{ name: council.name || '', code: council.code || '', status }}
          initialValues={council}
          regions={regionList}
          region={region}
          state={state}
          states={states}
          postcodes={postcodeList}
          onSubmit={this.handleCouncilSubmit}
          handleDeletion={this.onHandleDeleteRequest}
          onToggleEdit={this.onHandleToggleEdit}
        />
      </div>
    );
  }
}

CouncilsManageEditPage.propTypes = {
  councilDetails: PropTypes.bool.isRequired,
  council: PropTypes.any.isRequired,

  match: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,

  setTitle: PropTypes.func.isRequired,
  getCouncilDetailsById: PropTypes.func.isRequired,
  updateCouncilDetails: PropTypes.func.isRequired,
  deleteCouncilById: PropTypes.func.isRequired,
  unmountClearCouncilDetails: PropTypes.func.isRequired,
  regionList: PropTypes.array.isRequired,
  region: PropTypes.any.isRequired,
  state: PropTypes.any.isRequired,
  states: PropTypes.any.isRequired,
  postcodeList: PropTypes.any.isRequired,
  getCouncilRegionDefinations: PropTypes.func.isRequired,
  getCouncilStatesDefinations: PropTypes.func.isRequired,
};

CouncilsManageEditPage.defaultProps = {
};

export default compose(
  AdminLayout,

  connect(
    (state) => {
      const { council } = state.admin.councils.councils;
      let stateSelected = {
        name: 'QLD',
        description: 'Queensland',
        postCodes: [],
      };
      if (selector(state, 'state')) {
        if (typeof (selector(state, 'state')) === 'string') {
          stateSelected = {
            name: selector(state, 'state'),
            description: '',
            postCodes: [],
          };
        } else {
          stateSelected = selector(state, 'state');
        }
      } else if (council) {
        stateSelected = {
          name: council.state,
          description: '',
          postCodes: council.postCodes,
        };
      }

      // let regionSelected = {
      //   dumpsiteCount: 0,
      //   name: '',
      //   postCodes: [],
      //   region: '',
      //   state: '',
      //   branding: '',
      // };
      // if (selector(state, 'region')) {
      //   if (typeof (selector(state, 'region')) === 'string') {
      //     regionSelected.name = selector(state, 'region');
      //     regionSelected.state = stateSelected.name;
      //   } else {
      //     regionSelected = selector(state, 'region');
      //   }
      // } else if (council) {
      //   regionSelected.name = council.name;
      //   regionSelected.state = council.state;
      //   regionSelected.region = council.region;
      // }

      // const regionList = state.admin.councils.councils.regions || [];
      const states = state.admin.councils.councils.states || [];

      // let tmpRegionList = [];
      // if (regionList.length > 0) {
      //   tmpRegionList = regionList.filter(t => t.state === stateSelected.name);
      // }

      let postcodeList = ['0000', '9999'];
      const postcodeSelected = selector(state, 'postCodes');
      if (states.length > 0) {
        const tmpState = states.find(s => s.name === stateSelected.name);
        if (tmpState) {
          if (postcodeSelected && postcodeSelected.length > 0) {
            postcodeList = tmpState.postCodes.filter(p => !(postcodeSelected.indexOf(p >> 0) >= 0));
          } else {
            postcodeList = tmpState.postCodes;
          }
        }
      }

      return ({
        councilDetails: state.common.requestFinished.councilDetails || false,
        council: council || {},
        form: state.form['admin/editCouncilDetail'] || {},
        state: stateSelected,
        region: selector(state, 'region') || {},
        regionList: state.admin.councils.councils.regions || [],
        postcodeList,
        states,
        status,
      });
    },
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getCouncilDetailsById: (data) => {
        const action = getCouncilDetailsById(data);
        dispatch(action);
        return action.promise;
      },

      updateCouncilDetails: (data) => {
        const action = updateCouncilDetails(data);
        dispatch(action);
        return action.promise;
      },

      deleteCouncilById: (data) => {
        const action = deleteCouncilById(data);
        dispatch(action);
        return action.promise;
      },

      unmountClearCouncilDetails: () => {
        const action = unmountClearCouncilDetails();
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
)(CouncilsManageEditPage);
