import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

// import ImagesS3UploadField from '../../../common/components/form/ImagesS3UploadField';

import CouncilDetailsSubForm from './CouncilDetailsSubForm';
import CouncilLocationSubForm from './CouncilLocationSubForm';

Modal.setAppElement('#root');
Modal.defaultStyles.overlay.backgroundColor = 'rgba(145,146,147, 0.75)';
Modal.defaultStyles.overlay.zIndex = 10;
Modal.defaultStyles.overlay.overflow = 'auto';


const customStyles = {
  content: {
    top: 420,
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    // minWidth: 880,
    // minHeight: 300,
    padding: 0,
    width: 715,
  },
};

class AddCouncilCodeDlg extends React.Component {
  constructor(props) {
    super(props);

    this.datePickerFlag = false;
  }

  componentDidMount() {
    this.setDatePickerStyle();
  }

  setDatePickerStyle() {
    const datePicker = window.document.getElementsByClassName('rw-widget-picker rw-widget-container');
    if (datePicker && datePicker[0]) {
      datePicker[0].style.lineHeight = 'unset';
      this.datePickerFlag = true;
    }
  }

  render() {
    const {
      dlgIsOpen, isEdit, product, councils,
      handleCloseDlg, handleSave, council,
    } = this.props;

    if (!product.name || !councils) {
      return (<div />);
    }

    if (!this.datePickerFlag) {
      this.setDatePickerStyle();
    }

    return (
      <Modal
        isOpen={dlgIsOpen}
        style={{ content: customStyles.content }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#239dff',
              color: 'white',
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: 28 }}>Add Council Product</div>
            <div>
              <span
                className="handel-cross"
                style={{ cursor: 'pointer', fontSize: 32 }}
                onClick={handleCloseDlg}
              />
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <div className="row">
              <div className="col-xs-6">
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 20,
                      margin: '10px 0px 20px 10px',
                      color: '#239dff',
                    }}
                  >
                    Council Details
                  </span>
                </div>
                <div>
                  <CouncilDetailsSubForm
                    isEdit={isEdit}
                    product={product}
                  />
                </div>
              </div>
              <div className="col-xs-6">
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 20,
                      margin: '10px 0px 20px 10px',
                      color: '#239dff',
                    }}
                  >
                    Location
                  </span>
                </div>
                <div>
                  <CouncilLocationSubForm
                    council={council}
                    councils={councils}
                    isEdit={isEdit}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12">
                <div style={{ textAlign: 'center', margin: '20px auto 50px auto' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 250,
                      lineHeight: '52px',
                      backgroundColor: '#239dff',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onClick={handleSave}
                  >
                    SUBMIT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

AddCouncilCodeDlg.propTypes = {
  dlgIsOpen: PropTypes.bool,
  isEdit: PropTypes.bool,
  product: PropTypes.any.isRequired,
  council: PropTypes.any,
  councils: PropTypes.any.isRequired,
  handleCloseDlg: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

AddCouncilCodeDlg.defaultProps = {
  dlgIsOpen: false,
  isEdit: true,
  council: {},
};

export default AddCouncilCodeDlg;
