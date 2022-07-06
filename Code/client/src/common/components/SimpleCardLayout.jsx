import React from 'react';
import { bool, func, string, any } from 'prop-types';
import Rating from 'react-rating';
import { InnerDivider, InnerSearch } from './index';

const Styles = {
  box: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 2,
  },
  title: {
    color: '#23ACFF',
    fontSize: 20,
    marginBottom: 8,
  },
};

class SimpleCardLayout extends React.Component {
  render() {
    const {
      ratingPoint,
      title,
      searchFlag,
      children,
      onHandleSearch,
      styles,
      rightHeader,
    } = this.props;
    return (
      <div style={{ ...Styles.box, ...styles.box }}>
        <div
          style={{
            ...Styles.title,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...styles.title,
          }}
        >
          <div>
            <span>{title}</span>
            <span
              style={{ marginLeft: 10, fontSize: 'x-small' }}
            >
              {
                (ratingPoint !== '') ? (
                  <Rating
                    emptySymbol="fa fa-star-o fa-2x"
                    fullSymbol="fa fa-star fa-2x"
                    initialRating={parseFloat(ratingPoint) || 0}
                    readonly
                  />
                ) : null
              }
            </span>
          </div>
          <div>
            {
              searchFlag ? (
                <div>
                  <InnerSearch
                    setSearch={onHandleSearch}
                    mainBoxStyles={{
                      marginTop: 0,
                      marginBottom: 0,
                    }}
                  />
                </div>
              ) : null
            }
          </div>
          <div>
            {rightHeader}
          </div>


        </div>
        <InnerDivider />
        {children}
      </div>
    );
  }
}

SimpleCardLayout.propTypes = {
  ratingPoint: string,
  searchFlag: bool,
  title: string.isRequired,
  children: any.isRequired,
  onHandleSearch: func,
  styles: any,
  rightHeader: any,
};

SimpleCardLayout.defaultProps = {
  ratingPoint: '',
  searchFlag: false,
  onHandleSearch: null,
  styles: {},
  rightHeader: null,
};

export default SimpleCardLayout;
