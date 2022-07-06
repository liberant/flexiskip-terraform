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
  disabled: {
    cursor: 'no-drop'
  },
  spinnerIcon: {
    fontSize: '28px'
  }
};

const Spinner = () => (
  <span>
    <i className="fa fa-circle-o-notch fa-spin fa-3x" style={styles.spinnerIcon} />
  </span>
);

class ActionButton extends React.Component {
  render() {
    const {
      title, handleClick, stylesExtra,
      type, spanName, isLoadingPrintQrCode
    } = this.props;

    if (!title || !handleClick) {
      return (<div />);
    }


    return (
      <div style={{ ...styles.actionCommonButtonBox, ...stylesExtra.boxStyles }}>
        <button
          type={type}
          className="btn btn-default"
          disabled={isLoadingPrintQrCode ? true : false}
          style={ isLoadingPrintQrCode ? { ...styles.actionCommonButton, ...stylesExtra.btnStyles, ...styles.disabled} : { ...styles.actionCommonButton, ...stylesExtra.btnStyles}}
          onClick={handleClick}
        >
          {
            isLoadingPrintQrCode ? <Spinner/> : <span
            className={spanName}
            style={{ fontSize: 28, ...stylesExtra.iconStyles }}
          />
          }

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
  spanName: string,
};
ActionButton.defaultProps = {
  stylesExtra: {},
  type: 'button',
  spanName: 'handel-history',
  handleClick: () => {},
};

export default ActionButton;
