import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isEmpty } from 'lodash';
import { reduxForm, formValueSelector, getFormValues, submit } from 'redux-form';
import queryString from 'query-string';
import { convertFromHTML } from 'draft-js';

import { setTitle } from '../../../common/actions';
import { createAdvertising } from '../actions';
import { withPreventingCheckHOC } from '../../../common/hocs';
import AdvertisingDetailsForm from '../components/AdvertisingDetailsForm';
import AdminLayout from '../../hoc/AdminLayout';
import SimpleConfirmDlg from '../../../common/components/SimpleConfirmDlg';

/* eslint no-underscore-dangle: 0 */

const ADD_ADVERTISING_FORM = 'admin/addAdvertisingDetail';

const AddAdvertisingDetailsForm = compose(
  reduxForm({
    form: ADD_ADVERTISING_FORM,
  }),
  withPreventingCheckHOC,
)(AdvertisingDetailsForm);

const selector = formValueSelector(ADD_ADVERTISING_FORM);


class AdvertisingManageAddPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: true,
      isEdit: true,
      // firstFetchFlag: true,
      modalIsOpen: false,
      pressPublished: false,
    };

    this.handleAdvertisingSubmit = this.handleAdvertisingSubmit.bind(this);
    this.handleSuccessCreate = this.handleSuccessCreate.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.reloadPage = this.reloadPage.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.onHandlePublishAdvertising = this.onHandlePublishAdvertising.bind(this);
  }


  componentDidMount() {
    const { setTitle } = this.props;

    setTitle('');
  }

  async onHandlePublishAdvertising() {
    this.setState({
      pressPublished: true,
    });
    await this.props.dispatch(submit(ADD_ADVERTISING_FORM));
    this.setState({
      pressPublished: false,
    });
  }

  async handleAdvertisingSubmit(values) {
    if (!values) {
      return;
    }

    const {
      title, content, startDate, endDate, status, section, image,
    } = values;

    const data = {
      title,
      content,
      status,
      section,
      image,
      startDate: startDate && startDate.toISOString(),
      endDate: endDate && endDate.toISOString(),
      published: this.state.pressPublished,
    };

    await this.props.createAdvertising({ url: 'ads', data });
  }

  handleSuccessCreate() {
    // await delay(ALERT_DISPLAY_DURATION);
    this.openModal();
    // this.props.history.push('/admin/manage-advertising');
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.props.history.push('/admin/manage-advertising');
  }

  reloadPage() {
    window.location.reload();
  }

  handlePreview() {
    const { formValues } = this.props;
    const currentPath = window.location.pathname;
    if (!isEmpty(formValues) && currentPath.includes('add')) {
      // const contentBlock = html ? htmlToDraft(html) : null;
      const blocks = convertFromHTML(formValues.content);
      formValues.content = blocks.contentBlocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
      // verify field is required
      if (formValues.title && formValues.image && formValues.content && formValues.section) {
        // get form data and make url query
        const previewURL = currentPath.replace('add', 'preview-unsaved');
        const previewURLwithParams = `${previewURL}?${queryString.stringify(formValues)}`;
        window.open(previewURLwithParams, '_blank');
      }
    }
  }

  render() {
    const { section } = this.props;
    const { modalIsOpen, isAdd, isEdit } = this.state;

    const { dirty, submitSucceeded } = this.props.form;
    if (!dirty && submitSucceeded && !modalIsOpen) {
      this.handleSuccessCreate();
    }

    return (
      <div className="x_panel_">
        <SimpleConfirmDlg
          modalIsOpen={modalIsOpen}
          title="Advertising Created"
          bottomTitle="Add Another Advertising"
          handleButtonClick={this.closeModal}
        />
        <AddAdvertisingDetailsForm
          addFlag={isAdd}
          editFlag={isEdit}
          isEdit
          isPublish
          section={section}
          onSubmit={this.handleAdvertisingSubmit}
          handlePreview={this.handlePreview}
          publishAdvertising={this.onHandlePublishAdvertising}
        />
      </div>
    );
  }
}

AdvertisingManageAddPage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  createAdvertising: PropTypes.func.isRequired,
  history: PropTypes.any.isRequired,
  form: PropTypes.any.isRequired,
  section: PropTypes.string.isRequired,
  formValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default compose(
  AdminLayout,

  connect(
    state => ({
      advertising: state.admin.advertising,
      form: state.form['admin/addAdvertisingDetail'] || {},
      section: selector(state, 'section') || 'Horizontal',
      formValues: getFormValues(ADD_ADVERTISING_FORM)(state),
    }),
    dispatch => ({
      // set page title
      setTitle: title => dispatch(setTitle(title)),

      createAdvertising: (data) => {
        const action = createAdvertising(data);
        dispatch(action);
        return action.promise;
      },
    }),
  ),
)(AdvertisingManageAddPage);
