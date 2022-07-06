import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import validate from 'validate.js';

import { formatPrice } from '../../../../common/helpers';
import SelectField from '../../../../common/components/form/SelectField';
import AddressField from '../../../../common/components/form/AddressField';
import statuses, { STATUS_ACCEPTED, STATUS_REQUESTED } from '../../../../common/constants/col-req-statuses';

import { notCollectedItems } from '../../helpers';
import InputField from '../../../../common/components/form/InputField';

class CollectionDetail extends Component {
  onDisposalAddressChange = (value) => {
    let valueString = Object.values(value).filter((v,index) => value.hasOwnProperty(index)).join('');
    const { dumpsites } = this.props;
    let dumpsite = dumpsites.find(d => d.address == valueString)
    if(dumpsite) {
      this.props.change('disposalSite', dumpsite.name)
      this.props.change('disposalLocation', dumpsite.location)
    }
  }

  render() {
    const { handleSubmit, collectionRequest, status, dumpsites, binUpdates } = this.props;
    this.props.change('binUpdates', binUpdates)

    const { items } = collectionRequest;

    const statusOptions = statuses.map((status) => {
      let disabled = true;
      if (collectionRequest.status === status) {
        disabled = false;
      }

      if (collectionRequest.status === STATUS_ACCEPTED
        && status === STATUS_REQUESTED) {
        disabled = false;
      }

      return {
        label: status,
        value: status,
        disabled,
      };
    });

    return (
      <form onSubmit={handleSubmit} id="editColReqForm">
        <div className="w-panel w-form">
          <div className="w-title">
            <h2>Collection Details</h2>
            <span style={{ fontSize: '18px' }}>Total <strong>{formatPrice(collectionRequest.total)}</strong></span>
          </div>
          <div className="row">
            <div className="col-md-4">
              <Field name="status" component={SelectField} label="Status" options={statusOptions} />
            </div>
          </div>
          <Field
            name="collectionAddress"
            component={AddressField}
            label="Collection Address"
            disabled={status !== 'Requested'}
          />
          <Field
            name="comment"
            label="Comment"
            component={InputField}
          />
          {
            notCollectedItems(items).length > 0 && (
              <Field
                name="disposalAddress"
                label="Drop-off Location"
                options={
                  dumpsites.map(dumpsite => ({
                    label: `${dumpsite.name} - ${dumpsite.address}`,
                    value: dumpsite.address,
                  }))
                }
                component={SelectField}
                onChange={this.onDisposalAddressChange}
                dumpsites={{val:dumpsites}}
              />
            )
          }
        </div>
      </form>
    );
  }
};

CollectionDetail.propTypes = {
  collectionRequest: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  status: PropTypes.string,
};

CollectionDetail.defaultProps = {
  status: '',
  dumpsites:[]
};

const selector = formValueSelector('updateCollectionRequest');

export default compose(
  connect((state) => {
    const status = selector(state, 'status');
    return {
      initialValues: state.admin.collectionRequests.view.item,
      status,
      updateBins :state.admin.collectionRequests
    };
  }),
  reduxForm({
    form: 'updateCollectionRequest',
    validate: (data) => {
      const constraints = {
        status: {
          presence: { allowEmpty: false },
        },
      };
      return validate(data, constraints, { format: 'grouped' }) || {};
    },
    enableReinitialize: true,
  }),
)(CollectionDetail);
