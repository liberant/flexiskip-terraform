import React from 'react';
import { array, bool, func, number } from 'prop-types';
import { reduxForm } from 'redux-form';
import shortid from 'shortid';
// import { StripeProvider, Elements } from 'react-stripe-elements';

import { validateLoginData as validate } from '../helpers';
import SubmitButton from '../../../common/components/form/SubmitButton';

import RegisterLayout from '../../hoc/RegisterLayout';

import ItemHeader from './ItemHeader';
import ItemCounter from './ItemCounter';
import CommonStyles from './Styles';

/* eslint react/no-unescaped-entities: 0 */


const PageStyles = {
  submitButton: {
    width: '100%',
    backgroundColor: '#239DFF',
    fontWeight: '600',
    color: '#FFF',
    marginTop: 9,
    textShadow: 'none',
    height: 52,
  },
  AddNewButton: {
    width: '100%',
    backgroundColor: '#FFF',
    fontWeight: '600',
    color: '#239DFF',
    textShadow: 'none',
    border: '1px solid #239DFF',
    height: 52,
    marginBottom: 181,
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

class FormVehiclesList extends React.Component {
  constructor(props) {
    super(props);

    this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this);
  }

  handleDeleteVehicle(e, index) {
    const { handleDeleteVehicle } = this.props;

    handleDeleteVehicle(index);
  }

  render() {
    const {
      handleBack, handleSubmit, handleGoAddNewVehicle,
      submitting,
      page, vehicles,
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
          <div style={CommonStyles.mainArea}>
            <div style={{
              textAlign: 'center',
              fontSize: 28,
              marginBottom: 20,
              color: '#666666',
            }}
            >
              Vehicles
            </div>

            {
              vehicles.length > 0 && (
                <div>
                  <div style={{ fontSize: 16, marginBottom: 30 }}>
                    {
                      vehicles.map((v, index) => (
                        <div key={shortid.generate()}>
                          {
                            (index > 0) ? <hr /> : null
                          }
                          <div style={{ color: '#239DFF', fontWeight: '600' }}>
                            <span style={{ fontSize: 18 }}><span className="handel-truck" /></span>
                            <span style={{ paddingLeft: 10 }}>{`${v.model}`}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <span style={{ paddingLeft: 24 }}>{`${v.class}`}</span>
                            </div>
                            <div onClick={e => this.handleDeleteVehicle(e, index)}>
                              <span style={{ color: '#EF1212', cursor: 'pointer', fontSize: 18 }}>
                                {/* <i className="fa fa-trash-o" /> */}
                                <span className="handel-bin" />
                              </span>
                            </div>
                          </div>
                          <div>
                            <span style={{ paddingLeft: 24 }}>{`${v.regNo}`}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  <div className="text-center">
                    <SubmitButton
                      type="submit"
                      className="btn btn-default submit"
                      submitting={submitting}
                      submitLabel="Processing..."
                      style={PageStyles.submitButton}
                    >
                      COMPLETE REGISTRATION
                    </SubmitButton>
                  </div>
                  <div className="text-center">
                    <SubmitButton
                      type="button"
                      className="btn btn-default submit"
                      submitLabel="Processing..."
                      style={PageStyles.AddNewButton}
                      onClick={handleGoAddNewVehicle}
                    >
                      ADD MORE VEHICLES
                    </SubmitButton>
                  </div>

                </div>
              )
            }
            {
              vehicles.length < 1 && (
                <div>
                  <div style={{ ...PageStyles.subTitle, fontSize: 80, opacity: '0.5' }}>
                    {/* <span><i className="fa fa-user-times" /></span> */}
                    <span className="handel-truck-no" />
                  </div>
                  <div style={{ textAlign: 'center', color: '#239DFF', opacity: '0.5' }}>
                    <span style={{
                      display: 'inline-block',
                      width: 238,
                      fontSize: 16,
                      marginBottom: 81,
                    }}
                    >
                     There are currently no Vehicles connected to your account.
                    </span>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    color: '#666666',
                    fontWeight: '600',
                    width: 376,
                    fontSize: 16,
                    marginBottom: 30,
                    }}
                  >
                    <span>
                      You must add at least one Vehicle to complete your registration process.
                    </span>
                  </div>
                  <div className="text-center">
                    <SubmitButton
                      type="button"
                      className="btn btn-default submit"
                      submitting={submitting}
                      submitLabel="Processing..."
                      style={{ ...PageStyles.submitButton, marginBottom: 181 }}
                      onClick={handleGoAddNewVehicle}
                    >
                      ADD MORE VEHICLES
                    </SubmitButton>
                  </div>
                </div>
              )
            }


          </div>
        </div>
      </form>
    );
  }
}

FormVehiclesList.propTypes = {
  handleSubmit: func.isRequired,
  handleBack: func.isRequired,
  handleGoAddNewVehicle: func.isRequired,
  handleDeleteVehicle: func.isRequired,
  submitting: bool.isRequired,
  page: number.isRequired,
  vehicles: array.isRequired,
};

FormVehiclesList.defaultProps = {

};


export default RegisterLayout(reduxForm({
  form: 'contractorRegister',
  enableReinitialize: false,
  destroyOnUnmount: false,
  validate,
})(FormVehiclesList));
