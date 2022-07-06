import React from 'react';
import PropTypes from 'prop-types';
import { Select } from './SelectField';

/**
 * Page size relector
 */
class PageSelector extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    pageSizes: PropTypes.array.isRequired,
    value: PropTypes.number.isRequired,
  }

  render() {
    const { pageSizes, value, onChange } = this.props;
    return (
      <form className="form-inline">
        <div className="form-group">
          <label>Show</label>&nbsp;
          <Select options={pageSizes} value={value} onChange={onChange} />
        </div>
      </form>
    );
  }
}

export default PageSelector;
