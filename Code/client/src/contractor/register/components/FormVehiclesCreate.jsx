import React from 'react';
import { bool, func, number } from 'prop-types';
import { Field, reduxForm } from 'redux-form';
// import { StripeProvider, Elements } from 'react-stripe-elements';

import { validateLoginData as validate } from '../helpers';
import SubmitButton from '../../../common/components/form/SubmitButton';
import {
  renderInput,
  required,
  number as numberValidate,
  numberNormalize,
  renderDropdwonList,
} from '../../../common/components/form/reduxFormComponents';
import RegisterLayout from '../../hoc/RegisterLayout';

import ItemHeader from './ItemHeader';
import ItemCounter from './ItemCounter';

/* eslint react/no-unescaped-entities: 0 */
const VehicleClasses = [
  'Class LR', 'Class MR', 'Class HR', 'Class HC', 'Class MC',
];
const VehicleModels = [
  'Type 1', 'Type 2', 'Type 3', 'Type 4',
];

const APP_BACKGROUND_COLOR = '#F6F6F6';

const Styles = {
  outerBox: {
    paddingLeft: 0,
  },
  input: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
    borderWidth: 0,
  },
  inputBox: {
    backgroundColor: '#F6F6F6',
    borderRadius: '5px',
    height: 52,
    paddingTop: 7,
  },
  sizePrefix: {
    fontSize: 20,
    color: '#239DFF',
  },
  sizePostfix: {
    fontSize: 14,
  },
  label: {
    display: 'none',
  },
  error: {
    fontSize: 14,
  },
  dropdownList: {
    width: '100%',
    height: 52,
    borderWidth: 0,
    backgroundColor: APP_BACKGROUND_COLOR,
    dropdownOuter: {
      marginLeft: 0,
    },
  },
  dropdownListIcon: {
    listBox: {
      width: '100%',
      height: 52,
      borderRadius: '5px',
      backgroundColor: APP_BACKGROUND_COLOR,
    },
    icon: {
      fontSize: 16,
      lineHeight: '52px',
    },
    select: {
      width: '94%',
      backgroundColor: APP_BACKGROUND_COLOR,
      border: '1px solid #F6F6F6',
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
    },
    width: '94%',
    backgroundColor: APP_BACKGROUND_COLOR,
    border: '1px solid #F6F6F6',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    dropdownOuter: {
      marginLeft: 0,
    },
  },
};


const PageStyles = {
  submitButton: {
    width: '100%',
    backgroundColor: '#239DFF',
    fontWeight: '600',
    color: '#FFF',
    marginTop: 22,
    textShadow: 'none',
    height: 52,
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#239DFF',
    marginBottom: 10,
  },
  cardErrorHint: {
    color: 'red',
  },
};

class FormVehiclesCreate extends React.Component {
  render() {
    const {
      handleBack, handleSubmit, handleCloseAddVehicle,
      submitting,
      page,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <ItemHeader
          handleBack={handleBack}
        />
        <div className="login_wrapper">
          <ItemCounter
            page={page}
          />
          <div style={{
            background: '#E9F5FF',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            lineHeight: '50px',
            width: 800,
            margin: 'auto',
            }}
          >
            <div onClick={handleCloseAddVehicle} style={{ cursor: 'pointer', display: 'inline-block', marginLeft: 20 }}>
              <span style={{ ...Styles.sizePrefix, fontSize: 20 }}>
                <i className="fa fa-remove" />
              </span>
              <span style={{
                color: '#239DFF',
                fontSize: 16,
                display: 'inline-block',
                marginLeft: 5,
                }}
              >
                Close
              </span>
            </div>
            <div style={{ display: 'inline-block', marginLeft: '33%', fontSize: 28 }}>
              <span>Add Vehicle</span>
            </div>
          </div>
          <div style={{
              padding: '50px 200px 60px',
              background: 'white',
              width: 800,
              margin: 'auto',
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
            }}
          >

            <div style={{ textAlign: 'center', fontSize: 18, marginBottom: 20 }}>
              Vehicle Details
            </div>
            <div>
              <Field
                name="vehicle.class"
                label=""
                style={Styles.dropdownList}
                dropdownLabel="Vehicle Class"
                data={VehicleClasses}
                component={renderDropdwonList}
                placeholder="Vehicle Class"
                required
                validate={[required]}
              />
              <Field
                name="vehicle.regNo"
                label=""
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Vehicle Rego No."
                normalize={numberNormalize}
                required
                validate={[required, numberValidate]}
              />
              <Field
                name="vehicle.model"
                label=""
                icon
                style={Styles.dropdownListIcon}
                dropdownLabel="Vehicle Model"
                data={VehicleModels}
                component={renderDropdwonList}
                placeholder="Vehicle Model"
                required
                validate={[required]}
              >
                <span style={{ ...Styles.sizePrefix, fontSize: 16 }}>
                  <span className="handel-truck" />
                </span>
              </Field>
              <Field
                name="vehicle.compliance"
                label=""
                style={{ display: 'none', ...Styles }}
                component={renderInput}
                placeholder="Compliance Details"
                required
                validate={[required]}
              />
            </div>

            <div className="text-center">
              <SubmitButton
                type="submit"
                className="btn btn-default submit"
                submitting={submitting}
                submitLabel="Adding..."
                style={PageStyles.submitButton}
              >
                ADD VEHICLE
              </SubmitButton>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

FormVehiclesCreate.propTypes = {
  handleSubmit: func.isRequired,
  handleBack: func.isRequired,
  handleCloseAddVehicle: func.isRequired,
  submitting: bool.isRequired,
  page: number.isRequired,
};

FormVehiclesCreate.defaultProps = {

};


export default RegisterLayout(reduxForm({
  form: 'contractorRegister',
  enableReinitialize: false,
  destroyOnUnmount: false,
  validate,
})(FormVehiclesCreate));
