import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { InnerDivider, ActionButton } from '../../../common/components';

const stylesAction = {
  display: 'flex',
  lineHeight: '60px',
};

class SimpleSaveButtons extends React.Component {
  render() {
    const { handleSubmit, history } = this.props;

    return (
      <div>
        <InnerDivider />
        <div style={{ marginLeft: 20, display: 'flex', justifyContent: 'center' }}>
          <div style={stylesAction}>
            <ActionButton
              title="Cancel"
              spanName="handel-cross"
              stylesExtra={{
                boxStyles: {
                  marginLeft: 64,
                  marginRight: 15,
                },
                btnStyles: {
                  border: '1px solid #f06666',
                  color: '#f06666',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 8px 0 rgba(102, 102, 102, 0.3)',
                },
                titleStyles: { display: 'none' },
              }}
              handleClick={() => {
                history.push('/contractor/drivers');
              }}
            />
            <div>Cancel</div>
          </div>
          <div style={{ marginLeft: 50, ...stylesAction }}>
            <ActionButton
              type="submit"
              title="Save"
              spanName="handel-floppy-disk"
              stylesExtra={{
                boxStyles: {
                  marginRight: 15,
                },
                btnStyles: {
                  backgroundColor: '#239DFF',
                  boxShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
                },
                titleStyles: { display: 'none' },
              }}
              handleClick={handleSubmit}
            />
            <div>Save</div>
          </div>
        </div>

      </div>
    );
  }
}

SimpleSaveButtons.propTypes = {
  history: PropTypes.any.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default withRouter(SimpleSaveButtons);
