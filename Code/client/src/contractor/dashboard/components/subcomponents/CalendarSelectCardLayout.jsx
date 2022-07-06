import React from 'react';
import { func, string, any } from 'prop-types';
import { InnerDivider, Calendar } from '../../../../common/components';

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

class CalendarSelectCardLayout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.startDate = '';
    this.endDate = '';
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
  }

  handleCalendarChange(data) {
    const { startDate, endDate } = data;
    if (!startDate || !endDate) {
      return;
    }

    this.startDate = startDate.substr(0, 10);
    this.endDate = endDate.substr(0, 10);

    const { filterData } = this.props;
    if (filterData) {
      filterData({
        startDate: this.startDate,
        endDate: this.endDate,
      });
    }
  }

  render() {
    const {
      title, children, styles,
      rightStyle,
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
          <div style={{ maxWidth: 210 }}>
            <span>{title}</span>
          </div>
          <div>
            <Calendar
              rightStyle={rightStyle}
              filterData={this.handleCalendarChange}
            />
          </div>
        </div>
        <InnerDivider />
        {children}
      </div>
    );
  }
}

CalendarSelectCardLayout.propTypes = {
  title: string.isRequired,
  children: any.isRequired,
  styles: any,
  filterData: func.isRequired,
  rightStyle: any,
};

CalendarSelectCardLayout.defaultProps = {
  styles: {},
  rightStyle: {
    custom: 0,
    normal: 0,
  },
};

export default CalendarSelectCardLayout;
