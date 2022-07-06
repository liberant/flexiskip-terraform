import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';

import AdminLayout from '../../../hoc/AdminLayout';
import BackButton from '../../../../common/components/BackButton';
import HandelButton from '../../../../common/components/HandelButton';
import Spinner from '../../../../common/components/Spinner';
import CouncilView from '../components/CouncilView';
import PermissionRequired, { withPermission } from '../../../../common/hocs/PermissionRequired';
import DeleteCouncilButton from '../../components/DeleteCouncilButton';
import DumpsiteList from '../components/DumpsiteList';

class CouncilViewPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchCouncilDetail: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    council: PropTypes.object,
  }

  static defaultProps = {
    council: null,
  }

  componentDidMount() {
    const {
      fetchCouncilDetail,
      match,
    } = this.props;
    const { id } = match.params;
    fetchCouncilDetail(id);
  }

  render() {
    const { council, isLoading, match } = this.props;
    const { id: councilId } = match.params;
    if (isLoading || council === null || council._id !== councilId) return <Spinner />;

    return (
      <React.Fragment>
        <BackButton link="/admin/manage-councils" label={council.name} />
        <PermissionRequired permission="editCouncil">
          <div className="row">
            <div className="col-md-6">
              <div className="top-toolbar">
                <DeleteCouncilButton council={council} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="top-toolbar text-right">
                <HandelButton
                  label="Add Product"
                  href={`/admin/councils/${council._id}/new-council-product`}
                  iconColor="white"
                  bgColor="blue"
                  borderColor="blue"
                  shadowColor="blue"
                >
                  <span className="handel-product" />
                </HandelButton>
                <HandelButton
                  label="Edit"
                  href={`/admin/councils/${council._id}/edit`}
                  borderColor="blue"
                  iconColor="white"
                  shadowColor="blue"
                  bgColor="blue"
                >
                  <span className="handel-pencil" />
                </HandelButton>
              </div>
            </div>
          </div>
        </PermissionRequired>
        <CouncilView initialValues={council} />
        <DumpsiteList councilId={council._id} />
      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      council: state.admin.councils.view.council,
      isLoading: state.common.loading.fetchCouncilDetail || false,
    }),
    dispatch => bindActionCreators({
      fetchCouncilDetail: actions.fetchCouncilDetail,
    }, dispatch),
  ),
  withPermission('viewCouncil'),
)(CouncilViewPage);
