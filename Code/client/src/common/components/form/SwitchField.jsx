import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import ErrorList from './ErrorList';

/**
 * Form group field for checkbox
 * Used with Field component of redux-form
 */
class SwitchField extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    input: PropTypes.any.isRequired,
    meta: PropTypes.any.isRequired,
    viewOnly: PropTypes.bool,
  }

  static defaultProps = {
    label: '',
    viewOnly: false,
  }

  render() {
    const {
      input: { value }, meta: { touched, error },
      label, viewOnly,
    } = this.props;
    const className = touched && error ? 'has-error' : '';
    return (
      <div className={`form-group ${className}`}>
        {label && <label className="control-label">{label}</label>}
        <div>
          <Switch checked={value} onChange={this.props.input.onChange} disabled={viewOnly} />
        </div>
        {touched && <ErrorList errors={error} />}
      </div>
    );
  }
}

export default SwitchField;
