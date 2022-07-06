import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';

import AdminLayout from '../../../hoc/AdminLayout';
import BackButton from '../../../../common/components/BackButton';
import HandelButton from '../../../../common/components/HandelButton';
import Spinner from '../../../../common/components/Spinner';
import PermissionRequired, { withPermission } from '../../../../common/hocs/PermissionRequired';
import ReportDetail from '../components/ReportDetail';
import ReportMessage from '../components/ReportMessage';
import ReportedUser from '../components/ReportedUser';
import ReportedBy from '../components/ReportedBy';
import ReportNotes from '../components/ReportNotes';
import ReportImages from '../components/ReportImages';
import AddNoteButton from '../components/AddNoteButton';
import { Button, Modal, notification, Checkbox } from 'antd';
import warningIcon from './../../../../public/images/warningIcon.png'
import './../../../manageAccounts/components/styles.css'
import './styles.css'
import httpClient from '../../../../common/http';

const styles = {
  h3: {
    margin: '0 0 15px 0'
  },
  spinnerIcon: {
    fontSize: '1em'
  }
}

notification.config({
  duration: 1,
});


const ChargeFutileSpinner = () => (
  <span className="spinner__icon">
    <i className="fa fa-circle-o-notch fa-spin fa-3x" style={styles.spinnerIcon} />
  </span>
);

const DisputeViewPage = (props) => {


  const { dispute, isLoading, match, fetchDisputeDetail } = props
  const [isUpdate, setIsUpdate] = useState(false)
  const [checked, setChecked] = useState(false)
  const { id } = match.params;
  const [isLoadingChargeFutile, setIsLoadingChargeFutile] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);


  const onChargeFutileFunc = async () => {
    setIsLoadingChargeFutile(true)
    try {
      await httpClient.get(`/admin/disputes/${id}/charge-futile?includePhotoEvidence=${checked}`)
      setIsLoadingChargeFutile(false)
      setIsModalVisible(false)
      setIsUpdate(true)
    } catch (error) {
      setIsLoadingChargeFutile(false)
      setIsModalVisible(false)
      notification.error({
        message: "Failed",
        description: error.response.data.message
      });
    }
  }



  useEffect(() => {
    fetchDisputeDetail(id);
  }, [isUpdate])

  useEffect(() => {
    setChecked(false);
  }, [isModalVisible])

    const { id: disputeId } = match.params;

    if (isLoading || dispute === null || dispute._id !== disputeId) return <Spinner />;

    return (
      <React.Fragment>
        {
          isModalVisible ? <Modal
          keyboard={false}
          title = {<img src={warningIcon}/>}
          maskClosable={false}
          centered={true}
          wrapClassName={`charge__futile__modal`}
          visible={isModalVisible}
          closable={false}
          footer={null}
         >
          <h3 className="text-center" style={styles.h3}>{`Are you sure?`}</h3>
          <p className="text-center">{`Do you want to charge futile this flexiskip?`}</p>
          <p style={{ textAlign: 'center', margin: '30px 0 0 0' }}>
              <Checkbox defaultChecked = {false} onChange={(e) => setChecked(e.target.checked)}>{`Include photo evidence in email notification`}</Checkbox>
          </p>
          <div className='btn__action'>
            <Button disabled={isLoadingChargeFutile ? true : false} onClick={() => setIsModalVisible(false)}>{`Cancel`}</Button>
            <Button disabled={isLoadingChargeFutile ? true : false} onClick={() => onChargeFutileFunc()}>{isLoadingChargeFutile ? <ChargeFutileSpinner /> : `Charge futile`}</Button>
          </div>
        </Modal> : null
        }

        <BackButton link="/admin/manage-disputes" label={dispute.collectionRequest.code} />
        <PermissionRequired permission="editDispute">
          <div className="row">
            <div className="col-md-6">
              <div className="top-toolbar">
                <AddNoteButton disputeId={disputeId} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="top-toolbar text-right">
                <div className="process__futile__fee" style={{display:'inline-block', textAlign: 'center'}}>
                  <Button
                    style={{ width: '52px', height: '52px', fontSize: '24px', margin: '0 0 10px 0', border: 'none', background: '#239dff'}}
                    type="primary"
                    shape="circle"
                    htmlType="button"
                    onClick={() => setIsModalVisible(true) }
                    disabled={dispute && dispute.hasGCProduct ? dispute.futileBinPaymentIntentId ? true : false : true}
                >
                  <span className="handel-card" />
                </Button>
                  <p>{`Process Futile Fee`}</p>
                </div>

                <HandelButton
                  label="Edit"
                  href={`/admin/disputes/${dispute._id}/edit`}
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
        <div className="row">
          <div className="col-md-6">
            <ReportDetail dispute={dispute} />
          </div>
          <div className="col-md-6">
            <ReportMessage dispute={dispute} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <ReportedUser dispute={dispute} />
          </div>
          <div className="col-md-6">
            <ReportedBy dispute={dispute} />
          </div>
        </div>
        <ReportImages dispute={dispute} />
        <ReportNotes disputeId={disputeId} />
      </React.Fragment>
    );
};

DisputeViewPage.propTypes = {
    match: PropTypes.object.isRequired,
    fetchDisputeDetail: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    dispute: PropTypes.object,
  }

DisputeViewPage.defaultProps = {
    dispute: null,
  }

export default compose(
  AdminLayout,
  connect(
    state => ({
      dispute: state.admin.manageDisputes.view.dispute,
      isLoading: state.common.loading.fetchDisputeDetail || false,
    }),
    dispatch => bindActionCreators({
      fetchDisputeDetail: actions.fetchDisputeDetail,
    }, dispatch),
  ),
  withPermission('viewDispute'),
)(DisputeViewPage);
