import React from "react";
import PropTypes from "prop-types";
import { AutoComplete } from "antd";
import ErrorList from "./ErrorList";

/**
 * Form group field for auto complete input
 * Used with Field component of redux-form
 */
const AutoCompleteInputAddress = (props) => {
  const {
    input,
    label,
    required,
    style,
    styleLabel,
    errorProductAddress,
    onChange,
    ...otherProps
  } = props;
  const className = errorProductAddress ? "has-error" : "";
  const requireMark = <span style={{ color: "#a94442" }}>*</span>;
  return (
    <div className={`form-group ${className}`} style={style}>
      {label && (
        <label className="control-label" style={styleLabel}>
          {label} {required ? requireMark : null}
        </label>
      )}
      <AutoComplete
        className="form-control"
        style={{ height: "40px" }}
        onChange={(e) => onChange(e)}
        {...otherProps}
      >
        <input className="form-control" autoComplete="nope" />
      </AutoComplete>
      {errorProductAddress && (
        <span className="text-danger">{errorProductAddress}</span>
      )}
    </div>
  );
};

AutoCompleteInputAddress.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  style: PropTypes.object,
  styleLabel: PropTypes.object,
};

AutoCompleteInputAddress.defaultProps = {
  label: "",
  required: false,
  style: {},
  styleLabel: {},
};

export default AutoCompleteInputAddress;

