import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import * as actions from '../actions';
import { bindActionCreators } from '../../../../common/helpers';
import { withPermission } from '../../../../common/hocs/PermissionRequired';
import AdminLayout from '../../../hoc/AdminLayout';
import BackButton from '../../../../common/components/BackButton';
import HandelButton from '../../../../common/components/HandelButton';
import CouncilProductForm from '../../components/CouncilProductForm';
import { getProductWastTypesList, getProductMaterialOptions, createProduct } from '../../../manageProducts/actions';

class AddCouncilProductPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    isSaving: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    this.props.getProductWastTypesList();
    this.props.getProductMaterialOptions();
  }

  handleSubmit = async (values) => {
    if (!values) {
      return;
    }

    const { materialsAllowances, match } = this.props;

    const {
      vendorCode,
      name,
      weight,
      price,
      postageSize,
      images,
      weightAllowance,
      quantity,
      wasteType,
      size,
      materialsAllowance,
      comment,
      busColPrice,
      businessPrice,
      resColPrice,
      residentialPrice,
    } = values;

    const { id } = match.params;

    const s = [];
    if (materialsAllowance && Array.isArray(materialsAllowance)) {
      materialsAllowance.map((m, i) => {
        if (m) {
          s.push(materialsAllowances[i]);
        }

        return true;
      });
    }

    const data = {
      vendorCode,
      name,
      weight,
      price,
      postageSize,
      images,
      weightAllowance,
      quantity,
      wasteType,
      size,
      comment,
      materialsAllowance: s,
      status: 'In Stock',
      busColPrice,
      businessPrice,
      resColPrice,
      residentialPrice,
    };

    try {
      await this.props.createProduct({
        url: 'products',
        data: {
          ...data,
          council: id,
        }
      });
    } catch (error) {
      throw new SubmissionError({
        ...error.errors,
        _error: error.message,
      });
    }
  }

  render() {
    const {
      isSaving,
      match,
      wasteTypes,
      materialsAllowances
    } = this.props;
    const { id } = match.params;
    const values = {
      isActive: true,
      postCodes: [],
    };

    return (
      <React.Fragment>
        <BackButton link={`/admin/councils/${id}/view`} label="Add Council Product" />
        <div className="top-toolbar text-right">
          <HandelButton
            label="Cancel Add"
            href={`/admin/councils/${id}/view`}
            borderColor="red"
            iconColor="red"
            shadowColor="red"
            bgColor="white"
          >
            <span className="handel-cross" />
          </HandelButton>
          <HandelButton
            label="Save"
            form="councilProductForm"
            htmlType="submit"
            iconColor="white"
            bgColor="blue"
            borderColor="blue"
            shadowColor="blue"
            loading={isSaving}
          >
            <span className="handel-floppy-disk" />
          </HandelButton>
        </div>
        <CouncilProductForm
          onSubmit={this.handleSubmit}
          initialValues={values}
          wasteTypes={wasteTypes.map(type => ({ label: type, value: type }))}
          materialsAllowances={materialsAllowances}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  AdminLayout,
  connect(
    state => ({
      isSaving: state.common.loading.addCouncil || false,
      wasteTypes: state.admin.products.products.wasteTypes || [],
      materialsAllowances: state.admin.products.products.materialsAllowances || [],
    }),
    dispatch => bindActionCreators({
      addCouncil: actions.addCouncil,
      getProductWastTypesList: getProductWastTypesList,
      getProductMaterialOptions: getProductMaterialOptions,
      createProduct: createProduct,
    }, dispatch),
  ),
  withPermission('viewCouncil'),
)(AddCouncilProductPage);
