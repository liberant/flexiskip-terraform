import React from 'react';
import PropTypes from 'prop-types';

function withInterval(timeDelay) {
  class WithIntervalComponent extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        time: 0,
      };
    }

    componentDidMount() {
      this.intervalInstance = setInterval(() => {
        this.setState({
          time: this.state.time + 1,
        });
      }, timeDelay);
    }

    componentWillUnmount() {
      if (this.intervalInstance) {
        clearInterval(this.intervalInstance);
      }
    }

    intervalInstance = null;

    render() {
      const { callback } = this.props;
      return (
        <React.Fragment key={this.state.time}>
          {callback()}
        </React.Fragment>
      );
    }
  }

  WithIntervalComponent.propTypes = {
    callback: PropTypes.func.isRequired,
  };

  return WithIntervalComponent;
}

export default withInterval;
