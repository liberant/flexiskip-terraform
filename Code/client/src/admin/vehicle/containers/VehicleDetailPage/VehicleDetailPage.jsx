import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import queryString from 'query-string';

import AdminLayout from '../../../hoc/AdminLayout';
import { Spinner } from '../../../../common/components';

import * as actions from '../../actions';
import * as selectors from '../../selectors';
import { VEHICLE_DETAIL_FORM } from '../../constants';

import VehicleDetailForm from '../VehicleDetailForm/VehicleDetailForm';

import './VehicleDetailPage.css';

class VehicleDetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleEditOnclick = this.handleEditOnclick.bind(this);
    this.handleCancelOnClick = this.handleCancelOnClick.bind(this);
    this.handleSaveOnClick = this.handleSaveOnClick.bind(this);
  }

  componentDidMount() {
    const {
      match: {
        params: {
          id,
        },
      },
      getVehicleDetail,
      toggleEditMode,
      location: {
        search,
      },
    } = this.props;
    const searchValues = queryString.parse(search);

    if (searchValues.edit) {
      toggleEditMode();
    }

    getVehicleDetail(id);
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: {
          id,
        },
      },
      getVehicleDetail,
      editMode,
      toggleEditMode,
    } = this.props;

    if (id !== prevProps.match.params.id) {
      getVehicleDetail(id);

      if (editMode) {
        toggleEditMode();
      }
    }
  }

  componentWillUnmount() {
    const { resetData } = this.props;
    resetData();
  }

  handleCancelOnClick() {
    const { toggleEditMode, reset } = this.props;
    reset(VEHICLE_DETAIL_FORM);
    toggleEditMode();
  }

  handleEditOnclick() {
    const { toggleEditMode } = this.props;
    toggleEditMode();
  }

  handleSaveOnClick() {
    const {
      match: {
        params: {
          id,
        },
      },
      submitVehicleDetail,
    } = this.props;
    submitVehicleDetail(id);
  }

  render() {
    const {
      vehicle, editMode, isRequesting, contractorList,
    } = this.props;
    return (
      <div className="x_panel_ vehicle-detail-container">
        {
          isRequesting ? <Spinner /> : (
            <VehicleDetailForm
              initialValues={vehicle}
              editMode={editMode}
              handleSaveOnClick={this.handleSaveOnClick}
              handleCancelOnClick={this.handleCancelOnClick}
              handleEditOnclick={this.handleEditOnclick}
              vehicle={vehicle}
              contractorList={contractorList}
            />
          )
        }
      </div>
    );
  }
}

VehicleDetailPage.propTypes = {
  getVehicleDetail: PropTypes.func.isRequired,
  toggleEditMode: PropTypes.func.isRequired,

  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  vehicle: PropTypes.object,

  editMode: PropTypes.bool.isRequired,
  isRequesting: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  submitVehicleDetail: PropTypes.func.isRequired,

  location: PropTypes.object.isRequired,
  contractorList: PropTypes.array.isRequired,
};

VehicleDetailPage.defaultProps = {
  vehicle: null,
};

const mapStateToProps = state => ({
  vehicle: selectors.selectVehicleDetail(state),
  isRequesting: selectors.selectVehicleDetailRequesting(state),
  error: selectors.selectVehicleDetailError(state),
  editMode: selectors.selectViewMode(state),
  contractorList: selectors.selectContractorList(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...actions,
    reset,
  }, dispatch),
});

export default compose(
  AdminLayout,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(VehicleDetailPage);
