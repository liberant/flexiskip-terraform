import React from 'react';
import { any, func, string } from 'prop-types';

const styles = {
  actionCommonButtonBox: {
    textAlign: 'center',
    display: 'inline-block',
    marginRight: 30,
  },

  actionCommonButton: {
    // display: 'inline-block',
    lineHeight: '29px',
    // fontSize: 14,
    padding: '12px 15px',
    border: '0px solid #239DFF',
    color: '#F9FCFE',
    backgroundColor: '#f06666',
    cursor: 'pointer',
    // marginRight: 10,
    borderRadius: '36px',
  },
};

class ActionButton extends React.Component {
  render() {
    const {
      title, handleClick, stylesExtra,
      type, children,
    } = this.props;

    if (!title || !handleClick) {
      return (<div />);
    }


    return (
      <div style={{ ...styles.actionCommonButtonBox, ...stylesExtra.boxStyles }}>
        <button
          type={type}
          className="btn btn-default"
          style={{ ...styles.actionCommonButton, ...stylesExtra.btnStyles }}
          onClick={handleClick}
        >
          {children}
        </button>
        <div style={{ ...styles.buttonText, ...stylesExtra.titleStyles }}>{title}</div>
      </div>
    );
  }
}

ActionButton.propTypes = {
  title: string.isRequired,
  stylesExtra: any,
  handleClick: func,
  type: string,
  children: any.isRequired,
};
ActionButton.defaultProps = {
  stylesExtra: {},
  type: 'button',
  handleClick: () => {},
};

export default ActionButton;
