
import React from 'react';
import PropTypes from 'prop-types';

class SummarySubCard extends React.Component {
  render() {
    const { title, content, footer } = this.props;
    return (
      <div style={{ width: '95%', border: 'solid 1px #e2eaf0' }}>
        <div style={{ height: 110, backgroundColor: '#ffffff', padding: 10 }}>
          <div>
            <span className={title.iconClass} style={title.iconStyle} />
            <span style={title.textStyle}>{title.text}</span>
          </div>
          <div style={{ display: 'flex' }}>
            <span style={content.iconStyle}>{content.iconText}</span>
            <span style={content.textStyle}>{content.text}</span>
            <span style={content.iconStyle} className={`${content.iconClass}`} />
          </div>
        </div>
        <div style={{ lineHeight: '32px', backgroundColor: '#f5fafe' }}>
          <span className={footer.iconClass} style={footer.iconStyle} />
          <span style={footer.iconStyle}>{footer.iconText}</span>
          <span style={footer.textStyle}>{footer.text}</span>
        </div>
      </div>
    );
  }
}

SummarySubCard.propTypes = {
  title: PropTypes.any,
  content: PropTypes.any,
  footer: PropTypes.any,
};

SummarySubCard.defaultProps = {
  title: {
    iconClass: '',
    iconStyle: {},
    text: '123',
  },
  content: {
    iconClass: '',
    iconStyle: {},
    text: '456',
  },
  footer: {
    iconClass: '',
    iconStyle: {},
    iconText: '123',
    text: '789',
  },
};

export default SummarySubCard;
