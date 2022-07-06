/**
 * source code comes from https://github.com/VictorCazanave/react-svg-map
 *
 * add properties to show Text on the map
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import SVGText from './SVGText';

function SVGMap(props) {
  return (
    <svg className="svg-map" xmlns="http://www.w3.org/2000/svg" viewBox={props.map.viewBox} role="group" aria-label={props.map.label}>
      {props.map.locations.map(location => (
        <React.Fragment key={location.id}>
          <path
            id={location.id}
            className="svg-map__location"
            name={location.name}
            d={location.path}
            onMouseOver={props.onLocationMouseOver}
            onMouseOut={props.onLocationMouseOut}
            onMouseMove={props.onLocationMouseMove}
            onClick={props.onLocationClick}
            onFocus={props.onLocationFocus}
            onBlur={props.onLocationBlur}
            tabIndex={props.tabIndex}
            role={props.type}
            aria-label={location.name}
            aria-checked={props.isLocationSelected && props.isLocationSelected(location)}
            key={location.id}
            style={location.style}
          />
          <g>
            <SVGText
              x={location.title.x}
              y={location.title.y}
              style={location.title.style}
              text={location.id}
              position="center"
            />
            <SVGText
              x={location.title.x}
              y={location.sales.y}
              style={location.sales.style}
              text={location.binReqRev}
              position="left"
              preferText={location.colReqRev}
            />
            <SVGText
              x={location.title.x}
              y={location.collections.y}
              style={location.collections.style}
              text={location.colReqRev}
              position="right"
              preferText={location.binReqRev}
            />
          </g>
        </React.Fragment>
      ))}
    </svg>
  );
}

SVGMap.propTypes = {
  map: PropTypes.shape({
    viewBox: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string,
      id: PropTypes.string,
    })).isRequired,
    label: PropTypes.string,
  }).isRequired,
  tabIndex: PropTypes.string,
  type: PropTypes.string,

  onLocationMouseOver: PropTypes.func,
  onLocationMouseOut: PropTypes.func,
  onLocationMouseMove: PropTypes.func,
  onLocationClick: PropTypes.func,
  onLocationFocus: PropTypes.func,
  onLocationBlur: PropTypes.func,
  isLocationSelected: PropTypes.func,
};

SVGMap.defaultProps = {
  tabIndex: '0', // Focusable locations
  type: 'none',
  onLocationMouseOver: null,
  onLocationMouseOut: null,
  onLocationMouseMove: null,
  onLocationClick: null,
  onLocationFocus: null,
  onLocationBlur: null,
  isLocationSelected: null,

};

export default SVGMap;
