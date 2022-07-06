import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { any, bool, func, string } from 'prop-types';

import { ActionButton } from '../../../common/components';
import styles, { stylesDetails } from './Styles';

const BackPreviousPage = props => (
  <div style={{ display: 'flex' }}>
    <Link to="/contractor/profile" style={stylesDetails.backArrowBox}>
      <div style={stylesDetails.backBox}>
        <span className="handel-chevron-circle-left" />
      </div>
    </Link>
    <div>
      <div style={stylesDetails.backTitle}>
        {props.name}
      </div>
      <div style={stylesDetails.backText}>
        {props.code}
      </div>
    </div>
  </div>
);

BackPreviousPage.propTypes = {
  name: string.isRequired,
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
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 53,
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
              marginRight: 0,
            },
            titleStyles: { ...styles.buttonText, fontSize: 14 },
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
              marginRight: 0,
            },
            titleStyles: {
              fontSize: 14,
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


class HeaderAdminDetailsSubForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
  }

  handleCancel() {
    const { isDirty } = this.props;
    if (isDirty) {
      this.props.history.push('/contractor/dashboard');
    } else {
      this.props.handleToggleEdit();
    }
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
    const {
      isEdit, code, name,
    } = this.props;

    return (
      <div>
        <div className="back-previous-box col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <BackPreviousPage
            code={code}
            name={name}
          />
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
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

HeaderAdminDetailsSubForm.propTypes = {
  isEdit: bool.isRequired,
  isDirty: bool,
  code: string,
  name: string,
  history: any.isRequired,
  handleSave: func.isRequired,
  handleToggleEdit: func.isRequired,
};

HeaderAdminDetailsSubForm.defaultProps = {
  isDirty: false,
  code: '',
  name: '',
};

export default withRouter(HeaderAdminDetailsSubForm);
