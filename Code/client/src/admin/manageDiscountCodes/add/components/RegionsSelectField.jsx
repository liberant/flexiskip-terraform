import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { bindActionCreators } from '../../../../common/helpers';
import * as actions from '../../../manageCouncils/list/actions';
import Spinner from '../../../../common/components/Spinner';
import SelectField from '../../../../common/components/form/SelectField';

/**
 * bootstrap form group component to be used with redux-form
 */
class RegionsSelectField extends React.Component {
  static propTypes = {
    fetchRegions: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const { options, fetchRegions } = this.props;
    if (options.length === 0) {
      fetchRegions();
    }
  }

  filterOption(input, option) {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  render() {
    const {
      loading,
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
    options: state.admin.councils.list.councilOptions,
    loading: state.common.loading.fetchAllCouncils || false,
  }),
  dispatch => bindActionCreators({
    fetchRegions: actions.fetchAllCouncils,
  }, dispatch),
)(RegionsSelectField);
