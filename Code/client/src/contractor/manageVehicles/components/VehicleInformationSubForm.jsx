import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import { renderStaticText2Rows, renderInput, renderDropdwonList } from '../../../common/components/form/reduxFormComponents';
import { formStyles } from './Styles';
import WasteTypeChecboxList from './WasteTypeChecboxList';
import WasteTypeList from './WasteTypeList';

const VEHICLE_CLASSES = [
  {
    value: 'Class LR',
    label: 'Class LR',
  },
  {
    value: 'Class MR',
    label: 'Class MR',
  },
  {
    value: 'Class HR',
    label: 'Class HR',
  },
  {
    value: 'Class HC',
    label: 'Class HC',
  },
  {
    value: 'Class MC',
    label: 'Class MC',
  },
];

const APP_BACKGROUND_COLOR = '#F6F6F6';

const dropdownList = {
  width: '100%',
  height: 52,
  borderWidth: 0,
  backgroundColor: APP_BACKGROUND_COLOR,
};

class VehicleInformationSubForm extends React.Component {
  render() {
    const { isEdit } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <Field
              name="class"
              style={
                isEdit ? dropdownList : {}
              }
              component={isEdit ? renderDropdwonList : renderStaticText2Rows}
              data={VEHICLE_CLASSES.map(cls => cls.value)}
              placeholder="Choose Class"
              label="Vehicle Class"
            />
          </div>
          <div className="col-xs-6">
            <Field
              name="model"
              label="Vehicle Model"
              style={
                isEdit ? formStyles : {}
              }
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <Field
              name="regNo"
              label="Rego No."
              style={
                isEdit ? formStyles : {}
              }
              component={
                isEdit ? renderInput : renderStaticText2Rows
              }
            />
          </div>
        </div>
        <div style={{ marginLeft: '10px' }}>
          {isEdit ?
            <Field name="wasteTypes" component={WasteTypeChecboxList} label="Product Types" />
            : <Field name="wasteTypes" component={WasteTypeList} label="Product Types" />
          }
        </div>
      </div>
    );
  }
}

VehicleInformationSubForm.propTypes = {
  isEdit: PropTypes.bool,
};

VehicleInformationSubForm.defaultProps = {
  isEdit: false,
};

export default VehicleInformationSubForm;
