import React from 'react';
import PropTypes from 'prop-types';
import { Steps } from 'antd';

import CollectionRequestStatus from '../../../../common/components/CollectionRequestStatus';
import { formatDateTime } from '../../../../common/helpers';

const { Step } = Steps;

const StatusHistory = ({ collectionRequest }) => {
  let statuses = [
    { status: 'Requested' },
    { status: 'Accepted' },
    { status: 'In Progress' },
    { status: 'Completed' },
  ];
  statuses = statuses.map((sr) => {
    const item = collectionRequest.statusHistory.find(his => his.status === sr.status);
    return {
      ...sr,
      time: item ? formatDateTime(item.createdAt) : '',
    };
  });
  const stepIndex = statuses.findIndex(item => item.status === collectionRequest.status);
  const currentStep = stepIndex > -1 ? stepIndex : 0;
  return (
    <Steps progressDot current={currentStep} className="status-steps">
      {statuses.map(item => (
        <Step
          title={<CollectionRequestStatus value={item.status} />}
          description={item.time}
          key={item.status}
        />
      ))}
    </Steps>
  );
};

StatusHistory.propTypes = {
  collectionRequest: PropTypes.object.isRequired,
};

export default StatusHistory;
