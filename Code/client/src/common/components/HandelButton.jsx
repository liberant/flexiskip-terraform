import React from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import { Link } from "react-router-dom";

import styles from "./CircleButton.m.css";

const colorMap = {
  darkBlue: "#1d415d",
  red: "#f06666",
  green: "#72c814",
  orange: "#f6ba1a",
  blue: "#239dff",
  white: "#fff",
};

function getHexColor(color) {
  return colorMap[color] ? colorMap[color] : false;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

class HandelButton extends React.Component {
  render() {
    const {
      bgColor,
      borderColor,
      iconColor,
      shadowColor,
      label,
      size,
      loading,
      children,
      href,
      htmlType,
      visible,
      style,
      handleClose,
      // onClick,
      ...props
    } = this.props;
    // console.log('props :>> ', {...props});

    if (!visible) return null;

    const buttonStyles = {
      backgroundColor: getHexColor(bgColor),
      color: getHexColor(iconColor),
      border: "none",
      boxShadow: "none",
      ...style,
    };
    if (shadowColor) {
      const color = hexToRgb(getHexColor(shadowColor));
      buttonStyles.boxShadow = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3) 4px 4px 8px 0px`;
    }
    if (borderColor) {
      buttonStyles.border = `1px solid ${getHexColor(borderColor)}`;
    }

    let btn = (
      <button
        type={htmlType}
        className={styles.button}
        style={buttonStyles}
        {...props}
      >
        {loading ? <Icon type="loading" /> : children}
      </button>
    );
    if (href) {
      if (href.indexOf("http") === 0) {
        btn = (
          <a
            href={href}
            className={styles.button}
            style={buttonStyles}
            {...props}
          >
            {children}
          </a>
        );
      } else {
        btn = (
          <Link to={href} className={styles.button} style={buttonStyles}>
            {children}
          </Link>
        );
      }
    }
    return (
      <div
        className={styles.container}
        style={props.containerStyle}
        onClick={handleClose}
      >
        {btn}
        {label && <div className={styles.label}>{label}</div>}
      </div>
    );
  }
}

HandelButton.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  size: PropTypes.string,
  loading: PropTypes.bool,

  bgColor: PropTypes.string,
  borderColor: PropTypes.string,
  shadowColor: PropTypes.string,
  iconColor: PropTypes.string,

  htmlType: PropTypes.string,
  visible: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

HandelButton.defaultProps = {
  children: null,
  label: "",
  iconColor: "white",
  bgColor: "blue",
  borderColor: "",
  shadowColor: "blue",
  size: "large",
  loading: false,
  href: "",
  htmlType: "button",
  visible: true,
};

export default HandelButton;
