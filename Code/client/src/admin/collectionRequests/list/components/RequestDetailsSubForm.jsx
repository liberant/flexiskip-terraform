import React from 'react';
import { Field } from 'redux-form';
import { bool } from 'prop-types';

import {
  renderStaticText2Rows,
  renderDropdwonList,
  required,
} from '../../../common/components/form/reduxFormComponents';
// import styles from './Styles';

import { statusProductRequestTypes, statusProductRequestTypesStyles } from '../../../common/constants/styles';

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
  track: {
    display: 'inline-block',
    width: 69,
    height: 34,
    borderRadius: 3,
    backgroundColor: '#239dff',
    lineHeight: '34px',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 32,
    marginLeft: 10,
    textAlign: 'center',
    color: '#FFFFFF',
    cursor: 'pointer',
    boxShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
  },
  status: {
    width: 98,
    height: 18,
    borderRadius: 3,
    textAlign: 'center',
    border: '1px solid #ff9a00',
  },
};

/* eslint react/prop-types:0 */
const renderDynamicText2Rows = ({
  input, label, style, initialValue, required,
}) => {
  const content = input.value || initialValue;
  if (!input.value && initialValue) {
    input.onChange(initialValue);
  }

  const index = statusProductRequestTypes.findIndex(s => s === content);
  let color = '#4a4a4a';

  if ((index >= 0) && (index < statusProductRequestTypes.length)) {
    color = statusProductRequestTypesStyles[index];
  }


  return (label ? (
    <div>
      <div className="form-group">
        <label className="control-label col-sm-12" htmlFor={label}>
          {required ? `${label} *` : `${label}`}
        </label>
        <div className="col-sm-12">
          <p
            className="form-control-static"
            style={{
            ...style,
            color,
            borderColor: color,
          }}
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <span style={style}>{input.value || initialValue}</span>
  ));
};

class RequestDetailsSubForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleTrack = this.handleTrack.bind(this);
  }

  handleTrack() {

  }

  render() {
    const { isEdit } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
            <Field
              name="status"
              label="Status"
              dropdownLabel="Choose Status"
              data={statusProductRequestTypes}
              style={
                isEdit ? Styles.dropdownList :
                {
                  ...Styles.status,
                  // borderColor: this.handleStatusColor(status)
                }
              }
              component={
                isEdit ? renderDropdwonList :
                  renderDynamicText2Rows
              }
              required
              validate={[required]}
            />
          </div>
        </div>
        <div className="row" >
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4">
            <Field
              name="createdAt"
              label="Order Date"
              datetime
              component={renderStaticText2Rows}
            />
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4">
            <Field
              name="total"
              label="Total Price"
              icon
              component={renderStaticText2Rows}
            >
              <span>$</span>
            </Field>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4">
            <Field
              name="trackNo"
              label="Tracking No."
              component={renderStaticText2Rows}
            />
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4">
            <div>
              <span
                style={Styles.track}
                onClick={this.handleTrack}
              >
                Track
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
            <Field
              name="comment"
              label="Comment"
              component={renderStaticText2Rows}
            />
          </div>
        </div>

      </div>
    );
  }
}

RequestDetailsSubForm.propTypes = {
  isEdit: bool,
};

RequestDetailsSubForm.defaultProps = {
  isEdit: false,
};

export default RequestDetailsSubForm;
