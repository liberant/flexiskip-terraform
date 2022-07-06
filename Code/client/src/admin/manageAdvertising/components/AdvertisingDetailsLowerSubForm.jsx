import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';


import {
  renderStaticText2Rows,
  renderInput,
  required,
} from '../../../common/components/form/reduxFormComponents';
import WysiwygEditorField from '../../../common/components/form/WysiwygEditorField';

import { formStyles } from './Styles';

/* eslint react/no-danger:0 */

const renderHtmlText = ({
  input, style, label, labelStyle = {},
}) => (
  <div>
    <div style={{ width: '100%', overflow: 'auto' }}>
      {/* <label className="control-label col-sm-12" htmlFor={label} style={labelStyle}>
        {required ? `${label} *` : `${label}`}
      </label> */}
      <div className="col-sm-12">
        <div
          className="form-control-static"
          style={style}
          dangerouslySetInnerHTML={{ __html: input.value }}
        />
      </div>
    </div>
  </div>
);

renderHtmlText.propTypes = {
  input: PropTypes.any.isRequired,
  style: PropTypes.any,
  labelStyle: PropTypes.any,
  label: PropTypes.string,
};

renderHtmlText.defaultProps = {
  style: {},
  labelStyle: {},
  label: '',
};


const renderAdvertisingTitle = ({
  input, style,
}) => (
  <div>
    <div style={{ width: '100%', overflow: 'auto' }}>
      <div className="col-sm-12">
        <div style={style}>
          {input.value}
        </div>
      </div>
    </div>
  </div>
);

class AdvertisingDetailsLowerSubForm extends React.Component {
  render() {
    const {
      isEdit,
    } = this.props;


    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div style={{ marginTop: '-10px' }}>
              <Field
                name="title"
                label="Title"
                component={
                  isEdit ? renderInput : renderAdvertisingTitle
                }
                style={
                  isEdit ? formStyles : {
                    fontWeight: '600',
                    fontSize: 20,
                    color: '#666666',
                    margin: '0 0 15px 0',
                  }
                }
                required
                validate={[required]}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div style={{ marginTop: '-10px' }}>
              <Field
                name="content"
                label="Details"
                html
                component={
                  isEdit ? WysiwygEditorField : renderHtmlText
                }
                style={
                  isEdit ? formStyles : {}
                }
                required
                validate={[required]}
              />
            </div>
          </div>
        </div>

      </div>
    );
  }
}

AdvertisingDetailsLowerSubForm.propTypes = {
  isEdit: PropTypes.bool,
  // isAdd: PropTypes.bool,
};

AdvertisingDetailsLowerSubForm.defaultProps = {
  isEdit: false,
  // isAdd: false,
};

export default AdvertisingDetailsLowerSubForm;
