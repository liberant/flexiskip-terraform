import React from 'react';
import { Field, FormSection } from 'redux-form';
import PropTypes from 'prop-types';

import {
  required,
  renderStaticText2Rows,
  renderDropdwonList,
} from '../../../common/components/form/reduxFormComponents';

import { vehicleStatuses } from '../../../common/constants/styles';

const APP_BACKGROUND_COLOR = '#F6F6F6';

const Styles = {
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    borderWidth: 0,
  },
  inputBox: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderRadius: '5px',
  },
  sizePrefix: {
    fontSize: 16,
  },
  sizePostfix: {
    fontSize: 14,
  },
  textarea: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderRadius: '5px',
  },
  dropdownList: {
    width: '100%',
    height: 34,
    borderWidth: 0,
    backgroundColor: APP_BACKGROUND_COLOR,
  },
};


class VehicleDetailsSubForm extends React.Component {
  render() {
    const { isEdit } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <FormSection name="createdBy" >
              <Field
                name="fullname"
                label="Added By"
                component={renderStaticText2Rows}
              />
            </FormSection>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-8">
            <Field
              name="status"
              label="Status"
              dropdownLabel="Choose Status"
              data={vehicleStatuses}
              statusArrayName="vehicle"
              style={
                isEdit ? Styles.dropdownList : {}
              }
              component={
                isEdit ? renderDropdwonList :
                renderStaticText2Rows
              }
              required
              validate={[required]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <Field
              name="createdAt"
              label="Date Added"
              date
              component={renderStaticText2Rows}
            />
          </div>
          <div className="col-xs-6">
            <Field
              name="inactiveAt"
              label="Inactive Date"
              date
              component={renderStaticText2Rows}
            />
          </div>
        </div>

      </div>
    );
  }
}

VehicleDetailsSubForm.propTypes = {
  isEdit: PropTypes.bool,
};

VehicleDetailsSubForm.defaultProps = {
  isEdit: false,
};

export default VehicleDetailsSubForm;
