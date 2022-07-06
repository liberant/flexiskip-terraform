import React from 'react';
import { number } from 'prop-types';

/* eslint no-nested-ternary: 0 */

const ItemCounterStyles = {
  spanBox: {
    fontSize: 20,
    border: '1px solid white',
    background: 'transparent',
    width: 44,
    height: 44,
    borderRadius: 25,
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: '42px',
    color: 'white',
    marginBottom: 10,
  },
  spanBoxSelected: {
    background: 'white',
    color: '#2298F7',
  },
  hint: {
    display: 'block',
    color: 'white',
  },
  box: {
    textAlign: 'center',
    maxWidth: 120,
  },
  outerBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 10px  10px',
    margin: 'auto',
    width: 800,
  },
};

class ItemCounter extends React.Component {
  render() {
    const { page } = this.props;
    return (
      <div style={ItemCounterStyles.outerBox}>
        <div style={ItemCounterStyles.box}>
          {
            page > 1 ?
              (<span style={ItemCounterStyles.spanBox}><span className="handel-check" /></span>) :
            (
              <span
                style={{ ...ItemCounterStyles.spanBox, ...ItemCounterStyles.spanBoxSelected }}
              >
               1
              </span>)
        }
          <span style={ItemCounterStyles.hint}>Business Details</span>
        </div>
        <div style={ItemCounterStyles.box}>
          {
            page > 2 ?
              (<span style={ItemCounterStyles.spanBox}><span className="handel-check" /></span>) :
              (
                page === 2 ?
                  (
                    <span
                      style={{ ...ItemCounterStyles.spanBox, ...ItemCounterStyles.spanBoxSelected }}
                    >
                      2
                    </span>)
                  :
                  (<span style={{ ...ItemCounterStyles.spanBox }}>2</span>)
              )
          }
          <span style={ItemCounterStyles.hint}>Bank & Payment</span>
        </div>
        <div style={ItemCounterStyles.box}>
          {
            page > 3 ?
              (<span style={ItemCounterStyles.spanBox}><span className="handel-check" /></span>) :
              (
                page === 3 ?
                  (
                    <span
                      style={{ ...ItemCounterStyles.spanBox, ...ItemCounterStyles.spanBoxSelected }}
                    >
                      3
                    </span>)
                  :
                  (<span style={{ ...ItemCounterStyles.spanBox }}>3</span>)
              )
          }
          <span style={ItemCounterStyles.hint}>Contact Details</span>
        </div>
        <div style={ItemCounterStyles.box}>
          {
            page > 4 ?
              (<span style={ItemCounterStyles.spanBox}><span className="handel-check" /></span>) :
              (
                page === 4 ?
                  (
                    <span
                      style={{ ...ItemCounterStyles.spanBox, ...ItemCounterStyles.spanBoxSelected }}
                    >
                      4
                    </span>)
                  :
                  (<span style={{ ...ItemCounterStyles.spanBox }}>4</span>)
              )
          }
          <span style={ItemCounterStyles.hint}>Drivers</span>
        </div>
        <div style={ItemCounterStyles.box}>
          {
            page === 5 ?
              (
                <span
                  style={{ ...ItemCounterStyles.spanBox, ...ItemCounterStyles.spanBoxSelected }}
                >
                  5
                </span>)
              :
              (<span style={{ ...ItemCounterStyles.spanBox }}>5</span>)
          }
          <span style={ItemCounterStyles.hint}>Vehicles</span>
        </div>
      </div>
    );
  }
}

ItemCounter.propTypes = {
  page: number.isRequired,
};

ItemCounter.defaultProps = {

};

export default ItemCounter;
