import React from 'react';
import PropTypes from 'prop-types';

/* eslint react/no-did-mount-set-state: 0 */

const paddingHorizonBuffer = 5;
const maxLenghtShowAsSameLine = 6;
const paddingVerticalBuffer = 12;

class SVGText extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      x: props.x,
      y: props.y,
    };

    this.setRef = this.setRef.bind(this);
  }

  componentDidMount() {
    this.relocate();
  }

  componentDidUpdate() {
    this.relocate();
  }

  setRef(el) {
    this.textRef = el;
  }

  relocate() {
    const {
      position, x, y, preferText,
    } = this.props;
    if (this.textRef && this.textRef.getBBox()) {
      const width = Math.floor(this.textRef.getBBox().width);
      const originX = Number(x);
      const originY = Number(y);

      if (preferText === null || !this.decideRepositionText()) {
        if (position === 'center') {
          this.setState({
            x: originX - (width / 2),
            y: originY,
          });
        } else if (position === 'left') {
          this.setState({
            x: originX - (width + paddingHorizonBuffer),
            y: originY,
          });
        } else if (position === 'right') {
          this.setState({
            x: originX + paddingHorizonBuffer,
            y: originY,
          });
        }
      } else {
        if (position === 'left') {
          this.setState({
            x: originX - (width / 2),
            y: originY,
          });
        }
        if (position === 'right') {
          this.setState({
            x: originX - (width / 2),
            y: originY + paddingVerticalBuffer,
          });
        }
      }
    }
  }

  decideRepositionText() {
    const { text, preferText } = this.props;
    return text.length > maxLenghtShowAsSameLine || preferText.length > maxLenghtShowAsSameLine;
  }

  render() {
    const { style, text } = this.props;
    const { x, y } = this.state;
    return (
      <text
        x={`${x}`}
        y={`${y}`}
        style={style}
        ref={this.setRef}
      >
        {text}
      </text>
    );
  }
}

SVGText.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['center', 'left', 'right']),
  preferText: PropTypes.string,
};

SVGText.defaultProps = {
  position: 'center',
  preferText: null,
};

export default SVGText;
