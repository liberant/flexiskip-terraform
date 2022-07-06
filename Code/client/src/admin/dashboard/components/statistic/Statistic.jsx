
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.m.css';

class Statistic extends React.Component {
  render() {
    const { title, children, footer } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={`${styles.headerIcon} ${title.iconClass}`} />
          {title.text}
        </div>
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.footer}>
          <span className={`${styles.footerIconText} ${footer.iconTextClass}`}>
            <span className={`${styles.footerIcon} ${footer.iconClass}`} />
            {footer.iconText}
          </span>
          <span className={styles.footerText}>{footer.text}</span>
        </div>
      </div>
    );
  }
}

Statistic.propTypes = {
  title: PropTypes.any,
  footer: PropTypes.any,
  children: PropTypes.any.isRequired,
};

Statistic.defaultProps = {
  title: {
    iconClass: '',
    text: '',
  },
  footer: {
    iconClass: '',
    iconText: '',
    text: '',
  },
};

export default Statistic;
