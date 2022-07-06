import React, { PureComponent } from 'react';
import { Table, Pagination, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import {
  Field, isInvalid, isValid,
  getFormSyncErrors, getFormValues,
} from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  required,
  number,
  decimalAllowed,
} from '../../../../common/components/form/reduxFormComponents';
import { formatPrice } from '../../../../common/helpers';
import SelectField from '../../../../common/components/form/SelectField';
import InputField from '../../../../common/components/form/InputField';
import { withRequest } from '../../../../common/hocs';
import SpinnerWrapper from '../../../../common/components/SpinnerWrapper';
import SearchBox from '../../../../common/components/form/SearchBox';
import PageSelector from '../../../../common/components/form/PageSelector';

import './ProductPricing.css';

/* eslint react/sort-comp: 0 */
/* eslint no-param-reassign: 0 */

const pageSizes = [
  { label: '10 records', value: 10 },
  { label: '20 records', value: 20 },
  { label: '50 records', value: 50 },
  { label: '100 records', value: 100 },
];

class ProductPricing extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: '',
      pageSize: 10,
      sortedInfo: null,
    };
    this.removedItems = [];

    this.registerFields = {};
    this.firstInitialArray = true;

    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.getHeaderCellProps = this.getHeaderCellProps.bind(this);
    this.handleAddNewItemOnclick = this.handleAddNewItemOnclick.bind(this);
  }
  componentDidMount() {
    this.fetchProductPricing();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isEdit && this.props.prices && this.firstInitialArray) {
      this.reInitializeForm(this.props.prices);
      this.firstInitialArray = false;
    }

    if (prevProps.isEdit && !this.props.isEdit) {
      this.reInitializeForm(this.props.prices);
      this.firstInitialArray = true;
    }

    if (!prevProps.isEdit && this.props.isEdit) {
      this.reInitializeForm(this.reorderPrices());
    }
  }

  get columns() {
    const defaultColumns = [
      {
        title: 'Product Name',
        dataIndex: 'product',
        key: 'product',
        render: (text, record) => {
          const { isEdit } = this.props;
          if (isEdit) {
            return (
              <Field
                className="product-pricing__row-input"
                name={`productPricing[${record.index}].product`}
                component={SelectField}
                validate={[required]}
                options={this.getProductAvailable(text)}
              />
            );
          }
          return this.getProductNameById(text);
        },
      },
      {
        title: 'Product Code',
        dataIndex: 'code',
        key: 'code',
        render: (text, record) => {
          const { products = [], formValues, isEdit } = this.props;
          if (isEdit && formValues && formValues.productPricing) {
            const currentItem = formValues.productPricing[record.index];
            if (currentItem) {
              const renderItem = products.find(product => product.value === currentItem.product);
              return renderItem && renderItem.code;
            }
          }
          const product = products.find(product => product.value === record.product);
          return product && product.code;
        },
      },
      {
        title: 'Product Price',
        dataIndex: 'prodPrice',
        key: 'prodPrice',
        sorter: !this.props.isEdit,
        onHeaderCell: !this.props.isEdit ? this.getHeaderCellProps.bind(this) : undefined,
        render: (text, record) => {
          const { isEdit } = this.props;
          if (isEdit) {
            return (
              <Field
                className="product-pricing__row-input"
                name={`productPricing[${record.index}].prodPrice`}
                component={InputField}
                validate={[required, number]}
                normalize={decimalAllowed}
              />
            );
          }
          return formatPrice(text);
        },
      },
      {
        title: 'Base Collection Price',
        dataIndex: 'colPrice',
        key: 'colPrice',
        sorter: !this.props.isEdit,
        onHeaderCell: !this.props.isEdit ? this.getHeaderCellProps.bind(this) : undefined,
        render: (text, record) => {
          const { isEdit } = this.props;
          if (isEdit) {
            return (
              <Field
                className="product-pricing__row-input"
                name={`productPricing[${record.index}].colPrice`}
                component={InputField}
                validate={[required, number]}
                normalize={decimalAllowed}
              />
            );
          }
          return formatPrice(text);
        },
      },
    ];

    const { isEdit } = this.props;
    if (isEdit) {
      defaultColumns.push({
        title: '',
        key: 'remove',
        fixed: 'right',
        width: 30,
        render: (text, record) => (
          <Icon
            type="close-circle"
            style={{ fontSize: '16px', color: '#f06666' }}
            theme="filled"
            onClick={this.handleRemovePricingItem(record)}
          />
        ),
      });
    }
    return defaultColumns;
  }

  get newRowIndex() {
    return this.pricingData.length;
  }

  get isNewRowValid() {
    const { formValues } = this.props;
    if (formValues && formValues.productPricing) {
      const newRowDatas = formValues.productPricing.filter(price => price.isNew);
      if (newRowDatas && newRowDatas.length) {
        // if all field value of new row empty => true
        return newRowDatas
          .every(newRowData => Object.keys(newRowData).every(key => !Boolean(newRowData[key])));
      }
    }
    return true;
  }

  get isFormValid() {
    const { valid, invalid } = this.props;
    return valid && !invalid;
  }

  get pagination() {
    const { prices, formValues } = this.props;
    let totalRows = 0;
    if (formValues && formValues.productPricing) {
      totalRows = formValues.productPricing.length;
    } else if (prices) {
      totalRows = prices.length;
    }

    return {
      current: this.state.page,
      pageSize: this.state.pageSize,
      total: totalRows,
    };
  }

  get pricingData() {
    const { prices, isEdit, formValues } = this.props;

    const { search, sortedInfo } = this.state;
    let dataRows = [];
    if (isEdit) {
      if (formValues && formValues.productPricing) {
        dataRows = formValues.productPricing;
      }
    } else if (prices) {
      dataRows = prices;
    }

    if (sortedInfo && !isEdit) {
      dataRows.sort((prev, next) => {
        if (sortedInfo.direction === 'descend') {
          return next[sortedInfo.column] - prev[sortedInfo.column];
        }
        return prev[sortedInfo.column] - next[sortedInfo.column];
      });
      dataRows = this.reIndexing(dataRows);
    }

    /* eslint no-extra-boolean-cast: 0 */
    if (Boolean(search)) {
      const { products } = this.props;
      const searchLower = search.toLowerCase();
      const matchProducts = products.filter(product =>
        product.label.toLowerCase().includes(searchLower) ||
        product.code.toLowerCase().includes(searchLower));
      dataRows = dataRows.filter(data =>
        !!matchProducts.find(product => product.value === data.product) ||
        `${data.prodPrice}`.includes(searchLower) ||
        `${data.colPrice}`.includes(searchLower));
    }

    const start = (this.pagination.current - 1) * this.pagination.pageSize;
    const end = this.pagination.current * this.pagination.pageSize;

    return dataRows.slice(start, end);
  }

  getProductNameById(id) {
    const { products } = this.props;
    const productAvailable = products.find(product => product.value === id);
    return productAvailable ? productAvailable.label : '';
  }

  getProductAvailable(currentSelected) {
    const { products, formValues } = this.props;
    let productPricing = [];
    if (formValues && formValues.productPricing) {
      productPricing = [...formValues.productPricing];
    }
    const productAvailable = [];
    products.forEach((product) => {
      if (product.value === currentSelected) {
        productAvailable.push(product);
      } else {
        const productSelected = productPricing.find(price => price.product === product.value);
        if (!productSelected) {
          productAvailable.push(product);
        }
      }
    });
    return productAvailable;
  }

  getHeaderCellProps({ key }) {
    return {
      onMouseDown: () => {
        let { sortedInfo } = this.state;
        if (sortedInfo) {
          if (sortedInfo.column === key) {
            sortedInfo.direction = sortedInfo.direction === 'ascend' ? 'descend' : 'ascend';
          } else {
            sortedInfo = {
              column: key,
              direction: 'descend',
            };
          }
        } else {
          sortedInfo = {
            column: key,
            direction: 'descend',
          };
        }

        if (this.isFormValid) {
          this.columns.forEach((column) => {
            delete column.sortOrder;
            if (column.key === key) {
              column.sortOrder = sortedInfo.direction;
            }
          });
          this.setState({ sortedInfo: { ...sortedInfo } });
        }
      },
    };
  }

  fetchProductPricing() {
    const {
      fetchPrices, customer,
      fetchAllProducts,
    } = this.props;
    fetchAllProducts({
      url: 'admin/products?limit=999999',
    });
    fetchPrices({
      url: `admin/bus-customers/${customer._id}/prices`,
    });
  }

  handlePageSizeChange(pageSize) {
    if (this.isFormValid) {
      this.setState({ pageSize });
    }
  }

  handlePageChange(page) {
    if (this.isFormValid) {
      this.setState({ page });
    }
  }

  handleSearch(search) {
    // reset page
    if (this.isFormValid) {
      this.setState({ search, page: 1 });
    }
  }

  handleAddNewItemOnclick() {
    const {
      isEdit,
      formValues,
    } = this.props;
    // insert new empty row
    if (isEdit) {
      let productPricing = [];
      if (formValues && formValues.productPricing) {
        productPricing = [...formValues.productPricing];
      }

      const newItems = [];
      newItems.push({
        product: '',
        code: '',
        prodPrice: 0,
        colPrice: 0,
        isNew: true,
      });

      this.reInitializeForm([...newItems, ...productPricing]);
    }
  }

  handleRemovePricingItem(item) {
    return () => {
      const { formValues } = this.props;
      if (formValues && formValues.productPricing) {
        const productPricing = [...formValues.productPricing];
        const itemIndex = productPricing.findIndex(pp => pp.index === item.index);
        if (itemIndex !== -1) {
          productPricing.splice(itemIndex, 1).forEach((item) => {
            if (!item.isNew) {
              this.removedItems.push({
                ...item,
                isRemove: true,
              });
            }
          });
          this.reInitializeForm(productPricing, this.removedItems);
        }
      }
    };
  }

  reorderPrices() {
    const { sortedInfo } = this.state;
    const { prices, formValues } = this.props;
    let dataRows = [];

    if (formValues && formValues.productPricing) {
      dataRows = [...formValues.productPricing];
    }

    if (!dataRows.length) {
      dataRows = prices;
    }

    if (sortedInfo) {
      dataRows.sort((prev, next) => {
        if (sortedInfo.direction === 'descend') {
          return next[sortedInfo.column] - prev[sortedInfo.column];
        }
        return prev[sortedInfo.column] - next[sortedInfo.column];
      });
      dataRows = this.reIndexing(dataRows);
    }

    return dataRows;
  }

  reIndexing(arr, startIndex) {
    if (startIndex) {
      return arr.map((a, index) => ({ ...a, index: index + startIndex }));
    }
    return arr.map((a, index) => ({ ...a, index }));
  }

  async reInitializeForm(arr, removedItems) {
    const { change } = this.props;
    const arrIndex = this.reIndexing(arr);
    await change('productPricing', arrIndex);
    if (removedItems) {
      await change('productPricingRemoved', removedItems);
    }
  }

  render() {
    const { loading, isEdit } = this.props;
    const { search } = this.state;

    const { pagination } = this;
    pagination.total = Boolean(search) ? this.pricingData.length : this.pagination.total;

    return (
      <React.Fragment>
        <div className="w-panel w-form">
          <div className="w-title">
            <h2>Product Pricing</h2>
            {
              isEdit && (
                <div className="product-pricing__add-item-button">
                  <Button
                    type="primary"
                    onClick={this.handleAddNewItemOnclick}
                    disabled={!this.isFormValid}
                  >
                    Add Item
                  </Button>
                </div>
              )
            }
            <SearchBox onSearch={this.handleSearch} />
          </div>

          <SpinnerWrapper loading={loading || this.pricingData === null}>
            <Table
              rowSelection={this.rowSelection}
              className="row-clickable"
              dataSource={this.pricingData}
              columns={this.columns}
              loading={loading}
              rowKey="_id"
              pagination={false}
              onRow={this.getRowProps}
            />
          </SpinnerWrapper>
        </div>

        <div className="bottom-toolbar">
          <PageSelector
            pageSizes={pageSizes}
            value={this.pagination.pageSize}
            onChange={this.handlePageSizeChange}
          />
          <Pagination
            className="w-pagination"
            {...pagination}
            onChange={this.handlePageChange}
          />
        </div>
      </React.Fragment>
    );
  }
}

ProductPricing.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  customer: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  fetchPrices: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  valid: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  formErrors: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  initialize: PropTypes.func.isRequired,
  fetchAllProducts: PropTypes.func.isRequired,
};

export default compose(
  connect(state => ({
    valid: isValid('admin/customerBusiness')(state),
    invalid: isInvalid('admin/customerBusiness')(state),
    formErrors: getFormSyncErrors('admin/customerBusiness')(state),
    formValues: getFormValues('admin/customerBusiness')(state),
  })),
  withRequest({
    autoExecute: false,
    requestOptions: {
      method: 'get',
    },
    mapProps: ({ execute, loading, response }) => ({
      fetchPrices: execute,
      prices: ((response) => {
        if (response && response.data) {
          return response.data.map((da, index) => ({
            ...da,
            prodPrice: da.prodPrice || 0,
            colPrice: da.colPrice || 0,
            index,
          }));
        }
        return null;
      })(response),
      loading,
    }),
  }),
  withRequest({
    autoExecute: false,
    requestOptions: {
      method: 'get',
    },
    mapProps: ({ execute, response }) => ({
      fetchAllProducts: execute,
      // all product on database
      products: ((response) => {
        if (response && response.data) {
          return response.data.map(da => ({ value: da._id, label: da.name, code: da.code }));
        }
        return [];
      })(response),
    }),
  }),
)(ProductPricing);
