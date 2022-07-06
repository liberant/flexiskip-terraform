import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { connect } from 'react-redux';

import ErrorList from '../../../common/components/form/ErrorList';

const { Option } = Select;

/**
 * bootstrap form group component to be used with redux-form
 */
class PostCodesSelectField extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    selectedState: PropTypes.string,
    states: PropTypes.arrayOf(PropTypes.object),
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    viewOnly: PropTypes.bool,
  }

  static defaultProps = {
    label: '',
    selectedState: null,
    states: [],
    viewOnly: false,
  }

  state = {
    postCodes: [],
    hint: 'Enter post code to search',
  }

  handleSearch = (value) => {
    const {
      selectedState,
      states,
    } = this.props;
    let postCodes;
    let hint;
    const stateModel = states.find(st => st.name === selectedState);
    if (value.length > 1) {
      postCodes = stateModel ? stateModel.postCodes.filter(pc => pc.indexOf(value) === 0) : [];
      hint = 'Not found';
    } else {
      postCodes = [];
      hint = 'Enter post code to search';
    }
    this.setState({ postCodes, hint });
  }

  render() {
    const {
      input,
      meta,
      label,
      viewOnly,
      selectedState,
      states,
      ...otherProps
    } = this.props;
    const { touched, error } = meta;
    const className = touched && error ? 'has-error' : '';
    const { value } = input;
    let displayText = '';
    if (viewOnly) {
      displayText = value.join(', ');
    }
    const { postCodes, hint } = this.state;
    return (
      <div className={`form-group ${className}`}>
        {label && <label className="control-label">{label}</label>}
        <div>
          {viewOnly ? (<p className="form-control-static">{displayText}</p>) : (
            <Select
              mode="multiple"
              className="form-control"
              onSearch={this.handleSearch}
              placeholder="Enter post code"
              notFoundContent={hint}
              {...input}
              {...otherProps}
            >
              {postCodes.map(pc => (<Option key={pc}>{pc}</Option>))}
            </Select>
          )}
        </div>
        {touched && <ErrorList errors={error} />}
      </div>
    );
  }
}

export default connect(state => ({
  states: state.admin.councils.list.states,
}))(PostCodesSelectField);
