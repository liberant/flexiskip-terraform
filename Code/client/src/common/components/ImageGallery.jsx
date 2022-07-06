/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export default class ImageGallery extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      original: PropTypes.string,
      thumbnail: PropTypes.string,
    })).isRequired,
  }

  state = {
    itemIndex: 0,
    isOpen: false,
  }

  showImage(index) {
    this.setState({
      itemIndex: index,
      isOpen: true,
    });
  }

  render() {
    const { itemIndex, isOpen } = this.state;
    const { items } = this.props;
    const nextIndex = (itemIndex + 1) % items.length;
    const prevIndex = ((itemIndex + items.length) - 1) % items.length;
    const hrefStyle = {
      border: '1px solid #e2eaf0',
      margin: '0 20px 20px 0',
      display: 'inline-block',
    };
    const imgStyle = {
      width: '150px',
      height: '150px',
      objectFit: 'contain',
    };
    return (
      <React.Fragment>
        {items.map((item, index) => (
          <a onClick={() => this.showImage(index)} key={index} style={hrefStyle}>
            <img src={item.thumbnail} alt="" style={imgStyle} />
          </a>
        ))}
        {isOpen && (
          <Lightbox
            mainSrc={items[itemIndex].original}
            nextSrc={items[nextIndex].original}
            prevSrc={items[prevIndex].original}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({ itemIndex: prevIndex })
            }
            onMoveNextRequest={() =>
              this.setState({ itemIndex: nextIndex })
            }
          />
        )}
      </React.Fragment>
    );
  }
}

