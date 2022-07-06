import React, { Component } from 'react';
import { compose } from 'redux';

/* eslint import/extensions: 0 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'font-awesome/css/font-awesome.min.css';
import 'gentelella/build/css/custom.min.css';
import './BlankLayout.css';
import Alert from '../../common/components/Alert';
import ErrorBoundary from '../../common/hocs/ErrorBoundary';
import ErrorPage from '../components/ErrorPage';
import HandelTitle from '../../common/components/HandelTitle';

function SimplePageLayout(WrappedComponent) {
  class Wrapper extends Component {
    componentDidMount() {
      if (!document.body.className.includes('login')) {
        document.body.className += ' login';
      }
      if (!document.body.className.includes('blank-layout')) {
        document.body.className += ' blank-layout';
      }
    }

    componentWillUnmount() {
      document.body.className = document.body.className.replace('login', '').replace('blank-layout', '').trim();
    }

    render() {
      return (
        <div>
          <div className="login_wrapper1">
            <div className="animate form login_form">
              <section className="login_content" style={{ margin: 'auto' }}>
                <HandelTitle />
                <Alert />
                <WrappedComponent {...this.props} />
              </section>
            </div>
          </div>
        </div>
      );
    }
  }

  Wrapper.displayName = 'SimplePageLayout';
  return Wrapper;
}

export default compose(
  SimplePageLayout,
  ErrorBoundary(ErrorPage),
);
