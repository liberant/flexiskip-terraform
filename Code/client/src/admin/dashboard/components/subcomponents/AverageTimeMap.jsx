import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Australia from './australia';
import SVGMap from './SVGMap/SVGMap';
import { formatPrice } from '../../../../common/helpers';

/**
 * Return the id of the location targeted by the event
 * @param  {Event} event Occured event
 * @return {String}      Id of the location
 */
export function getLocationId(event) {
  return event.target.id;
}

/**
 * Return the name of the location targeted by the event
 * @param  {Event} event Occured event
 * @return {String}      Name of the location
 */
export function getLocationName(event) {
  return event.target.attributes.name.value;
}

export const colorRevenueSet = [
  '#FAD861', '#F9B957', '#F99A4B', '#F97C40',
  '#F75D34', '#F83E28', '#F71F1D',
];

class AverageTimeMap extends Component {
  prepareMapData(map, data) {
    const mapData = map;
    mapData.total = data.total;
    const tmpLocations = mapData.locations.map((l) => {
      const d = data.states.findIndex(s => s.name.toLowerCase() === l.id);
      const value = {
        binReqRev: formatPrice(0),
        colReqRev: formatPrice(0),
        totalRev: formatPrice(0),
      };

      if (d >= 0) {
        value.binReqRev = formatPrice(data.states[d].binReqRev);
        value.colReqRev = formatPrice(data.states[d].colReqRev);
        value.totalRev = formatPrice(data.states[d].totalRev);
      }

      return ({
        ...l,
        style: {
          fill: colorRevenueSet[((d >= 0) && (data.states[d].totalRev > 0)) ? d : 0],
        },
        ...value,
      });
    });
    mapData.locations = tmpLocations;

    return mapData;
  }

  render() {
    const { data } = this.props;

    const mapData = this.prepareMapData(Australia, data);

    return (
      <div style={{
        maxWidth: '600px',
        margin: 'auto',
      }}
      >
        <SVGMap
          map={{
          ...mapData,
          viewBox: '-30.5 4.8 343 272.8',
        }}
          // onLocationClick={this.handleLocationClick}
        />
      </div>
    );
  }
}

AverageTimeMap.propTypes = {
  data: PropTypes.any.isRequired,
  // getClickedLocation: PropTypes.func.isRequired,
};

export default AverageTimeMap;
