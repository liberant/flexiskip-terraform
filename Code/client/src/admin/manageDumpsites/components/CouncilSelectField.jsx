import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { bindActionCreators } from '../../../common/helpers';
import Spinner from '../../../common/components/Spinner';
import SelectField from '../../../common/components/form/SelectField';
import * as actions from '../../manageCouncils/list/actions';

/**
 * bootstrap form group component to be used with redux-form
 */
class CouncilSelectField extends React.Component {
  static propTypes = {
    fetchCouncils: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const { options, fetchCouncils } = this.props;
    if (options.length === 0) {
      fetchCouncils();
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
    fetchCouncils: actions.fetchAllCouncils,
  }, dispatch),
)(CouncilSelectField);
