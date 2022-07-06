import React from 'react';
import { array, bool, func, number } from 'prop-types';
import { reduxForm } from 'redux-form';
import shortid from 'shortid';
// import { StripeProvider, Elements } from 'react-stripe-elements';

import { validateLoginData as validate } from '../helpers';
import SubmitButton from '../../../common/components/form/SubmitButton';
import { normalizePhoneNumber10 } from '../../../common/components/form/reduxFormComponents';

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
    marginBottom: 156,
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

class FormDriversList extends React.Component {
  constructor(props) {
    super(props);

    this.handleDeleteDriver = this.handleDeleteDriver.bind(this);
  }

  handleDeleteDriver(e, index) {
    const { handleDeleteDriver } = this.props;

    handleDeleteDriver(index);
  }

  render() {
    const {
      handleBack, handleSubmit, handleGoAddNewDriver,
      submitting,
      page, drivers,
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
              Drivers
            </div>

            {
              drivers.length > 0 && (
                <div>
                  <div style={{ fontSize: 16, marginBottom: 30 }}>
                    {
                      drivers.map((d, index) => (
                        <div key={shortid.generate()}>
                          {
                            (index > 0) ? <hr /> : null
                          }
                          <div style={{ color: '#239DFF', fontWeight: '600' }}>
                            {/* <span><i className="fa fa-user-o" /></span> */}
                            <span className="handel-user" />
                            <span style={{ paddingLeft: 10 }}>{`${d.firstname} ${d.lastname}`}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <span style={{ fontSize: 18 }}>
                                {/* <i className="fa fa-mobile" /> */}
                                <span className="handel-mobile" />
                              </span>
                              <span
                                style={{ paddingLeft: 10 }}
                              >
                                {normalizePhoneNumber10(d.phone)}
                              </span>
                            </div>
                            <div onClick={e => this.handleDeleteDriver(e, index)}>
                              <span style={{ color: '#EF1212', cursor: 'pointer', fontSize: 18 }}>
                                {/* <i className="fa fa-trash-o" /> */}
                                <span className="handel-bin" />
                              </span>
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: 18 }}>
                              {/* <i className="fa fa-envelope-o" /> */}
                              <span className="handel-document" />
                            </span>
                            <span style={{ paddingLeft: 10 }}>
                              Licence No.&nbsp;
                              {`${d.licence.licenceNo}`}
                            </span>
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
                      CONTINUE
                    </SubmitButton>
                  </div>
                  <div className="text-center">
                    <SubmitButton
                      type="button"
                      className="btn btn-default submit"
                      submitLabel="Processing..."
                      style={PageStyles.AddNewButton}
                      onClick={handleGoAddNewDriver}
                    >
                      ADD MORE DRIVERS
                    </SubmitButton>
                  </div>

                </div>
              )
            }
            {
              drivers.length < 1 && (
                <div>
                  <div style={{ ...PageStyles.subTitle, fontSize: 80, opacity: '0.5' }}>
                    {/* <span><i className="fa fa-user-times" /></span> */}
                    <span className="handel-user-no" />
                  </div>
                  <div style={{ textAlign: 'center', color: '#239DFF', opacity: '0.5' }}>
                    <span style={{
                      display: 'inline-block',
                      width: 238,
                      fontSize: 16,
                      marginBottom: 81,
                    }}
                    >
                    There are currently no Drivers connected to your account
                    </span>
                  </div>
                  <div className="text-center">
                    <SubmitButton
                      type="button"
                      className="btn btn-default submit"
                      submitting={submitting}
                      submitLabel="Processing..."
                      style={PageStyles.submitButton}
                      onClick={handleGoAddNewDriver}
                    >
                      ADD MORE DRIVERS
                    </SubmitButton>
                  </div>
                  <div className="text-center">
                    <SubmitButton
                      type="submit"
                      className="btn btn-default submit"
                      submitLabel="Processing..."
                      style={PageStyles.AddNewButton}
                    >
                      SKIP
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

FormDriversList.propTypes = {
  handleSubmit: func.isRequired,
  handleBack: func.isRequired,
  handleGoAddNewDriver: func.isRequired,
  handleDeleteDriver: func.isRequired,
  submitting: bool.isRequired,
  page: number.isRequired,
  drivers: array.isRequired,
};

FormDriversList.defaultProps = {

};


export default RegisterLayout(reduxForm({
  form: 'contractorRegister',
  enableReinitialize: false,
  destroyOnUnmount: false,
  validate,
})(FormDriversList));
