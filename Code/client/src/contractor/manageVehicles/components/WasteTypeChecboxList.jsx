import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { bindActionCreators } from '../../../common/helpers';
import { getProductWastTypesList } from '../../../admin/manageProducts/actions';
import Spinner from '../../../common/components/Spinner';
import CheckboxListField from '../../../common/components/form/CheckboxListField';

class WasteTypeCheckboxList extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    getProductWastTypesList: PropTypes.func.isRequired,
  }

  static defaulProps = {
    isLoading: true,
    items: [],
  }

  componentDidMount() {
    this.props.getProductWastTypesList();
  }

  render() {
    const { isLoading, items, ...otherProps } = this.props;
    const options = items.map(item => ({ label: item, value: item }));
    return isLoading ? <Spinner /> : <CheckboxListField options={options} {...otherProps} />;
  }
}

export default connect(
  state => ({
    items: state.admin.products.products.wasteTypes || [],
    isLoading: !state.common.requestFinished.wasttypesList,
  }),
  dispatch => bindActionCreators({ getProductWastTypesList }, dispatch),
)(WasteTypeCheckboxList);

