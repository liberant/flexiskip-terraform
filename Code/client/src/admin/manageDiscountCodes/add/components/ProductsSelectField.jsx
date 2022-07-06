import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { bindActionCreators } from '../../../../common/helpers';
import * as actions from '../../../manageProducts/actions';
import Spinner from '../../../../common/components/Spinner';
import SelectField from '../../../../common/components/form/SelectField';

/**
 * bootstrap form group component to be used with redux-form
 */
class ProductsSelectField extends React.Component {
  static propTypes = {
    fetchProducts: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
    multiple: PropTypes.bool,
  }

  static defaultProps = {
    multiple: false,
  }

  componentDidMount() {
    const { options, fetchProducts } = this.props;
    if (options.length === 0) {
      fetchProducts();
    }
  }

  filterOption(input, option) {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  render() {
    const {
      loading,
      multiple,
      ...otherProps
    } = this.props;
    if (loading) return <Spinner />;

    return (
      <SelectField
        multiple
        filterOption={this.filterOption}
        {...otherProps}
      />
    );
  }
}

export default connect(
  state => ({
    options: state.admin.products.products.productOptions,
    loading: state.common.loading.fetchAllProducts || false,
  }),
  dispatch => bindActionCreators({
    fetchProducts: actions.fetchAllProducts,
  }, dispatch),
)(ProductsSelectField);
