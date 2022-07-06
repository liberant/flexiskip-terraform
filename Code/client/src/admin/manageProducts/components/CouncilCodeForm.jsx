import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import AddCouncilCodeDlg from './AddCouncilCodeDlg';

/* eslint no-unused-expressions: 0 */

class CouncilCodeForm extends Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);

    this.handleCloseDlg = this.handleCloseDlg.bind(this);
  }

  handleCloseDlg() {
    const { handleCloseDlg } = this.props;

    if (handleCloseDlg) {
      handleCloseDlg();
    }
  }

  handleSave() {
    const { handleSubmit } = this.props;

    if (handleSubmit) {
      handleSubmit();
    }
  }

  render() {
    const {
      dlgIsOpen, product, councils, council,
    } = this.props;

    return (
      <form onSubmit={this.handleSave}>
        <AddCouncilCodeDlg
          product={product}
          council={council}
          councils={councils}
          dlgIsOpen={dlgIsOpen}
          handleCloseDlg={this.handleCloseDlg}
          handleSave={this.handleSave}
        />
      </form>
    );
  }
}

CouncilCodeForm.propTypes = {
  dlgIsOpen: PropTypes.bool,
  product: PropTypes.any.isRequired,
  council: PropTypes.any,
  councils: PropTypes.any.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCloseDlg: PropTypes.func.isRequired,
};

CouncilCodeForm.defaultProps = {
  dlgIsOpen: false,
  council: {},
};

export default withRouter(CouncilCodeForm);
