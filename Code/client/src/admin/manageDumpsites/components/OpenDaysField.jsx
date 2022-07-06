/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import SelectField from '../../../common/components/form/SelectField';
import CheckboxField from '../../../common/components/form/CheckboxField';
import { timeSet } from '../../../common/constants/commonTypes';
import { weekdayMap } from '../constants/enum';

const timeOptions = timeSet.map(t => ({ label: t.text, value: t.value }));

/**
 * bootstrap form group component to be used with redux-form
 */
class OpenDaysField extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string,
    viewOnly: PropTypes.bool,
  }

  static defaultProps = {
    viewOnly: false,
    label: '',
  }

  handleAdd = () => {
    this.props.fields.push({});
  }

  renderDateInput(fieldName, index, fields, { viewOnly, label, ...otherProps }) {
    const weekDay = weekdayMap[index];
    const { isOpen, fromTime, toTime } = fields.get(index);

    if (viewOnly) {
      return (
        <div className="row" key={index}>
          <div className="col-md-3">{weekDay}</div>
          <div className="col-md-9">{isOpen ? `${fromTime} - ${toTime}` : 'Closed'}</div>
        </div>
      );
    }

    return (
      <div key={index} className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label className="control-label">{weekDay}</label>
            <Field
              name={`${fieldName}.isOpen`}
              label="Open"
              component={CheckboxField}
              {...otherProps}
            />
          </div>
        </div>
        <div className="col-md-4">
          {isOpen ?
            <Field
              name={`${fieldName}.fromTime`}
              label="From"
              component={SelectField}
              options={timeOptions}
              {...otherProps}
            /> : (
              <div className="form-group">
                <label className="control-label">From</label>
                <p className="form-control-static">-- : --</p>
              </div>
            )
          }
        </div>
        <div className="col-md-4">
          {isOpen ?
            <Field
              name={`${fieldName}.toTime`}
              label="To"
              component={SelectField}
              options={timeOptions}
              {...otherProps}
            /> : (
              <div className="form-group">
                <label className="control-label">To</label>
                <p className="form-control-static">-- : --</p>
              </div>
            )
          }
        </div>
      </div>
    );
  }

  render() {
    const {
      fields,
      meta: { error, submitFailed },
      label,
    } = this.props;
    const className = submitFailed && error ? 'has-error' : '';
    return (
      <div className={`form-group ${className}`}>
        <label className="control-label">{label}</label>
        {fields.map((fieldName, index) =>
          this.renderDateInput(fieldName, index, fields, this.props))}
        {submitFailed && error && <span className="help-block">{error}</span>}
      </div>
    );
  }
}

export default OpenDaysField;
