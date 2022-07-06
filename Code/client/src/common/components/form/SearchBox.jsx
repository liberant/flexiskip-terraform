import React from 'react';
import PropTypes from 'prop-types';

class SearchBox extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    defaultValue: PropTypes.string,
    style: PropTypes.object,
    startLength: PropTypes.number,
  }

  static defaultProps = {
    defaultValue: '',
    style: {},
    startLength: 0,
  }

  onChange = (e) => {
    const { value } = e.target;
    if (value.length && value.length < this.props.startLength) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.props.onSearch(value), 1000);
  }

  handleKeyPress = (e) => {
    if (e.charCode === 13 || e.key === 'Enter') {
      const { value } = e.target;
      this.props.onSearch(value);
      e.preventDefault();
    }
  }

  render() {
    const { defaultValue, style } = this.props;
    return (
      <div className="search-box" style={style}>
        <input
          defaultValue={defaultValue}
          placeholder="Search"
          onChange={this.onChange}
          onKeyPress={this.handleKeyPress.bind(this)}
        />
        <span className="handel-magnifier" />
      </div>
    );
  }
}

export default SearchBox;
