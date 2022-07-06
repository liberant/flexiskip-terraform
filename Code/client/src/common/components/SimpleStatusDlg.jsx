import React from 'react';
import { any, string, bool, func } from 'prop-types';
import { Modal, Button } from 'antd';

const modalStyles = {
  box: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 90 },
  title: {
    fontWeight: 600,
    marginBottom: 20,
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 40,
    wordWrap: 'anywhere',
  },
  button: {
    display: 'inline-block',
    height: 44,
    fontSize: 14,
    padding: '10px 15px',
    border: '0px solid #239DFF',
    color: '#FFFFFF',
    backgroundColor: '#239DFF',
    cursor: 'pointer',
    borderRadius: '3px',
    width: 170,
    marginBottom: 10,
  },
}

/* eslint react/no-danger: 0 */

class SimpleStatusDlg extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      isOpen,

      icon,
      color,

      title,
      subTitle,
      buttonText,

      handleButtonClick,
    } = this.props;

    return (
      <Modal
        visible={isOpen}
        footer={null}
        closable={false}
      >
        <div style={{...modalStyles.box, color: color}}>
          <div>
            <span style={{...modalStyles.icon}}>
              <span className={icon} />
            </span>
          </div>
          <h3 style={modalStyles.title}>{title}</h3>
          <div
            style={modalStyles.subTitle}
          >{subTitle} </div>
          <div>
            <Button
              onClick={handleButtonClick}
              style={modalStyles.button}
              type="primary"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

SimpleStatusDlg.propTypes = {
  isOpen: bool.isRequired,
  title: string.isRequired,
  subTitle: string,
  buttonText: string,
  icon: string,
  color: string,
  handleButtonClick: func.isRequired,
};

SimpleStatusDlg.defaultProps = {
  icon: 'handel-check-circle',
  color: '#239dff',
};
export default SimpleStatusDlg;
