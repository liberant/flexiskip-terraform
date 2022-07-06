import React from 'react';
import PropTypes from 'prop-types';

// Antd
import { Button, Select } from 'antd';

// Constant
import { TYPE_PERCENTAGE, TYPE_FLAT, typeOptions as DiscountOptions } from '../../../common/constants/discount-types';

const ONE_OFF_DISCOUNT_TYPES = [TYPE_PERCENTAGE, TYPE_FLAT];
const oneOffDiscountOptions = DiscountOptions.filter(option =>
  ONE_OFF_DISCOUNT_TYPES.includes(option.value));


class CreateOneOffDiscount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitable: false,
    };
    this.type = '';
    this.amount = '';
  }
  onAmountChange = (e) => {
    this.amount = parseFloat(e.target.value);

    if (this.type && this.amount) {
      this.setState({
        isSubmitable: true,
      });
    }
  }
  onSelectType = (value) => {
    this.type = value;

    if (this.type && this.amount) {
      this.setState({
        isSubmitable: true,
      });
    }
  }
  render() {
    const { onSubmit, defaultDiscount } = this.props;
    const { isSubmitable } = this.state;
    return (
      <div className="w-form">
        <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label className="control-label">Discount</label>
          </div>
        </div>
        <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
            <div className="form-group">
              <label className="control-label" style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Type</label>
              <Select className="form-control" onSelect={this.onSelectType} defaultValue={defaultDiscount.type}>
                {oneOffDiscountOptions.map(item => (
                  <Select.Option value={item.value} key={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
            <div className="form-group">
              <label className="control-label" style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>Amount</label>
              <input className="form-control" type="number" onChange={this.onAmountChange} defaultValue={defaultDiscount.amount} />
            </div>
          </div>
        </div>
        <div className="row" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-5">
            <Button
              size="large"
              type="primary"
              loading={false}
              block
              disabled={!isSubmitable}
              onClick={() => onSubmit({ type: this.type, amount: this.amount })}
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

CreateOneOffDiscount.propTypes = {
  onSubmit: PropTypes.func,
  defaultDiscount: PropTypes.object,
};

CreateOneOffDiscount.defaultProps = {
  onSubmit: () => {},
  defaultDiscount: {},
};

export default CreateOneOffDiscount;
