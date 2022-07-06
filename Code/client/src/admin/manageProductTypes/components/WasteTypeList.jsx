import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './Styles';

import WasteTypeImageForm from './WasteTypeImageForm';
import WasteTypeImageDlg from './WasteTypeImageDlg';

/* eslint no-underscore-dangle: 0 */

class WasteTypeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dlgIsOpen: false,
      selectedImage: '',
    };

    this.handleOpenDlg = this.handleOpenDlg.bind(this);
    this.handleCloseDlg = this.handleCloseDlg.bind(this);
    this.handleSubmitImage = this.handleSubmitImage.bind(this);
  }

  handleOpenDlg(id) {
    const { data } = this.props;
    const imageData = data.find(d => d._id === id);

    this.setState({ dlgIsOpen: true, selectedImage: imageData });
    const bodyDom = window.document.getElementsByTagName('body');
    if (bodyDom) {
      bodyDom[0].style.overflow = 'hidden';
    }
  }

  handleCloseDlg() {
    this.setState({ dlgIsOpen: false, selectedImage: '' });
    const bodyDom = window.document.getElementsByTagName('body');
    if (bodyDom) {
      bodyDom[0].style.overflow = 'auto';
    }
  }

  async handleSubmitImage(data) {
    const { getWasteTypeList, updateImage } = this.props;
    const { selectedImage } = this.state;

    if (updateImage) {
      await updateImage({
        uid: selectedImage._id,
        data: { image: data },
      });
      this.handleCloseDlg();

      await getWasteTypeList();
    }
  }

  render() {
    const { data } = this.props;
    const { dlgIsOpen, selectedImage } = this.state;

    return (
      <div>
        <WasteTypeImageDlg
          data={selectedImage}
          dlgIsOpen={dlgIsOpen}
          closeDlg={this.handleCloseDlg}
          updateImage={this.handleSubmitImage}
        />
        <div style={{ ...styles.usersTabBoxOuter, marginTop: 30 }}>
          <div>
            <div>
              <h3
                style={{
                  marginBottom: 53,
                  color: '#1d415d',
                }}
              >
                Product Types
              </h3>
            </div>
            <WasteTypeImageForm
              data={data}
              openDlg={this.handleOpenDlg}
            />
          </div>
        </div>
      </div>
    );
  }
}

WasteTypeList.propTypes = {
  data: PropTypes.any.isRequired,
  updateImage: PropTypes.func.isRequired,
  getWasteTypeList: PropTypes.func.isRequired,
};

export default WasteTypeList;
