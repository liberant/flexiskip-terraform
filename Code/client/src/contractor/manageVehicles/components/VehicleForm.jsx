import React from 'react';
import { withRouter } from 'react-router-dom';
import { any, bool, func } from 'prop-types';

import { SimpleCardLayout } from '../../../common/components';

import HeaderSubForm from './HeaderSubForm';
import VehicleDetailsSubForm from './VehicleDetailsSubForm';
import VehicleInformationSubForm from './VehicleInformationSubForm';


class VehicleForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleToggleEdit = this.handleToggleEdit.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
  }

  handleSave() {
    this.props.handleSubmit();
  }

  handleToggleEdit() {
    this.props.onToggleEdit();
  }

  handleDeletion() {
    this.props.onDelete();
  }

  render() {
    const {
      data, isEdit, handleSubmit,
      dirty, onDelete, onSuspend,
    } = this.props;
    const name = (data && data.model) ? `${data.model}` : '';
    const code = (data && data.code) ? data.code : '';

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <HeaderSubForm
              code={code}
              vehicle={data}
              name={name}
              isEdit={isEdit}
              isDirty={dirty}
              handleSave={this.handleSave}
              handleToggleEdit={this.handleToggleEdit}
              handleDeletion={onDelete}
              handleSuspend={onSuspend}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Vehicle Details">
              <VehicleDetailsSubForm
                isEdit={isEdit}
              />
            </SimpleCardLayout>

          </div>
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <SimpleCardLayout title="Vehicle Information">
              <VehicleInformationSubForm
                isEdit={isEdit}
              />
            </SimpleCardLayout>
          </div>
        </div>
      </form>
    );
  }
}

VehicleForm.propTypes = {
  data: any.isRequired,
  isEdit: bool.isRequired,
  dirty: bool,
  handleSubmit: func.isRequired,
  onToggleEdit: func.isRequired,
  onDelete: func.isRequired,
  onSuspend: func.isRequired,
};

VehicleForm.defaultProps = {
  dirty: false,
};

export default withRouter(VehicleForm);
