import React from 'react';

const textStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 24,
  fontWeight: 600,
  height: 400,
  margin: '0 15px',
};

class NotFoundPage extends React.PureComponent {
  render() {
    return (
      <div style={textStyles}>
        The feature you are looking for is not implemented yet.
      </div>
    );
  }
}

export default NotFoundPage;
