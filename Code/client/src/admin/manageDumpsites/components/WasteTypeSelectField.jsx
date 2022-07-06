import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { bindActionCreators } from '../../../common/helpers';
import Spinner from '../../../common/components/Spinner';
import SelectField from '../../../common/components/form/SelectField';
import * as actions from '../../manageProductTypes/actions';

/**
 * bootstrap form group component to be used with redux-form
 */
class WasteTypeSelectField extends React.Component {
  static propTypes = {
    fetchWasteTypes: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const { options, fetchWasteTypes } = this.props;
    if (options.length === 0) {
      fetchWasteTypes();
    }
  }

  filterOption(input, option) {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  render() {
    const {
      loading,
      options,
      ...otherProps
    } = this.props;
    if (loading) return <Spinner />;

    return (
      <SelectField
        filterOption={this.filterOption}
        options={options.map(o => ({ label: o.name, value: o.name }))}
        {...otherProps}
      />
    );
  }
}

export default connect(
  state => ({
    options: state.admin.productTypes.productTypes.data,
    loading: state.common.loading.wasteTypeList || false,
  }),
  dispatch => bindActionCreators({
    fetchWasteTypes: actions.getWasteTypeList,
  }, dispatch),
)(WasteTypeSelectField);
