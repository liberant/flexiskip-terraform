import React from 'react';
import { any, bool, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reset } from 'redux-form';

import AdminLayout from '../../hoc/AdminLayout';
import EligibleAddressTable from '../components/EligibleAddressTable';
import CreateAddressForm from '../components/CreateAddressForm';
import Spinner from '../../../common/components/Spinner';
import { ActionButton, HandelButton, SimpleNewConfirmDlg, SimpleStatusDlg } from '../../../common/components';
import httpClient from "../../../common/http";
import { Modal, message, Upload, Button } from 'antd';
const { Dragger } = Upload;
import PageSelector from '../../../common/components/form/PageSelector';

import { withPermission } from '../../../common/hocs/PermissionRequired';
import PermissionRequired from '../../../common/hocs/PermissionRequired';

import Styles from '../components/Styles';
import S3 from 'aws-sdk/clients/s3';
import { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand } from 'aws-sdk/clients/s3';
import axios from 'axios';

const { notificationModalStyles } = Styles;

const IMPORT_FILE_S3_KEY = `council-address-import.csv`;
const importStatusModalContents = {
  successImport: {
    isOpen: true,
    icon: 'handel-check-circle',
    color: '#239dff',
    title: "Imported Successfully",
    subTitle: "",
    buttonText: "OK",
  },
  failedImport: {
    isOpen: true,
    icon: 'handel-notify',
    color: '#f06666',
    title: "Failed to import",
    subTitle: "",
    buttonText: "OK",
  },
  failedUpload: {
    isOpen: true,
    icon: 'handel-notify',
    color: '#f06666',
    title: "Failed to upload",
    subTitle: "",
    buttonText: "OK",
  },
  failedValidate: {
    isOpen: true,
    icon: 'handel-notify',
    color: '#f06666',
    title: "Invalid File Upload",
    subTitle: "",
    buttonText: "OK",
  },
}
class EligibleDBManagePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 10,
      eligibleAddressesTable: {
        data: [],
        pagination: {
          currentPage: 1,
          pageCount: 1,
          perPage: 10,
          totalCount: 1,
        },
        searchTerm: '',
      },
      openCreateModal: false,
      loading: false,
      selectedRowKeys: [],

      showDeleteConfirm: false,
      deleteConfirmSubTitle: '',
      submittingDelete: false,

      openUploadModal: false,
      uploading: false,
      fileList: [],

      importStatusModal: {
        isOpen: false,
        icon: '',
        iconColor: '',
        title: '',
        subTitle: '',
        buttonText: '',
      }
    };
    this.handlePerPageChange = this.handlePerPageChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.showDeleteConfirmModal = this.showDeleteConfirmModal.bind(this);
    this.hideDeleteConfirmModal = this.hideDeleteConfirmModal.bind(this);
    this.handleUploadChange = this.handleUploadChange.bind(this);
    this.customUpload = this.customUpload.bind(this);
    this.handleCloseImportStatusModal = this.handleCloseImportStatusModal.bind(this);
    this.validateUpload = this.validateUpload.bind(this);

  }

  async componentDidMount() {
    this.fetchEligibleAddresses();
  }

  async fetchEligibleAddresses(){
    this.setState(() => ({ loading: true }));
    const { searchTerm, pagination } = this.state.eligibleAddressesTable;
    const { currentPage, perPage } = pagination;

    const url = `admin/eligible-addresses`;
    const params = {
      limit: perPage,
      page: currentPage,
      s: searchTerm,
    }
    const {data, headers} = await httpClient.get(url, { params });
    this.setState({
      eligibleAddressesTable: {
        data,
        pagination: {
          currentPage: headers['x-pagination-current-page'] >> 0,
          pageCount: headers['x-pagination-page-count'] >> 0,
          perPage: headers['x-pagination-per-page'] >> 0,
          totalCount: headers['x-pagination-total-count'] >> 0,
        },
        searchTerm: searchTerm,
      },
      selectedRowKeys: [],
    });
    this.setState(() => ({ loading: false }));
  }

  handlePerPageChange(perPage) {
    const { eligibleAddressesTable } = this.state;
    eligibleAddressesTable.pagination.perPage = perPage
    this.setState(() => ({ eligibleAddressesTable: eligibleAddressesTable }));
    this.fetchEligibleAddresses();
  }

  handlePageChange(page) {
    const { eligibleAddressesTable } = this.state;
    eligibleAddressesTable.pagination.currentPage = page
    this.setState(() => ({ eligibleAddressesTable: eligibleAddressesTable }));
    this.fetchEligibleAddresses();
  }

  handleSearch(searchTerm) {
    const { eligibleAddressesTable } = this.state;
    eligibleAddressesTable.searchTerm = searchTerm
    this.setState(() => ({ eligibleAddressesTable: eligibleAddressesTable }));
    this.fetchEligibleAddresses();
  }

  async handleCreate(formBody) {
    const { resetCreateAddressForm } = this.props;
    const url = `admin/eligible-addresses`;
    try {
      await httpClient.post(url, { ...formBody });
      this.setState({ openCreateModal: false });
      this.fetchEligibleAddresses();
      message.success("New address was created.");
      resetCreateAddressForm();
    } catch (error) {
      message.error(error.response.data.message);
    }
  }

  async handleDelete() {
    try {
      this.setState(() => ({
        submittingDelete: true,
        showDeleteConfirm: false,
      }));

      const { selectedRowKeys } = this.state;

      if (selectedRowKeys.length == 0) return;

      const url = `admin/eligible-addresses`;
      const params = {
        ids: selectedRowKeys,
      };

      await httpClient.delete(url, { params });
      this.fetchEligibleAddresses();
      message.success(`Deleted ${selectedRowKeys.length} address(es).`);
    } catch (error) {
      message.error("Failed to delete address(es).");
    } finally {
      this.setState(() => ({ submittingDelete: false }));
    }
  }

  showDeleteConfirmModal() {
    const { selectedRowKeys, submittingDelete } = this.state;
    if (selectedRowKeys.length == 0 || submittingDelete) return;
    this.setState(() => ({
      showDeleteConfirm: true,
      deleteConfirmSubTitle: `By clicking DELETE, ${selectedRowKeys.length} address(es) will be deleted.`
    }));
  }

  hideDeleteConfirmModal() {
    this.setState(() => ({ showDeleteConfirm: false }));
  }

  handleRowSelect(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  async customUpload(option) {
    const { onSuccess, onError, file, action, onProgress } = option;

    try {
      this.setState({ uploading: true });
      const { data } = await httpClient.get('admin/import-eligible-addresses/upload-params');
      data.key = data.key.replace('{filename}', IMPORT_FILE_S3_KEY);

      const dataSubmit = {
        acl : data["acl"],
        success_action_status : data["success_action_status"],
        policy : data["policy"],
        "x-amz-signature" : data["x-amz-signature"],
        "x-amz-credential" : data["x-amz-credential"],
        "x-amz-date" : data["x-amz-date"],
        "x-amz-algorithm" : data["x-amz-algorithm"],
        key : data["key"],
      }

      const formData = new FormData();
      for (var key in dataSubmit) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, dataSubmit[key]);
        }
      }

      formData.append('Content-Type', 'text/csv');
      formData.append("file", file);

      await axios.post(data.uploadUrl, formData);
      onSuccess();
      try {
        // call proceed import on uploaded file
        await httpClient.get('admin/import-eligible-addresses', {
          params: {
            key: IMPORT_FILE_S3_KEY
          }
        });
        this.setState({
          importStatusModal: importStatusModalContents.successImport
        })
        this.fetchEligibleAddresses();
      } catch(e){
        const errMessage = e.response.data.message || '';
        this.setState({
          importStatusModal: {
            ...importStatusModalContents.failedImport,
            subTitle: errMessage
          }
        })
      }
    } catch (err) {
      this.setState({
        importStatusModal: importStatusModalContents.failedUpload
      })
      return onError(err);
    } finally {
      this.setState({ uploading: false});
    }
  }

  validateUpload(file, fileList) {
    // Validate file
    let validateMsg = '';
    // if (!file.name.endsWith('.csv')) validateMsg = 'Invalid file type. Required CSV file.';
    if (file.size >= 5 * 1024 * 1024) validateMsg = 'File upload size is too big! Maximum file size is 5mb.';
    if (validateMsg){
       this.setState({
        importStatusModal: {
          ...importStatusModalContents.failedValidate,
          subTitle: validateMsg,
        },
      })

      return false;
    }
    return true;
  }

  handleUploadChange(uploadInfo) {
    let fileList = [...uploadInfo.fileList];
    fileList = fileList.slice(-1); // limit 1
    this.setState({
      fileList,
    });
  }

  handleCloseImportStatusModal() {
    this.setState({
      importStatusModal: {
        ...this.state.importStatusModal,
        isOpen: false,
      },
      fileList: []
    })
  }

  render() {
    const {
      eligibleAddressesTable,
      openCreateModal,
      loading,
      selectedRowKeys,

      showDeleteConfirm,
      deleteConfirmSubTitle,
      submittingDelete,

      openUploadModal,
      uploading,
      fileList,

      importStatusModal,
    } = this.state;

    this.modalStartContent = {
      ...this.modalStartContent,
      title: 'Are You Sure?',
      subTitle: 'By clicking DELETE, those user(s) will be deleted.',
      buttonText: 'DELETE',
      bottomTitle: 'Do not Delete',
    };

    return (
      <div className="x_panel_">
        <h1 className="p-title">Eligible Addresses</h1>
        <div style={{marginTop: 30 }}>
          <PermissionRequired permission="editManageDB">
            <Modal
              maskClosable={false}
              width="60%"
              title="Create Address"
              visible={openCreateModal}
              footer={null}
              className="w-modal"
              onCancel={() => this.setState({ openCreateModal: false })}
            >
              <CreateAddressForm onSubmit={this.handleCreate} yes="yes"/>
            </Modal>

            <SimpleNewConfirmDlg
              modalIsOpen={showDeleteConfirm}
              styles={{
                modal: { top: 430 },
                icon: { fontSize: 64, color: '#f06666' },
                title: {
                  color: '#f06666',
                },
                buttonText: {
                  color: 'white',
                  backgroundColor: '#f06666',
                },
              }}
              title={'Are You Sure?'}
              subTitle={deleteConfirmSubTitle}
              buttonText={'DELETE'}
              bottomTitle={'Do not DELETE'}
              handleButtonClick={this.handleDelete}
              handleNoButtonClick={this.hideDeleteConfirmModal}
            >
              <span style={{ fontSize: 64, color: '#f06666' }}>
                <span className={'handel-question'} />
              </span>
            </SimpleNewConfirmDlg>

            <SimpleStatusDlg
              isOpen={importStatusModal.isOpen}
              icon={importStatusModal.icon}
              color={importStatusModal.color}
              title={importStatusModal.title}
              subTitle={importStatusModal.subTitle}
              buttonText={importStatusModal.buttonText}
              handleButtonClick={this.handleCloseImportStatusModal}
            />

            <div className="row">
              <div className="col-xs-12 col-md-6">
                <div className="top-toolbar">
                  <HandelButton
                    iconColor="white"
                    bgColor="red"
                    borderColor="red"
                    shadowColor="red"
                    label="Delete"
                    onClick={this.showDeleteConfirmModal}
                    loading={submittingDelete}
                  >
                    <span className="handel-bin" />
                  </HandelButton>
                </div>
              </div>
              <div className="col-xs-12 col-md-6">
                  <div className="top-toolbar text-right">
                    <HandelButton
                      iconColor="white"
                      bgColor="blue"
                      borderColor="blue"
                      shadowColor="blue"
                      label="Add Address"
                      onClick={() => this.setState({openCreateModal: true})}
                    >
                      <span className="handel-plus" />
                    </HandelButton>

                    <Upload
                      customRequest={this.customUpload}
                      fileList={fileList}
                      onChange={this.handleUploadChange}
                      disabled={uploading}
                      beforeUpload={this.validateUpload}
                    >
                      <HandelButton
                        iconColor="white"
                        bgColor="blue"
                        borderColor="blue"
                        shadowColor="blue"
                        label="Upload Addresses"
                        loading={uploading}
                      >
                        <span className="handel-document" />
                      </HandelButton>
                    </Upload>
                  </div>
              </div>
            </div>
          </PermissionRequired>
        </div>

        <EligibleAddressTable
          dataset={eligibleAddressesTable}
          loading={loading}

          onPerPageChange={this.handlePerPageChange}
          onPageChange={this.handlePageChange}
          onSearch={this.handleSearch}
          onRowSelect={this.handleRowSelect}
          selectedRowKeys={selectedRowKeys}
        >
        </EligibleAddressTable>
      </div>
    );
  }
}

const CREATE_ADDRESS_FORM = "admin/createAddress";
export default compose(
  AdminLayout,
  withPermission('listManageDB'),
  connect(
    null,
    dispatch => ({
      resetCreateAddressForm: () => dispatch(reset(CREATE_ADDRESS_FORM)),
    }),
  ),
)(EligibleDBManagePage);
