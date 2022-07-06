import React from 'react';
import PropTypes from 'prop-types';
import ErrorList from './ErrorList';

/**
 * Form group field for checkbox
 * Used with Field component of redux-form
 */
class CheckboxField extends React.Component {
  onChange = (e) => {
    this.props.input.onChange(e.target.checked);
  }

  render() {
    const { input: { value }, meta: { touched, error }, label, ...otherProps } = this.props;
    const className = touched && error ? 'has-error' : '';
    return (
      <div className={className}>
        <div className="checkbox">
          <label>
            <input checked={value} onChange={this.onChange} type="checkbox" {...otherProps} /> {label}
          </label>
        </div>
        {touched && <ErrorList errors={error} />}
      </div>
    );
  }
}

CheckboxField.propTypes = {
  label: PropTypes.string,
  input: PropTypes.any.isRequired,
  meta: PropTypes.any.isRequired,
};

CheckboxField.defaultProps = {
  label: '',
};

export default CheckboxField;
