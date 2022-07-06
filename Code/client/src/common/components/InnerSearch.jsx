
import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  outerBox: {
    // width: 240,
    textAlign: 'left',
    paddingLeft: 10,
    border: '0px solid #ccc',
    backgroundColor: '#F6F6F6',
    borderRadius: '3px',
  },
  inputBox: {
    borderWidth: 0,
    fontSize: 15,
    backgroundColor: '#F6F6F6',
    height: 44,
  },
  searchBox: {
    position: 'absolute',
    display: 'inline-block',
    // float: 'right',
    marginRight: 8,
    fontSize: 20,
    marginTop: 12,
  },
};

/**
 * Search the special text
 * miss handle function, the previous version is only for memory search.
 * according to the design, it will work with server side search.
 *
 * @param {*} props
 */
const InnerSearch = props => (
  <div style={{ display: 'flex' }} className="innersearch-box">
    <div style={{
      // width: 'calc(100% - 30px)',
      textAlign: 'right',
      marginTop: 30,
      marginBottom: 30,
      minWidth: 200,
      ...props.mainBoxStyles,
      }}
    >
      {props.children}
      <div style={styles.outerBox}>
        <input
          defaultValue={props.defaultValue}
          style={styles.inputBox}
          onChange={(e, newVal) => {
            if (props.setSearch) {
              props.setSearch(e, newVal);
            }
          }}
          placeholder="Search..."
        />
        <span style={styles.searchBox} className="handel-magnifier" />
      </div>
    </div>
  </div>
);

InnerSearch.propTypes = {
  mainBoxStyles: PropTypes.any,
  children: PropTypes.any,
  setSearch: PropTypes.func,
  defaultValue: PropTypes.string,
};

InnerSearch.defaultProps = {
  mainBoxStyles: {},
  children: null,
  setSearch: null,
  defaultValue: null,
};

export default InnerSearch;
