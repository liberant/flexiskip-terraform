import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import { func, bool } from 'prop-types';


import CouncilOfficerDetailsSubForm from './CouncilOfficerDetailsSubForm';
import SimpleSaveButtons from './SimpleSaveButtons';

const NewCouncilOfficerSubForm = (props) => {
  const {
    handleSubmit,
    isSaving,
    councilList,
  } = props;

  const Styles = {
    reminderIcon: {
      fontSize: '5em',
      color: 'rgb(243, 92, 93)',
      marginBottom: '20px',
      marginTop: '55px',
      display: 'block',
    },
    reminderText: {
      display: 'block',
      fontSize: '2em',
      fontWeight: 'bold',
      lineHeight: '1',
      letterSpacing: '-1px',
      color: 'rgb(243, 92, 93)',
    },
  };

  return (
    <div>
      <form>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <CouncilOfficerDetailsSubForm
              councilList={councilList}
              isEdit
              isAdd
             />
          </div>
        </div>

        <div className="row">
          <SimpleSaveButtons
            handleSubmit={handleSubmit}
            isSaving={isSaving}
          />
        </div>
      </form>
    </div>
  );
}

NewCouncilOfficerSubForm.propTypes = {
  handleSubmit: func.isRequired,
  isSaving: bool.isRequired,
};

NewCouncilOfficerSubForm.defaultProps = {
  councilList: []
};

export default NewCouncilOfficerSubForm;
