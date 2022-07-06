import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { any, bool, func, string } from 'prop-types';

import ActionButton from '../../../common/components/ActionButton';
import styles, { stylesDetails } from './Styles';

const BackPreviousPage = props => (
  <div style={{ display: 'flex' }}>
    <Link to="/contractor/transactions" style={stylesDetails.backArrowBox}>
      <div style={stylesDetails.backBox}>
        <span>
          <i className="fa fa-angle-left" />
        </span>
      </div>
    </Link>
    <div>
      <div style={{
        ...stylesDetails.backText,
        fontSize: 20,
        lineHeight: '52px',
      }}
      >
        {props.code}
      </div>
    </div>
  </div>
);

BackPreviousPage.propTypes = {
  code: string.isRequired,
};

const ActionButtons = (props) => {
  const {
    editFlag,
    handleCancel,
    handleSave,
  } = props;
  const toggleShowStyle = editFlag ? styles.showMe : styles.hideMe;
  const saveBtnIconName = editFlag ? 'handel-floppy-disk' : 'handel-pencil';
  const saveBtnLabel = editFlag ? 'Save' : 'Edit';
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 20,
      marginLeft: 34,
    }}
    >
      <div />
      <div>
        <ActionButton
          title="Cancel Edit"
          spanName="handel-cross"
          stylesExtra={{
          boxStyles: {
            ...toggleShowStyle,
          },
          btnStyles: {
            border: '1px solid #f06666',
            color: '#f06666',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 8px 0 rgba(102, 102, 102, 0.3)',
          },
          titleStyles: { ...styles.buttonText },
        }}
          handleClick={handleCancel}
        />

        <ActionButton
          type="submit"
          title={saveBtnLabel}
          spanName={saveBtnIconName}
          stylesExtra={{
            btnStyles: {
              backgroundColor: '#239DFF',
              boxShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
            },
          }}
          handleClick={handleSave}
        />
      </div>

    </div>
  );
};

ActionButtons.propTypes = {
  editFlag: bool.isRequired,
  handleCancel: func.isRequired,
  handleSave: func.isRequired,

};


class HeaderRequestsSubForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
  }

  handleCancel() {
    const { isDirty } = this.props;

    if (isDirty) {
      this.props.history.push('/contractor/transactions');
    } else {
      this.props.handleToggleEdit();
    }
    // this.props.handleToggleEdit();
  }

  handleSave(e) {
    const { isEdit, handleSave, handleToggleEdit } = this.props;

    if (isEdit) {
      handleSave();
    } else {
      handleToggleEdit();
      e.preventDefault();
    }
  }

  handleToggleEdit() {
    this.props.handleToggleEdit();
  }

  render() {
    const { code, isEdit } = this.props;

    return (
      <div>
        <div className="back-previous-box col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <BackPreviousPage
            code={code}
          />
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" >
          <ActionButtons
            editFlag={isEdit}
            handleCancel={this.handleCancel}
            handleSave={this.handleSave}
            handleToggleEdit={this.handleToggleEdit}
          />
        </div>
      </div>
    );
  }
}

HeaderRequestsSubForm.propTypes = {
  code: any.isRequired,
  isEdit: bool.isRequired,
  isDirty: bool.isRequired,
  history: any.isRequired,
  handleSave: func.isRequired,
  handleToggleEdit: func.isRequired,
};

HeaderRequestsSubForm.defaultProps = {

};

export default withRouter(HeaderRequestsSubForm);
