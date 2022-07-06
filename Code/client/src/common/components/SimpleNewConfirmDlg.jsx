import React from 'react';
import { any, string, bool, func } from 'prop-types';
import Modal from 'react-modal';

Modal.setAppElement('#root');
Modal.defaultStyles.overlay.backgroundColor = 'rgba(145,146,147, 0.75)';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 280,
    minHeight: 300,
  },
};
const modalStyles = {
  box: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 600,
    height: 450,
  },
  checkIcon: {
    fontSize: 64,
    color: '#239DFF',
  },
  title: {
    color: '#239DFF',
    fontWeight: 600,
    marginBottom: 50,
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 133,
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
    width: 200,
    marginBottom: 10,
  },
  link: {
    color: '#239DFF',
    fontSize: 16,
    fontWeight: '600',
    cursor: 'pointer',
  },
};

/* eslint react/no-danger: 0 */

class SimpleNewConfirmDlg extends React.Component {
  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.reloadPage = this.reloadPage.bind(this);
  }

  closeModal() {
    const { handleButtonClick } = this.props;

    if (handleButtonClick) {
      this.props.handleButtonClick();
    }
  }

  reloadPage() {
    const { handleNoButtonClick } = this.props;

    if (handleNoButtonClick) {
      handleNoButtonClick();
    } else {
      window.location.reload();
    }
  }

  createMarkup(str) {
    return { __html: str };
  }

  render() {
    const {
      modalIsOpen,
      title, subTitle, bottomTitle, buttonText,
      children, styles,
    } = this.props;

    return (
      <Modal
        isOpen={modalIsOpen}
        style={{ content: { ...customStyles.content, ...styles.modal } }}
      >
        <div style={modalStyles.box}>
          <div>
            {
              children ? (<span>{children}</span>) : (<span className="handel-check-circle" style={modalStyles.checkIcon} />)
            }
          </div>
          <h3 style={{ ...modalStyles.title, ...styles.title }}>{title}</h3>
          <div
            style={{ ...modalStyles.subTitle, ...styles.subTitle }}
            dangerouslySetInnerHTML={this.createMarkup(subTitle)}
          />
          <div>
            {bottomTitle && (
              <button
                style={{ ...modalStyles.button, ...styles.bottomTitle }}
                onClick={this.reloadPage}
              >
                {bottomTitle}
              </button>
            )}
            <button
              onClick={this.closeModal}
              style={{ ...modalStyles.button, ...styles.buttonText }}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

SimpleNewConfirmDlg.propTypes = {
  modalIsOpen: bool.isRequired,
  title: string.isRequired,
  subTitle: string,
  buttonText: string,
  bottomTitle: string,
  children: any,
  handleButtonClick: func.isRequired,
  handleNoButtonClick: func,
  styles: any,
};

SimpleNewConfirmDlg.defaultProps = {
  subTitle: '',
  buttonText: 'OK',
  bottomTitle: '',
  children: null,
  styles: {},
  handleNoButtonClick: null,
};

export default SimpleNewConfirmDlg;
