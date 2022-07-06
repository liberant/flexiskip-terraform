import React from 'react';
import { withRouter } from 'react-router-dom';
import { any, bool, func } from 'prop-types';

import { ActionButton } from '../../../common/components';
import styles, { stylesDetails } from './Styles';

const BackPreviousPage = () => (
  <div style={{ display: 'none' }}>
    <div>
      <div style={stylesDetails.backTitle}>
       Profile
      </div>
    </div>
  </div>
);

const ActionButtons = (props) => {
  const {
    handleDeletion,
    handleSuspend,
    history,
  } = props;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 53,
        marginLeft: 34,
      }}
    >
      <div>
        <ActionButton
          title="Suspend"
          spanName="handel-suspend"
          stylesExtra={{
            btnStyles: {
              color: '#ffffff',
              border: 'solid 1px #f6ba1a',
              backgroundColor: '#f6ba1a',
              boxShadow: '0 4px 8px 0 rgba(246, 186, 26,, 0.3)',
              marginRight: 0,
            },
            titleStyles: {
              fontSize: 14,
            },
          }}
          handleClick={handleSuspend}
        />
        <ActionButton
          title="Delete"
          spanName="handel-bin"
          stylesExtra={{
            btnStyles: {
              backgroundColor: '#f06666',
              boxShadow: '0 4px 8px 0 rgba(240, 102, 102, 0.3)',
              marginRight: 0,
            },
            titleStyles: {
              fontSize: 14,
            },
          }}
          handleClick={handleDeletion}
        />
      </div>

      <div>
        <ActionButton
          title="Add Admin"
          spanName="handel-admin"
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
          handleClick={() => { history.push('/contractor/add-admin'); }}
        />
      </div>


    </div>
  );
};

ActionButtons.propTypes = {
  handleSuspend: func.isRequired,
  handleDeletion: func.isRequired,
  history: any.isRequired,
};


class HeaderAdminSubForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleDeletion = this.handleDeletion.bind(this);
    this.handleSuspend = this.handleSuspend.bind(this);
  }

  handleDeletion() {
    this.props.handleDeletion();
  }

  handleSuspend() {
    this.props.handleSuspend();
  }

  render() {
    return (
      <div>
        <div className="back-previous-box col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <BackPreviousPage />
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <ActionButtons
            history={this.props.history}
            handleDeletion={this.handleDeletion}
            handleSuspend={this.handleSuspend}
          />
        </div>
      </div>
    );
  }
}

HeaderAdminSubForm.propTypes = {
  handleSuspend: func.isRequired,
  handleDeletion: func.isRequired,
  history: any.isRequired,
};

HeaderAdminSubForm.defaultProps = {
};

export default withRouter(HeaderAdminSubForm);
