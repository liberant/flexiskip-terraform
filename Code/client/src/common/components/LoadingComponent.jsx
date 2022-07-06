import React from 'react';
import { bool } from 'prop-types';
import Spinner from './Spinner';

const LoadingComponent = (props) => {
  if (props.isLoading) {
    // While our other component is loading...
    if (props.timedOut) {
      // In case we've timed out loading our other component.
      return (<div>Loader timed out!</div>);
    } else if (props.pastDelay) {
      // Display a loading screen after a set delay.
      return (
        <div className="shell">
          <div className="container">
            <br />
            <Spinner />
          </div>
        </div>
      );
    }
    // Don't flash "Loading..." when we don't need to.
    return null;
  } else if (props.error) {
    // Reload page on first failed load
    if (window.location.href.indexOf('isReload') === -1) {
      if (window.location.href.indexOf('isReload') === -1) {
        window.location.href = `${window.location.href}?isReload=1`;
      } else {
        window.location.href = `${window.location.href}&isReload=1`;
      }
    }

    // If we aren't loading, maybe
    return <div>Error! Component failed to load</div>;
  }
  // This case shouldn't happen... but we'll return null anyways.
  return null;
};

LoadingComponent.propTypes = {
  isLoading: bool,
  timedOut: bool,
  pastDelay: bool,
  error: bool,
};

LoadingComponent.defaultProps = {
  isLoading: false,
  timedOut: false,
  pastDelay: false,
  error: false,
};

export default LoadingComponent;
