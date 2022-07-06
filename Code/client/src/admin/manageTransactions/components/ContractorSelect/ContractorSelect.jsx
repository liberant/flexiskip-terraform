import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

import styles from './ContractorSelect.m.css';

class ContractorSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleOnClickInput = this.handleOnClickInput.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  get displayValue() {
    const { options, value } = this.props;
    return (options.find(option => option.value === value) || {}).label;
  }
  setWrapperRef(el) {
    this.wrapperRef = el;
  }

  handleClickOutside(e) {
    e.preventDefault();
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.setState({ open: false });
    }
  }
  handleItemClick(option) {
    return (e) => {
      e.preventDefault();
      const { onChange } = this.props;
      this.setState({ open: false }, () => {
        if (onChange) {
          onChange(option);
        }
      });
    };
  }
  handleOnClickInput(e) {
    e.preventDefault();
    this.setState({
      open: !this.state.open,
    });
  }
  renderCaretDown() {
    return <i className="fa fa-caret-down" />;
  }
  renderCaretUp() {
    return <i className="fa fa-caret-up" />;
  }
  renderListItem() {
    const { options, renderItem, value } = this.props;
    if (renderItem) {
      return options.map(option => (
        <React.Fragment key={option.value}>
          {renderItem(option)}
        </React.Fragment>
      ));
    }
    return options.map(option => (
      <div
        key={option.value}
        className={styles.listItem}
        onClick={this.handleItemClick(option)}
      >
        {option.label} {option.value === value && (<span className={styles.listItemCheckIcon}><Icon type="check" /></span>)}
      </div>
    ));
  }
  render() {
    const { open } = this.state;
    const {
      prefixIcon, containerStyle, containerClassName,
    } = this.props;
    return (
      <div
        className={`${styles.container} ${containerClassName || ''}`}
        style={containerStyle}
        ref={this.setWrapperRef}
      >
        <div
          className={styles.input}
          onClick={this.handleOnClickInput}
        >
          {prefixIcon && (<div className={styles.inputPrefixIcon}>{prefixIcon}</div>)}
          <div className={styles.inputContent}>{this.displayValue}</div>
          <div className={styles.inputIndicatorIcon}>
            {
              !open ? this.renderCaretDown() : this.renderCaretUp()
            }
          </div>
        </div>

        {open && (
          <div className={styles.list}>
            {this.renderListItem()}
          </div>
        )}

      </div>
    );
  }
}

ContractorSelect.propTypes = {
  prefixIcon: PropTypes.any,
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  renderItem: PropTypes.func,
  containerStyle: PropTypes.object,
  containerClassName: PropTypes.string,
  onChange: PropTypes.func,
};

ContractorSelect.defaultProps = {
  prefixIcon: null,
  value: null,
  renderItem: null,
  containerStyle: {},
  containerClassName: null,
  onChange: null,
};

export default ContractorSelect;
