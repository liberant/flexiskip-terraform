import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { InnerDivider } from '../../../common/components';

class SimpleSaveButtons extends React.Component {
  render() {
    const { handleSubmit, history } = this.props;

    return (
      <div>
        <InnerDivider />
        <div style={{ marginLeft: 20, display: 'flex' }}>
          <div
            style={{
                border: '1px solid #f06666',
                color: '#f06666',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 8px 0 rgba(102, 102, 102, 0.3)',
                marginRight: 15,
                borderRadius: 3,
                width: 100,
                height: 44,
                lineHeight: '44px',
                textAlign: 'center',
                fontWeight: '600',
                cursor: 'pointer',
            }}
            onClick={() => {
              history.push('/contractor/profile');
            }}
          >
            Cancel
          </div>

          <div
            style={{
              border: '1px solid #239DFF',
              color: '#ffffff',
              backgroundColor: '#239DFF',
              boxShadow: '0 4px 8px 0 rgba(35, 157, 255, 0.3)',
              marginRight: 0,
              borderRadius: 3,
              width: 100,
              height: 44,
              lineHeight: '44px',
              textAlign: 'center',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            onClick={handleSubmit}
          >
            Save
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
