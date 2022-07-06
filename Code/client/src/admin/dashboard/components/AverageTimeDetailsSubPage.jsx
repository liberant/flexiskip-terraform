
import React from 'react';
import PropTypes from 'prop-types';
import CalendarSelectCardLayout from './subcomponents/CalendarSelectCardLayout';
import AverageTimeMap from './subcomponents/AverageTimeMap';
import { formatPrice } from '../../../common/helpers';

const LayoutStyles = {
  box: {
    height: 702,
    borderRadius: 3,
    border: 'solid 1px #e2eaf0',
  },
  nationTitle: {
    display: 'inline-block',
    width: 157,
    color: '#666666',
  },
  nationData: {
    fontWeight: '600',
  },
};

class AverageTimeDetailsSubPage extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   selectedLocation: '',
    //   selectedLocationId: '',
    // };

    this.handleFilterData = this.handleFilterData.bind(this);
    // this.getClickedLocation = this.getClickedLocation.bind(this);
  }

  // getClickedLocation(data) {
  //   const { selectedLocation, selectedLocationId } = data;

  //   if (selectedLocation && selectedLocationId) {
  //     this.setState({
  //       selectedLocation,
  //       selectedLocationId,
  //     });
  //   }
  // }

  handleFilterData(data) {
    const { startDate, endDate } = data;
    if (!startDate || !endDate) {
      return;
    }

    const { filterData } = this.props;

    if (filterData) {
      filterData({
        startDate,
        endDate,
      });
    }
  }


  render() {
    const { data } = this.props;

    return (
      <div>
        <CalendarSelectCardLayout
          styles={LayoutStyles}
          title="Map View"
          filterData={this.handleFilterData}
        >
          <div>
            <AverageTimeMap
              data={data}
              // getClickedLocation={this.getClickedLocation}
            />
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#666666',
                  marginBottom: 10,
                }}
              >
                Nationwide
              </div>
              <div>
                <span style={LayoutStyles.nationTitle}>Bin Request</span>
                <span
                  style={{
                    ...LayoutStyles.nationData,
                    color: '#239dff',
                  }}
                >
                  {formatPrice(data.total.binReqRev)}
                </span>
              </div>
              <div>
                <span style={LayoutStyles.nationTitle}>Collection Request</span>
                <span
                  style={{
                    ...LayoutStyles.nationData,
                    color: '#1d415d',
                  }}
                >
                  {formatPrice(data.total.colReqRev)}
                </span>
              </div>
              <div>
                <span style={LayoutStyles.nationTitle}>Total Revenue</span>
                <span
                  style={{
                    ...LayoutStyles.nationData,
                    color: '#f75d34',
                  }}
                >
                  {formatPrice(data.total.totalRev)}
                </span>
              </div>
            </div>
          </div>
        </CalendarSelectCardLayout>
      </div>
    );
  }
}

AverageTimeDetailsSubPage.propTypes = {
  data: PropTypes.any.isRequired,
  filterData: PropTypes.func.isRequired,
};

AverageTimeDetailsSubPage.defaultProps = {

};

export default AverageTimeDetailsSubPage;
