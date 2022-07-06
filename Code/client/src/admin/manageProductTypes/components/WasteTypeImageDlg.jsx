import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import axios from 'axios';
import DropZone from 'react-dropzone';
import PermissionRequired from '../../../common/hocs/PermissionRequired';

/* eslint react/no-did-mount-set-state: 0 */
/* eslint no-underscore-dangle: 0 */

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

class WasteTypeImageDlg extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postUrl: '/',
      singleImage: '',
      isChanging: false,
      changeBtnText: 'CHANGE IMAGE',
    };

    this.handleUpdateImage = this.handleUpdateImage.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
  }

  async componentDidMount() {
    // Get upload information
    const {
      data: {
        uploadUrl, key, fileUrl, ...s3Params
      },
    } = await axios.get('/api/v1/cm/files/upload-params');

    this.setState({
      postUrl: uploadUrl,
      filePrefix: fileUrl.replace('{filename}', ''),
      keyPrefix: key.replace('{filename}', ''),

      params: { ...s3Params },
    });
  }

  async handleChangeImage(files) {
    const {
      keyPrefix, params, postUrl, filePrefix,
      isChanging,
    } = this.state;

    if (files.length < 1) {
      return;
    }

    if (isChanging) {
      return;
    }

    if (!files[0].type.includes('image')) {
      return;
    }

    const formData = new FormData();

    formData.append('acl', params.acl);
    formData.append('success_action_status', params.success_action_status);
    formData.append('policy', params.policy);
    formData.append('x-amz-signature', params['x-amz-signature']);
    formData.append('x-amz-credential', params['x-amz-credential']);
    formData.append('x-amz-date', params['x-amz-date']);
    formData.append('x-amz-algorithm', params['x-amz-algorithm']);
    formData.append('key', `${keyPrefix}${files[0].name}`);
    formData.append('Content-Type', files[0].type);
    formData.append('file', files[0]);


    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: ' ',
      },
      data: formData,
      url: postUrl,
    };

    this.setState({
      changeBtnText: 'Changing ...',
    });

    await axios(options).then(() => {
      this.setState({
        singleImage: `${filePrefix}${files[0].name}`,
        isChanging: false,
        changeBtnText: 'CHANGE IMAGE',
      });
    }).catch(() => {
      this.setState({
        singleImage: '',
        isChanging: false,
      });
    });
  }

  handleUpdateImage() {
    const { updateImage } = this.props;
    const { singleImage } = this.state;

    if (updateImage && singleImage) {
      updateImage(singleImage);
    }
  }

  render() {
    const {
      data, dlgIsOpen,
      closeDlg,
    } = this.props;

    const { singleImage, isChanging, changeBtnText } = this.state;

    if (!data || !data._id || !data.image) {
      return (<div />);
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
            <div style={{ fontSize: 28 }}>Update Photo</div>
            <div>
              <span
                className="handel-cross"
                style={{ cursor: 'pointer', fontSize: 32 }}
                onClick={closeDlg}
              />
            </div>
          </div>
          <div style={{ padding: 20 }}>
            <div className="row">
              <div className="col-xs-12">
                <div>
                  <img
                    src={singleImage || data.image}
                    alt={data.name}
                    style={{
                      width: 671,
                      height: 456,
                    }}
                  />
                </div>
                <div />
              </div>
            </div>
            <PermissionRequired permission="editProductType">
              <div className="row">
                <div className="col-xs-6">
                  <div style={{ textAlign: 'center', margin: '50px auto 50px auto' }}>
                    <DropZone
                      onDrop={this.handleChangeImage}
                      style={{
                        borderStyle: 'none',
                      }}
                      disabled={isChanging}
                    >
                      <div
                        id="changeBtn"
                        style={{
                          display: 'inline-block',
                          width: 250,
                          lineHeight: '52px',
                          border: '1px solid #239dff',
                          color: '#239dff',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {changeBtnText}
                      </div>
                    </DropZone>
                  </div>
                </div>
                <div className="col-xs-6">
                  <div style={{ textAlign: 'center', margin: '50px auto 50px auto' }}>
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
                      onClick={this.handleUpdateImage}
                    >
                      SUBMIT
                    </span>
                  </div>
                </div>
              </div>
            </PermissionRequired>
          </div>
        </div>
      </Modal>
    );
  }
}

WasteTypeImageDlg.propTypes = {
  dlgIsOpen: PropTypes.bool,
  data: PropTypes.any.isRequired,
  closeDlg: PropTypes.func.isRequired,
  updateImage: PropTypes.func.isRequired,
};

WasteTypeImageDlg.defaultProps = {
  dlgIsOpen: false,
};

export default WasteTypeImageDlg;
