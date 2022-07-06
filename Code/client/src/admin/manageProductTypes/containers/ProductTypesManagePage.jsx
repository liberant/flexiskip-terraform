import React, { Component } from 'react';
import { any, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { setTitle } from '../../../common/actions';
import { withPermission } from '../../../common/hocs/PermissionRequired';
import {
  getWasteTypeList,
  updateWasteTypeImage,
} from '../actions';
import Spinner from '../../../common/components/Spinner';

import AdminLayout from '../../hoc/AdminLayout';

import WasteTypeList from '../components/WasteTypeList';

class ProductTypesManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstFetchFlag: true,
    };
  }

  componentDidMount() {
    const { setTitle, getWasteTypeList } = this.props;

    setTitle('');
    getWasteTypeList();
  }

  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.productsListLoaded && !this.state.firstFetchFlag) {
  //     return false;
  //   }

  //   return true;
  // }

  render() {
    const {
      wasteTypeListLoaded,
      wasteTypeList,
      getWasteTypeList, updateWasteTypeImage,
    } = this.props;
    const { firstFetchFlag } = this.state;

    if ((firstFetchFlag && !wasteTypeListLoaded) || (wasteTypeList.length < 1)) {
      return (
        <Spinner />
      );
    }

    return (
      <div className="x_panel_">
        <WasteTypeList
          data={wasteTypeList}
          updateImage={updateWasteTypeImage}
          getWasteTypeList={getWasteTypeList}
        />
      </div>
    );
  }
}

ProductTypesManagePage.propTypes = {
  wasteTypeListLoaded: bool,
  wasteTypeList: any,
  getWasteTypeList: func.isRequired,
  updateWasteTypeImage: func.isRequired,
  setTitle: func.isRequired,
};

ProductTypesManagePage.defaultProps = {
  wasteTypeListLoaded: false,
  wasteTypeList: [],
};

export default compose(
  AdminLayout,
  connect(
    state => ({
      wasteTypeListLoaded: state.common.requestFinished.wasteTypeList,
      wasteTypeList: state.admin.productTypes.productTypes.data || [],
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      getWasteTypeList: (data) => {
        const action = getWasteTypeList(data);
        dispatch(action);
        return action.promise;
      },

      updateWasteTypeImage: (data) => {
        const action = updateWasteTypeImage(data);
        dispatch(action);
        return action.promise;
      },

    }),
  ),
  withPermission('listProductType'),
)(ProductTypesManagePage);
