import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import numeral from 'numeral';

import { numberWithCommas } from '../../../common/utils/common';

import SummarySubCard from './subcomponents/SummarySubCard';

const Styles = {
  summary: {
    outerBox: {
      marginBottom: 30,
    },
    title: {
      icon: {
        fontSize: 18,
        paddingRight: 10,
      },
      text: {
        color: '#666666',
        fontSize: 14,
        fontWeight: '600',
      },
    },
    content: {
      icon: {
        display: 'inline-block',
        marginTop: 8,
        fontSize: 20,
        paddingRight: 5,
      },
      text: {
        fontSize: 40,
      },
    },
    footer: {
      icon: {
        fontSize: 14,
        paddingLeft: 10,
        paddingRight: 5,
      },
      text: {
        color: '#666666',
        fontSize: 14,
        paddingLeft: 10,
      },
    },
  },
};

const SummaryArray = [
  // Total Collection Requests
  {
    title: {
      iconClass: 'handel-collection-request',
      iconStyle: {
        color: '#239dff',
        ...Styles.summary.title.icon,
      },
      text: 'Total Collection Requests',
      textStyle: {
        ...Styles.summary.title.text,
      },
    },
    content: {
      text: '0',
      textStyle: {
        color: '#239dff',
        ...Styles.summary.content.text,
      },
    },
    footer: {
      iconClass: 'handel-caret-up',
      iconText: '0.00%',
      iconStyle: {
        color: '#72c814',
        ...Styles.summary.footer.icon,
      },
      text: 'Since Last Month',
      textStyle: {
        ...Styles.summary.footer.text,
      },
    },
  },

  // Average Rating
  {
    title: {
      iconClass: 'handel-star',
      iconStyle: {
        color: '#239dff',
        ...Styles.summary.title.icon,
      },
      text: 'Average Rating',
      textStyle: {
        ...Styles.summary.title.text,
      },
    },
    content: {
      text: '0',
      textStyle: {
        color: '#239dff',
        ...Styles.summary.content.text,
      },
      iconClass: 'handel-star',
      iconStyle: {
        color: '#239dff',
        fontSize: 32,
        display: 'inline-block',
        marginTop: 14,
        marginLeft: 10,
      },
    },
    footer: {
      iconClass: '',
      iconText: '',
      iconStyle: {
        color: '#72c814',
        ...Styles.summary.footer.icon,
      },
      text: '',
      textStyle: {
        ...Styles.summary.footer.text,
      },
    },
  },

  // Average Collection Time
  {
    title: {
      iconClass: 'handel-clock',
      iconStyle: {
        color: '#239dff',
        ...Styles.summary.title.icon,
      },
      text: 'Average Collection Time',
      textStyle: {
        ...Styles.summary.title.text,
      },
    },
    content: {
      text: '00:00',
      textStyle: {
        color: '#239dff',
        ...Styles.summary.content.text,
      },
    },
    footer: {
      iconClass: '',
      iconText: '',
      iconStyle: {
        color: '#72c814',
        ...Styles.summary.footer.icon,
      },
      text: '',
      textStyle: {
        ...Styles.summary.footer.text,
      },
    },
  },

  // Jobs awaiting - 6hrs left
  {
    title: {
      iconClass: 'handel-collection-request',
      iconStyle: {
        color: '#ff9900',
        ...Styles.summary.title.icon,
      },
      text: 'Jobs awaiting - 6hrs left',
      textStyle: {
        ...Styles.summary.title.text,
      },
    },
    content: {
      text: '0',
      textStyle: {
        color: '#ff9900',
        ...Styles.summary.content.text,
      },
    },
    footer: {
      iconClass: '',
      iconText: '',
      iconStyle: {
        ...Styles.summary.footer.icon,
      },
      text: '',
      textStyle: {
        ...Styles.summary.footer.text,
      },
    },
  },

  // Jobs awaiting - 48hrs left
  {
    title: {
      iconClass: 'handel-collection-request',
      iconStyle: {
        color: '#ff9900',
        ...Styles.summary.title.icon,
      },
      text: 'Jobs awaiting - 48hrs left',
      textStyle: {
        ...Styles.summary.title.text,
      },
    },
    content: {
      text: '0',
      textStyle: {
        color: '#ff9900',
        ...Styles.summary.content.text,
      },
    },
    footer: {
      iconClass: '',
      iconText: '',
      iconStyle: {
        ...Styles.summary.footer.icon,
      },
      text: '',
      textStyle: {
        ...Styles.summary.footer.text,
      },
    },
  },

  // Non-conformances
  {
    title: {
      iconClass: 'handel-danger',
      iconStyle: {
        color: '#f06666',
        ...Styles.summary.title.icon,
      },
      text: 'Non-conformances',
      textStyle: {
        ...Styles.summary.title.text,
      },
    },
    content: {
      text: '0',
      textStyle: {
        color: '#f06666',
        ...Styles.summary.content.text,
      },
    },
    footer: {
      iconClass: '',
      iconText: '',
      iconStyle: {
        ...Styles.summary.footer.icon,
      },
      text: '',
      textStyle: {
        ...Styles.summary.footer.text,
      },
    },
  },
];

class SummaryDetailsSubPage extends React.Component {
  shouldComponentUpdate(nextProps) {
    if ((!nextProps.data) || (nextProps.data === this.props.data)) {
      return false;
    }

    const { data } = nextProps;

    // Total Collection Requests
    SummaryArray[0].content.text = data.colReqCount ? `${numberWithCommas(data.colReqCount)}` : '0';
    if (data.revenueSinceLastMonth >= 0) {
      SummaryArray[0].footer.iconClass = 'handel-caret-up';
      SummaryArray[0].footer.iconStyle = {
        color: '#72c814',
        ...Styles.summary.footer.icon,
      };
    } else {
      SummaryArray[0].footer.iconClass = 'handel-caret-down';
      SummaryArray[0].footer.iconStyle = {
        color: 'red',
        ...Styles.summary.footer.icon,
      };
    }

    SummaryArray[0].footer.iconText = data.colReqCountSinceLastMonth ?
      `${(Math.round(data.colReqCountSinceLastMonth * 100) / 100).toFixed(2)}%` : '0.00%';

    // Average Rating
    SummaryArray[1].content.text = data.avgRating ? `${data.avgRating.toFixed(1)}` : '0';

    // Average Collection Time: seconds => hh:mm
    const totalMinutes = parseInt(data.avgColTime, 10) / 60;
    const hours = numeral(totalMinutes / 24).format('00');
    const minutes = numeral(totalMinutes % 24).format('00');
    SummaryArray[2].content.text = `${hours}:${minutes}`;

    // Jobs awaiting - 6hr left
    SummaryArray[3].content.text = data.pendingColReq6h ? `${numberWithCommas(data.pendingColReq6h)}` : '0';

    // Jobs awaiting - 48hr left
    SummaryArray[4].content.text = data.pendingColReq48h ? `${numberWithCommas(data.pendingColReq48h)}` : '0';

    // Non-conformances
    SummaryArray[5].content.text = data.nonConformance ? `${numberWithCommas(data.nonConformance)}` : '0';

    return true;
  }

  render() {
    return (
      <div>
        <div className="row">
          {
            SummaryArray.map(s => (
              <div
                className="col-xs-12 col-sm-6 col-md-6 col-lg-3"
                style={Styles.summary.outerBox}
                key={shortid.generate()}
              >
                <SummarySubCard
                  title={s.title}
                  content={s.content}
                  footer={s.footer}
                />
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

SummaryDetailsSubPage.propTypes = {
  data: PropTypes.any.isRequired,
};

SummaryDetailsSubPage.defaultProps = {

};

export default SummaryDetailsSubPage;
