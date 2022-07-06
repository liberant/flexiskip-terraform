import React from 'react';
import { any, string, bool, func, shape } from 'prop-types';
// import Modal from 'react-modal';

import { Modal, Button } from 'antd';

// Modal.setAppElement('#root');
// Modal.defaultStyles.overlay.backgroundColor = 'rgba(145,146,147, 0.75)';

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
  header: {
    width: '100%',
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 600,
    minHeight: 450,
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

class CommonConfirmDlg extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: {
        styles: { modal: { top: 430 } },
        title: "Email Sent",
        subTitle: "Password reset instructions is sent to",
        buttonText: "OK",
        bottomTitle: "",
        handleButtonClick: () => {},
        handleNoButtonClick: () => {},
      },
      isSaving: false,
      dataCustomer: {}
    };

    this.closeModal = this.closeModal.bind(this);
    this.processModal = this.processModal.bind(this);

    this.onHandleConfirmPopupDlg = this.onHandleConfirmPopupDlg.bind(this);
    this.onHandleCancelPopupDlg = this.onHandleCancelPopupDlg.bind(this);
    this.onHandleSuccessPopupDlg = this.onHandleSuccessPopupDlg.bind(this);
    this.onHandleFailPopupDlg = this.onHandleFailPopupDlg.bind(this);

    this.modalStartContent = {
      title: 'Are You Sure?',
      subTitle: 'By clicking ACTIVATE, those user(s) will be activated.',
      buttonText: 'ACTIVATE',
      bottomTitle: 'Do not Activate',
      styles: {
        modal: { top: 430 },
        header: { width: '100%' },
        icon: { fontSize: 64, color: '#f06666' },
        title: {
          color: '#f06666',
        },
        buttonText: {
          color: 'white',
          backgroundColor: '#f06666',
        },
      },
      iconSpanName: 'handel-question',
      handleButtonClick: this.onHandleConfirmPopupDlg,
      handleNoButtonClick: this.onHandleCancelPopupDlg,
    };
    this.modalSuccessContent = {
      title: 'User(s) Activated',
      subTitle: 'The current user(s) has been Activated',
      buttonText: 'OK',
      bottomTitle: '',
      styles: {
        modal: { top: 430 },
        icon: { fontSize: 64, color: '#239dff' },
        bottomTitle: {
          display: 'none',
        },
      },
      iconSpanName: 'handel-check-circle',
      handleButtonClick: this.onHandleSuccessPopupDlg,
      handleNoButtonClick: this.onHandleCancelPopupDlg,
    };
    this.modalFailContent = {
      title: 'User(s) Activated Failed',
      buttonText: 'OK',
      bottomTitle: '',
      styles: {
        modal: { top: 430 },
        icon: { fontSize: 64, color: '#f06666' },
        title: {
          color: '#f06666',
        },
        buttonText: {
          color: 'white',
          backgroundColor: '#f06666',
        },
        bottomTitle: {
          display: 'none',
        },
      },
      iconSpanName: 'handel-notify',
      handleButtonClick: this.onHandleFailPopupDlg,
      handleNoButtonClick: this.onHandleCancelPopupDlg,
    };
    this.modalCurrentFunc = {
      handleProcess: null,
      handleSuccess: null,
      handleFail: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.modalContents !== prevProps.modalContents) {
      const { modalContents } = this.props;

      this.modalStartContent = {
        ...this.modalStartContent,
        ...modalContents.start,
        styles: {
          ...this.modalStartContent.styles,
          ...modalContents.start.styles,
        },
      };
      this.modalSuccessContent = {
        ...this.modalSuccessContent,
        ...modalContents.success,
        styles: {
          ...this.modalSuccessContent.styles,
          ...modalContents.success.styles,
        },
      };
      this.modalFailContent = {
        ...this.modalFailContent,
        ...modalContents.fail,
        styles: {
          ...this.modalFailContent.styles,
          ...modalContents.fail.styles,
        },
      };

      this.modalCurrentFunc = {
        ...modalContents.func,
      };

      /* eslint react/no-did-update-set-state: 0 */
      this.setState({
        modalContent: this.modalStartContent,
      });
    }
  }

  async onHandleConfirmPopupDlg() {
    const { handleCloseModal } = this.props;
    const { handleProcess } = this.modalCurrentFunc;
    const { isSaving } = this.state;

    if (isSaving) return;

    if ((handleProcess === null) || (handleProcess === undefined)) {
      handleCloseModal();

      return;
    }

    try {
      const {data} = await handleProcess();
      if (this.props && this.props.dataCustomer) {
        this.props.handleGetDataCustomer(data);
      };
      this.setState({
        modalContent: this.modalSuccessContent,
        isSaving: false
      });
    } catch (error) {
      this.modalFailContent.subTitle = `Error occured: ${error.message}`;
      this.setState({
        modalContent: this.modalFailContent,
        isSaving: false,
      });
    }
  }

  onHandleSuccessPopupDlg() {
    const { handleCloseModal } = this.props;
    const { handleSuccess } = this.modalCurrentFunc;
    this.setState({ isSaving: false });

    if ((handleSuccess !== null) && (handleSuccess !== undefined)) {
      if (
        this.props && this.props.dataCustomer &&
        this.props.dataCustomer.roles &&
        this.props.dataCustomer.roles[0] === "residentialCustomer" &&
        this.props.saveWithPayment
      ) {
        handleSuccess(true);
      } else {
        handleSuccess(false);
      }
    } else {
      handleCloseModal();
    }
  }

  onHandleCancelPopupDlg() {
    this.props.handleCloseModal();
  }

  onHandleFailPopupDlg() {
    const { handleCloseModal } = this.props;
    const { handleFail } = this.modalCurrentFunc;

    if ((handleFail !== null) && (handleFail !== undefined)) {
      handleFail();
    } else {
      handleCloseModal();
    }
  }

  closeModal() {
    const { handleCloseModal } = this.props;

    handleCloseModal();
  }

  processModal() {
    const { handleCloseModal } = this.props;
    const { modalContent } = this.state;

    if (modalContent.handleButtonClick) {
      modalContent.handleButtonClick();
    } else {
      handleCloseModal();
    }
  }

  createMarkup(str) {
    return { __html: str };
  }

  render() {
    const {
      modalIsOpen,
      // title, subTitle, bottomTitle, buttonText,
      children,
      isSaving,
    } = this.props;
    const {
      modalContent: {
        title, subTitle, bottomTitle, buttonText,
        styles, iconSpanName,
      },
    } = this.state;


    return (
      <Modal
        visible={modalIsOpen}
        footer={null}
        style={{ ...modalStyles.box }}
        closable={false}
      >
        <div style={modalStyles.box}>
          <div style={modalStyles.header}>
            {children}
          </div>
          <div>
            <span style={styles.icon}>
              <span className={iconSpanName} />
            </span>
          </div>
          <h3 style={{ ...modalStyles.title, ...styles.title }}>{title}</h3>
          <div
            style={{ ...modalStyles.subTitle, ...styles.subTitle }}
            dangerouslySetInnerHTML={this.createMarkup(subTitle)}
          />
          <div>
            <Button
              style={{ ...modalStyles.button, ...styles.bottomTitle }}
              onClick={this.closeModal}
              disabled={isSaving}
              loading={isSaving}
            >
              {bottomTitle}
            </Button>
            <Button
              onClick={this.processModal}
              style={{ ...modalStyles.button, ...styles.buttonText }}
              type="primary"
              disabled={isSaving}
              loading={isSaving}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

CommonConfirmDlg.propTypes = {
  modalContents: shape({
    subTitle: string,
    buttonText: string,
    bottomTitle: string,
    styles: any,
  }).isRequired,
  modalIsOpen: bool.isRequired,
  children: any,
  // handleButtonClick: func.isRequired,
  // handleNoButtonClick: func,
  // handleProcess: func,
  // handleSuccess: func,
  handleCloseModal: func.isRequired,
  isSaving: bool.isRequired,
};

CommonConfirmDlg.defaultProps = {
  children: null,
  // handleNoButtonClick: null,
  // handleProcess: null,
  // handleSuccess: null,
};

export default CommonConfirmDlg;
