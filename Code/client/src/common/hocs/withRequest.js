import React from 'react';
import { message } from 'antd';

import { getComponentName } from '../../common/helpers';
import http from '../http';

function getErrorMessage(error) {
  let message = 'An error occurred while processing your request';
  if (error.response) {
    // The request was made and the server responded
    // with a status code that falls out of the range of 2xx
    const { data } = error.response;
    if (data.errors) {
      // form submition error
      message = 'Please correct your form inputs';
      error.errors = data.errors;
    } else if (typeof data === 'string') {
      // unknow error message returned from server
      message = data;
    } else if (error.response.status === 401) {
      message = 'You don\'t have permission to perform this action';
    } else {
      // our system generated message
      message = data.message || error.message;
    }
  } else if (error.request) {
    // The request was made but no response was received
    message = 'Error while connecting to server.';
  }
  return message;
}

const withRequest = opts => (WrappedComponent) => {
  const options = {
    // auto execute ajax request when component is mounted
    autoExecute: false,
    // show error message when request fail
    showError: true,
    // axios request options
    requestOptions: {},
    // a function to map the props pass to children component
    mapProps: props => props,
    ...opts,
  };

  class Wrapper extends React.Component {
    state = {
      error: null,
      response: null,
      loading: options.autoExecute,
    }

    componentDidMount() {
      const { autoExecute } = options;
      if (autoExecute) {
        this.execute();
      }
    }

    execute = async (opts = {}) => {
      const axiosOptions = {
        ...options.requestOptions,
        ...opts,
      };
      try {
        this.setState({ loading: true });
        const resp = await http(axiosOptions);
        this.setState({
          response: resp,
          loading: false,
        });
      } catch (error) {
        this.setState({
          error,
          loading: false,
        });
        if (options.showError) {
          message.error(getErrorMessage(error));
        }
        throw error;
      }
    }

    render() {
      const { response, loading, error } = this.state;
      let props = {
        response,
        loading,
        error,
        execute: this.execute,
      };

      props = {
        ...options.mapProps(props),
        ...this.props,
      };
      return <WrappedComponent {...props} />;
    }
  }

  Wrapper.displayName = `WithRequest(${getComponentName(WrappedComponent)})`;
  return Wrapper;
};

export default withRequest;
