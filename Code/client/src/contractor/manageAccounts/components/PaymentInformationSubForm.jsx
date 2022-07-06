import React from 'react';
import { Field } from 'redux-form';
import { string } from 'prop-types';

import { renderStaticText2Rows } from '../../../common/components/form/reduxFormComponents';

class PaymentInformationSubForm extends React.Component {
  render() {
    const { cardFieldName } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Field
              icon
              name={cardFieldName}
              label="Credit Card No."
              component={renderStaticText2Rows}
            >
              <span>
                <i className="fa fa-cc-visa" />
                - **** &nbsp; **** &nbsp; **** &nbsp;
              </span>
            </Field>
          </div>
        </div>
      </div>
    );
  }
}

PaymentInformationSubForm.propTypes = {
  cardFieldName: string,
};

PaymentInformationSubForm.defaultProps = {
  cardFieldName: 'payment.cardLast4Digits',
};

export default PaymentInformationSubForm;
