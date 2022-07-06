/* global google */
import React from 'react';
import PropTypes from 'prop-types';
import ErrorList from './ErrorList';

function parseAddress(address) {
  let streetNumber;
  let streetAddress;
  let firstPart;
  let secondPart;
  // split address to two parts
  const matches = address.match(/^(\S+)\s(.*)/);
  if (!matches || matches.length < 2) {
    firstPart = address;
    secondPart = '';
  } else {
    [firstPart, secondPart] = matches.slice(1);
  }

  // if the first word of address is street number,
  // return street number and the rest of the address
  if (/\d/.test(firstPart)) {
    streetNumber = firstPart;
    streetAddress = secondPart;
  } else {
    streetNumber = '';
    streetAddress = `${firstPart} ${secondPart}`;
  }

  return {
    streetNumber,
    streetAddress,
  };
}


/**
 * Component for inputting address with auto complete
 * Only show suggestion for Australia address
 *
 */
class AddressInput extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    onSelectAddress: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.textInput = null;
    this.setTextInputRef = (element) => {
      this.textInput = element;
    };
    this.autocomplete = null;
  }

  componentDidMount() {
    const autocomplete = new google.maps.places.Autocomplete(this.textInput);
    autocomplete.setTypes(['address']);
    autocomplete.setComponentRestrictions({ country: ['au'] });
    autocomplete.addListener('place_changed', this.onPlaceSelected);
    this.autocomplete = autocomplete;
  }

  onPlaceSelected = () => {
    let address = '';
    const { autocomplete } = this;
    const place = autocomplete.getPlace();
    address = place.formatted_address;
    // get the current street number from typed address
    const { streetNumber: st1 } = parseAddress(this.props.value);
    const { streetNumber: st2, streetAddress } = parseAddress(address);
    const streetNumber = st1.length > st2.length ? st1 : st2;

    // combine the typed street number with google place address
    this.props.onChange(`${streetNumber} ${streetAddress}`);
    this.props.onSelectAddress(`${streetNumber} ${streetAddress}`);
  }

  render() {
    const { ...otherProps } = this.props;
    return (
      <input
        ref={this.setTextInputRef}
        className="form-control"
        {...otherProps}
      />
    );
  }
}

/**
 * Form group field for textarea
 * Used with Field component of redux-form
 */
const AddressField = (props) => {
  const {
    input,
    meta: { touched, error },
    label,
    viewOnly,
    required,
    onSelectAddress,
    ...otherProps
  } = props;
  const className = touched && error ? 'has-error' : '';
  const requireMark = <span style={{ color: '#a94442' }}>*</span>;
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="control-label">{label} {required ? requireMark : null}</label>}
      {viewOnly ? (<p className="form-control-static">{input.value}</p>) : (
        <AddressInput className="form-control"{...input} {...otherProps} onSelectAddress={onSelectAddress} meta={props.meta} />
      )}
      {touched && <ErrorList errors={error} />}
    </div>
  );
};

AddressField.propTypes = {
  label: PropTypes.string,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  viewOnly: PropTypes.bool,
  required: PropTypes.bool,
  onSelectAddress: PropTypes.func,
};

AddressField.defaultProps = {
  label: '',
  viewOnly: false,
  required: false,
  onSelectAddress: () => {},
};

export default AddressField;
