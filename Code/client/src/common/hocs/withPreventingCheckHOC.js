import React from 'react';
import { Prompt } from 'react-router-dom';


/* eslint react/prop-types: 0 */

/**
 * When user try to navigate other pages, popup a confirm.
 * if 'yes' then jump, else then stay.
 *
 * @param {*} WrapperedComponent
 */
const withPreventingCheckHOC =
  WrapperedComponent => class PreventingCheckHOC extends React.Component {
    render() {
      const { /* anyTouched, */ submitSucceeded, dirty, registerProcessingStatus } = this.props;
      const preventCondition = (dirty && !submitSucceeded) ||
        ((registerProcessingStatus !== undefined) && (registerProcessingStatus !== 'finished'));

      return (
        <div>
          <Prompt
            when={preventCondition}
            message={() => 'Are you sure you want to discard your input?'}
          />
          <WrapperedComponent {...this.props} />
        </div>
      );
    }
  };

export default withPreventingCheckHOC;
