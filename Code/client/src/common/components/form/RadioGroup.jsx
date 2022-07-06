import React from 'react';
import PropTypes from 'prop-types';
import ErrorList from './ErrorList';
import Radio from './Radio';

/**
 * Form group field for radio group
 * Used with Field component of redux-form
 */
class RadioGroup extends React.Component {
  onChangeValue = (value) => {
    this.props.onChangeSelection(value);
    this.props.input.onChange(value);
  };

  render() {
    const {
      input,
      meta: { touched, error },
      options,
      label,
      required,
      vertical,
    } = this.props;
    const hasError = touched && error;
    const className = touched && error ? 'has-error' : '';
    const requireMark = <span style={{ color: '#a94442' }}>*</span>;
    return (
      <div className={`form-group ${className}`}>
        {label && (
          <label className="control-label">
            {label} {required ? requireMark : null}
          </label>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: vertical ? 'column' : 'row',
          }}
        >
          {options.map(o => (
            <Radio
              key={o.value}
              label={o.title}
              value={o.value}
              checked={o.value === input.value}
              onChangeValue={this.onChangeValue}
            />
          ))}
        </div>

        {hasError && <ErrorList errors={error} />}
      </div>
    );
  }
}

RadioGroup.propTypes = {
  label: PropTypes.string,
  input: PropTypes.any.isRequired,
  meta: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  required: PropTypes.bool,
  vertical: PropTypes.bool,
  onChangeSelection: PropTypes.func,
};

RadioGroup.defaultProps = {
  label: '',
  required: false,
  vertical: false,
  onChangeSelection: () => {},
};

export default RadioGroup;
