import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropzoneComponent from 'react-dropzone-component';
import axios from 'axios';


import '../../../../node_modules/react-dropzone-component/styles/filepicker.css';
import '../../../../node_modules/dropzone/dist/min/dropzone.min.css';

import { getSafeFilename } from '../../utils/string';
import Avatar from '../Avatar';

/* eslint react/require-default-props: 0 */
/* eslint react/no-unused-prop-types: 0 */
/* eslint react/prop-types: 0 */
/* eslint react/no-did-mount-set-state: 0 */
/* eslint react/no-unused-state: 0 */
/* eslint no-param-reassign: 0 */
/* eslint no-nested-ternary: 0 */

const MAX_FILE_NUMBERS = 20;

/**
 * upload image to AWS S3
 *
 */
class ImagesS3UploadField extends Component {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    getUploadParams: PropTypes.func,
    onUploadSuccess: PropTypes.func,
    saveFileInfo: PropTypes.func,
    removeLogo: PropTypes.func,
    viewOnly: PropTypes.bool,
  }

  static defaultProps = {
    viewOnly: false,
  }

  /**
   * Get preview url from a S3 image url
   *
   * @param {string} orgUrl original image url
   * @param {number} width width of preivew image
   * @param {number} height height of preview image
   */
  static getPreviewUrlFromS3Image(orgUrl, width, height) {
    const baseUrl = orgUrl.substring(0, orgUrl.lastIndexOf('/') + 1);
    const filename = orgUrl.substring(orgUrl.lastIndexOf('/') + 1, orgUrl.length);
    const previewUrl = `${baseUrl}${width}x${height}/${filename}`;
    return previewUrl;
  }

  constructor(props) {
    super(props);
    this.state = {
      postUrl: '/',
      fileIds: props.input.value ?
        (props.input.value.constructor === Array ?
          props.input.value : [props.input.value]) : [],
      currentFile: {
        dataURL: '',
        name: '',
      },
      singleImage: props.input.value ? (props.input.value.constructor !== Array) : false,
    };

    this.init = this.init.bind(this);
  }

  async componentDidMount() {
    try {
      // Get upload information
      const {
        data: {
          uploadUrl, key, fileUrl, ...s3Params
        },
      } = await axios.get('/api/v1/cm/files/upload-params');

      this.setState({
        postUrl: uploadUrl,
        fileUrl,
        key,
        filePrefix: fileUrl.replace('{filename}', ''),
        keyPrefix: key.replace('{filename}', ''),

        params: { ...s3Params },
      });
    } catch (error) {
      this.setState({
        currentFile: {
          dataURL: '',
          name: '',
        },
      });
    }
  }

  // Preload the existed images.
  async init(dropzone) {
    this.state.fileIds.map((f) => {
      const fileParams = {
        dataURL: f,
        name: f.replace(this.state.filePrefix, ''),
      };

      dropzone.files.push(fileParams);
      dropzone.emit('addedfile', fileParams);
      dropzone.emit('thumbnail', fileParams, ImagesS3UploadField.getPreviewUrlFromS3Image(
        fileParams.dataURL,
        dropzone.options.thumbnailWidth,
        dropzone.options.thumbnailHeight,
      ));
      dropzone.emit('complete', fileParams);
      return true;
    });

    dropzone.options.maxFiles = MAX_FILE_NUMBERS;
  }

  render() {
    const self = this;
    const {
      input,
      label,
      required,
      meta: { touched, error, warning },
      viewOnly,
    } = this.props;
    if (viewOnly) {
      return <Avatar src={input.value} />;
    }

    const componentConfig = { postUrl: this.state.postUrl };
    const djsConfig = {
      autoProcessQueue: true,
      params: {
        ...this.state.params,
      },
      maxFiles: MAX_FILE_NUMBERS,
      addRemoveLinks: true,
      acceptedFiles: 'image/*',
      resizeWidth: 400,
      maxFilesize: 5,
    };

    const eventHandlers = {
      init: this.init,
      addedfile(file) {
        const filename = getSafeFilename(file.name);
        self.state.currentFile = file;
        self.setState({
          filename,
          params: {
            ...self.state.params,
            key: `${self.state.keyPrefix}${filename}`,
            'Content-Type': file.type,
          },
        });
      },
      processing() {
        if (self.state.singleImage) {
          this.removeAllFiles();
        }
      },
      removedfile: (file) => {
        const { fileIds, filePrefix } = self.state;
        const tmpFilterFile = file.name.includes(filePrefix) ? file.name : `${filePrefix}${getSafeFilename(file.name)}`;
        const tmpFiles = fileIds.filter(t => t !== tmpFilterFile);

        self.setState({ fileIds: tmpFiles });
        if (self.state.singleImage) {
          input.onChange('');
        } else {
          input.onChange(tmpFiles);
        }
      },
      success: async () => {
        const {
          filePrefix,
          filename,
        } = self.state;
        const fileInfo = `${filePrefix}${getSafeFilename(filename)}`;

        const tmpFiles = self.state.fileIds;
        tmpFiles.push(fileInfo);
        self.setState({ fileIds: tmpFiles });

        if (self.state.singleImage) {
          input.onChange(fileInfo);
        } else {
          input.onChange(tmpFiles);
        }
      },
    };

    return (
      <div className="images-s3-upload">
        {label && <label>{required ? `${label} * ` : label}</label>}
        {this.state.currentFile && (
          <DropzoneComponent
            config={componentConfig}
            eventHandlers={eventHandlers}
            djsConfig={djsConfig}
          />
        )}
        {touched &&
          ((error && <span className="text-danger">{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    );
  }
}

export default ImagesS3UploadField;

