import React from 'react';
import PropTypes from 'prop-types';

class Radio extends React.Component {
  handleOnClick = () => {
    this.props.onChangeValue(this.props.value);
  }

  _renderLabel = () => {
    if (typeof this.props.label !== 'string') {
      const LabelComponent = this.props.label;
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <span
            className={this.props.checked ? 'handel-check-circle-fulfill' : 'handel-radio-btn'}
            style={{ color: '#239dff' }}
          />
          &nbsp;<LabelComponent />
        </div>
      );
    }
    return (
      <label
        style={{ color: '#666', fontWeight: 'lighter', marginBottom: 0 }}
      >
        <span
          className={this.props.checked ? 'handel-check-circle-fulfill' : 'handel-radio-btn'}
          style={{ color: '#239dff' }}
        />
        &nbsp;{this.props.label}
      </label>
    );
  }

  render() {
    return (
      <div style={{ marginRight: 30 }} onClick={this.handleOnClick} >
        {this._renderLabel()}
      </div>
    );
  }
}

Radio.propTypes = {
  onChangeValue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.any.isRequired,
};

export default Radio;
