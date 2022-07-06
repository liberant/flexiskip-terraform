import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { bindActionCreators } from '../../../common/helpers';
import Spinner from '../../../common/components/Spinner';
import SelectField from '../../../common/components/form/SelectField';
import * as actions from '../list/actions';

/**
 * bootstrap form group component to be used with redux-form
 */
class StateSelectField extends React.Component {
  static propTypes = {
    fetchStates: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const { options, fetchStates } = this.props;
    if (options.length === 0) {
      fetchStates();
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
    options: state.admin.councils.list.states.map(item => ({ label: item.name, value: item.name })),
    loading: state.common.loading.fetchAllStates || false,
  }),
  dispatch => bindActionCreators({
    fetchStates: actions.getCouncilStatesDefinations,
  }, dispatch),
)(StateSelectField);
