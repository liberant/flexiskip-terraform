import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import {
  renderValueFieldDropdownList,
  required,
} from '../../../common/components/form/reduxFormComponents';

import { Styles } from './Styles';

const renderStaticImage2Rows = ({ value, label, style }) => (
  <div>
    <div className="form-group">
      <label className="control-label col-sm-12" htmlFor={label}>
        {label}
      </label>
      <div className="col-sm-12">
        <img
          src={value || ''}
          alt="Avatar"
          style={{
            maxWidth: 330,
            maxHeight: 230,
            ...style,
          }}
        />
      </div>
    </div>
  </div>
);
renderStaticImage2Rows.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.any,
};

renderStaticImage2Rows.defaultProps = {
  value: '',
  label: '',
  style: {},
};

const renderStaticText2Rows = ({
  value, label, showArray, showDollar,
}) => {
  let content = value || '';

  if (showArray) {
    if (value && (value.constructor === Array)) {
      content = '';
      value.forEach((v) => {
        if (content !== '') {
          content += ', ';
        }
        content += v;
      });
    }
  }

  if (showDollar) {
    content = `$ ${content}`;
  }

  return (
    <div>
      <div className="form-group row" style={{ marginLeft: 0 }} >
        <label className="control-label col-sm-12" htmlFor={label}>
          {label}
        </label>
        <div className="col-sm-12">
          <div className="form-control-static">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

renderStaticText2Rows.propTypes = {
  value: PropTypes.any,
  label: PropTypes.string,
  showArray: PropTypes.bool,
  showDollar: PropTypes.bool,
};

renderStaticText2Rows.defaultProps = {
  value: '',
  label: '',
  showArray: false,
  showDollar: false,
};

class CouncilLocationSubForm extends React.Component {
  render() {
    const {
      council, councils, isEdit, isAdd,
    } = this.props;

    return (
      <div>
        {
          !isAdd ? (
            <div className="row">
              <div className="col-xs-12">
                {
                  renderStaticText2Rows({
                    value: (council && council.val) ? council.val.code : '',
                    label: 'Council ID',
                  })
                }
              </div>
            </div>
          ) : null
        }
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10">
            {
              isEdit ? (
                <Field
                  className="add-council-code-council-name-box"
                  name="council"
                  label="Council Name"
                  dropdownLabel="Choose A Council"
                  valueFieldName="_id"
                  textFieldName="name"
                  data={councils}
                  style={
                    isEdit ? { ...Styles } : {}
                  }
                  component={
                    isEdit ? renderValueFieldDropdownList : renderStaticText2Rows
                  }
                  placeholder=""
                  required
                  validate={[required]}
                />
              ) : renderStaticText2Rows({
                  value: council && council.val ? council.val.name : '',
                  label: 'Council Name',
              })
            }

          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            {
              renderStaticText2Rows({
                value: (council && council.val) ? council.val.region : '',
                label: 'Region',
              })
            }
          </div>
          <div className="col-xs-6">
            {
              renderStaticText2Rows({
                value: (council && council.val) ? council.val.state : '',
                label: 'State',
              })
            }
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            {
              renderStaticText2Rows({
                value: (council && council.val) ? council.val.postCodes : '',
                label: 'Post Codes',
                showArray: true,
              })
            }
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            {
              renderStaticText2Rows({
                value: (council && council.val) ? council.val.surcharge : '',
                label: 'Surcharge',
                showDollar: true,
              })
            }
          </div>
        </div>
        <div className="row" style={{ minHeight: 200 }}>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
            {
              renderStaticImage2Rows({
                label: 'Branding',
                value: (council && council.val) ? council.val.branding : null,
                style: Styles.staticImage,
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

CouncilLocationSubForm.propTypes = {
  council: PropTypes.any.isRequired,
  councils: PropTypes.any.isRequired,
  isEdit: PropTypes.bool.isRequired,
  isAdd: PropTypes.bool,
};

CouncilLocationSubForm.defaultProps = {
  isAdd: true,
};

export default CouncilLocationSubForm;
