import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

const Markers = () => {
  const markerArr = Array(11).fill(null);

  return (
    <div className="markers">
      {
        markerArr.map((el, i) => (
          <span
            className="marker"
            style={{ left: `${i * 10}%` }}
            key={shortid.generate()}
          >
            { i * 10 }
          </span>
        ))
      }
    </div>
  );
};

// const Bar = ({ percent }) => (
//   <div className="bar" style={{ width: `${percent}%` }} />
// );

const Bar = ({ percent, percentAux }) => {
  if (!percent && !percentAux) {
    return (<div className="bar-box" />);
  }
  return (
    <div className="bar-box">
      <div
        className="bar"
        style={{
          width: `${percent}%`,
          background: '#239dff',
          height: 22,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: 'white',
            lineHeight: '22px',
          }}
        >
          {`${percent}%`}
        </span>
      </div>
      <div
        className="bar"
        style={{
          width: `${(100 - percent)}%`,
          background: '#1d415d',
          height: 22,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: 'white',
            lineHeight: '22px',
          }}
        >
          {`${(100 - percent)}%`}
        </span>
      </div>
    </div>
  );
};
Bar.propTypes = {
  percent: PropTypes.any.isRequired,
  percentAux: PropTypes.number,
};
Bar.defaultProps = {
  percentAux: 0,
};

const BarTextContent = ({ currencies }) => (
  <div className="bar-text-content">
    {
        currencies.map(currency => (
          <div
            className="text"
            key={shortid.generate()}
          >
            {currency.label }
          </div>
        ))
      }
  </div>
);
BarTextContent.propTypes = {
  currencies: PropTypes.any.isRequired,
};

const Line = ({ left }) => (
  <div
    className="line"
    style={{ left: `${left}%` }}
  />
);
Line.propTypes = {
  left: PropTypes.any.isRequired,
};

class RateBar extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    this.renderLines = this.renderLines.bind(this);
    this.renderBars = this.renderBars.bind(this);
    this.renderGrid = this.renderGrid.bind(this);
  }

  state = {}

  renderLines() {
    return Array(11).fill(null).map((el, i) => (
      <Line
        left={i * 10}
        key={shortid.generate()}
      />
    ));
  }

  renderBars() {
    const { currencies } = this.props;

    return (
      <div className="rate-bar-groups">
        {
          currencies.map(currency => (
            <Bar
              percent={currency.order}
              percentAux={currency.collection}
              key={shortid.generate()}
            />
          ))
        }
      </div>
    );
  }

  renderGrid(props) {
    return (
      <div className="grid-container">
        <div className="grid-item bold">
          <label
            style={{
              fontSize: '20px',
              color: 'black',
              paddingLeft: '70%',
            }}
          >
            {props.graphTitle}
          </label>
        </div>
        <div className="grid-item">
          <div />
        </div>
        <div className="grid-item">
          <div />
        </div>
        <div className="grid-item">
          <BarTextContent currencies={props.currencies.reverse()} />
        </div>
        <div className="grid-item">
          <div className="bar-lines-container">
            {this.renderLines()}
            {this.renderBars()}
          </div>
        </div>
        <div className="grid-item">
          <div />
        </div>
        <div className="grid-item">
          <div />
        </div>
        <div className="grid-item">
          <Markers />
        </div>
        <div className="grid-item x-axis-label" >
          <label
            style={{
              fontSize: '20px',
              color: 'black',
            }}
          >
            %
          </label>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div style={{ display: 'inline-flex' }}>
            <span className="rate-legend-icon" />
            <span style={{ display: 'inline-block', marginRight: 30 }}>Bin</span>
          </div>
          <div style={{ display: 'inline-flex' }}>
            <span className="rate-legend-icon" style={{ background: '#1d415d' }} />
            <span style={{ display: 'inline-block' }}>Collection</span>
          </div>
        </div>
        { this.renderGrid(this.props) }
      </div>
    );
  }
}

RateBar.propTypes = {
  graphTitle: PropTypes.string.isRequired,
  currencies: PropTypes.any.isRequired,
};

export default RateBar;
