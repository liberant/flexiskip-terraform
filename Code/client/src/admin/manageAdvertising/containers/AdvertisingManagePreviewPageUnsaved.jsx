import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import queryString from 'query-string';
import { setTitle } from '../../../common/actions';
import iphone from '../../../public/images/iphone7Plus.png';

/* eslint react/no-danger: 0 */

const styleVertical = {
  outerBox: {
    position: 'absolute',
    textAlign: 'center',
    zIndex: 10,
    marginTop: 85,
    marginLeft: 20,
    width: 312,
    height: 504,
    overflow: 'auto',
  },
  image: {
    transform: 'rotate(0deg)',
    width: 311,
    height: 289,
  },
  iphone: {
    transform: 'rotate(0deg)',
    width: 350,
    height: 678,
  },
};

const styleHorizontal = {
  outerBox: {
    position: 'absolute',
    textAlign: 'center',
    zIndex: 10,
    width: 504,
    height: 312,
    overflow: 'auto',
    marginLeft: '-80px',
    marginTop: '-6px',
  },
  image: {

  },
  iphone: {
    transform: 'rotate(-90deg)',
    width: 350,
    height: 678,
    marginTop: '-190px',
  },
};

class AdvertisingManagePreviewPageUnsaved extends Component {
  constructor(props) {
    super(props);

    this.state = {
      advertising: queryString.parse(props.location.search),
    };
  }


  componentDidMount() {
    const {
      setTitle,
    } = this.props;
    setTitle('');
  }

  createMarkup(str) {
    return { __html: str };
  }

  render() {
    const { advertising } = this.state;
    let adStyle = styleVertical;

    if (advertising) {
      if (advertising.section && (advertising.section !== 'Vertical')) {
        adStyle = styleHorizontal;
      }
    }

    return (

      <div style={{ backgroundColor: '#F5FAFE' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 30,
          }}
        >
          <div
            style={{
              width: 300,
              height: 150,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 745.85 181.72">
              <title>blue</title>
              <g id="Layer_2" dataName="Layer 2">
                <g id="Layer_1-2" dataName="Layer 1">
                  <path d="M69,179.44V93.91q0-8-4.23-12.66T50.74,76.57A32.44,32.44,0,0,0,35.66,80v99.44H0V0H35.66V60.35a66.64,66.64,0,0,1,26.52-5.49q21.71,0,32.12,10.73t10.4,27.6v86.25Z" style={{ fill: '#00b5e2' }} />
                  <path d="M179.89,181.72q-53.95,0-53.94-38.86,0-21.94,18.29-31.77t50.52-12.8V92.58q0-9.14-5.6-12.8T173,76.12a65.8,65.8,0,0,0-16.46,2.06A94.09,94.09,0,0,0,141,83.66l-7.77-20.34a113.68,113.68,0,0,1,23.43-7,124.65,124.65,0,0,1,23-2.4q22.85,0,35.66,10.51T228.12,99v73.6q-8,4.34-20.34,6.74A146.91,146.91,0,0,1,179.89,181.72Zm14.86-67q-18.29,1.83-26.86,7.31t-8.57,19.43Q159.32,152,165,157t16.69,5q8,0,13-2.52Z" style={{ fill: '#00b5e2' }} />
                  <path d="M324.12,179.44V93.26q0-7.54-4.12-12.34t-14.17-4.8a44.48,44.48,0,0,0-8,.57,57.33,57.33,0,0,0-7.09,1.94v100.8H255.09V63.09a98.27,98.27,0,0,1,22.63-6.74,160.85,160.85,0,0,1,29-2.4q27.89,0,40.46,10.4T359.78,93v86.4Z" style={{ fill: '#00b5e2' }} /><path d="M443,181.72q-28.58,0-44.57-16.23t-16-46.86q0-29.26,14.92-46.52t39.08-17.26a79.38,79.38,0,0,1,9.8.46q3.42.46,8.2,1.6V0h35.66V172.58a74.46,74.46,0,0,1-19.77,6.86A138.21,138.21,0,0,1,443,181.72Zm11.43-105.6a33.64,33.64,0,0,0-9.77-1.37q-14.09,0-20.56,11.09T417.61,117q0,20.57,6.25,31.32t19.65,10.74q7.49,0,10.9-1.83Z" style={{ fill: '#00b5e2' }} />
                  <path d="M546.53,130.29q3.65,27,29.71,27a84.8,84.8,0,0,0,18.17-1.83,53,53,0,0,0,13.83-4.8l8,22.17a83.58,83.58,0,0,1-18.86,6.4,114.77,114.77,0,0,1-25.26,2.52q-28.11,0-43.77-17.14T512.7,117.49q0-29.26,14.63-46.4t40.92-17.14q26.28,0,39.2,16.91t12.91,48.92ZM566.86,75q-22.63,0-22.63,37.86l43-6.35q0-16.21-5.14-23.86T566.86,75Z" style={{ fill: '#00b5e2' }} />
                  <path d="M643.67,179.44V0h35.66V179.44Z" style={{ fill: '#00b5e2' }} />
                  <path d="M725.5,109.26a19.33,19.33,0,0,1-14.17-5.94,19.6,19.6,0,0,1-5.94-14.4,20,20,0,0,1,5.71-14.4,19.13,19.13,0,0,1,14.4-5.94,20.29,20.29,0,0,1,20.34,20.34,20.29,20.29,0,0,1-20.34,20.34Zm0,72a19.34,19.34,0,0,1-14.17-5.94,19.6,19.6,0,0,1-5.94-14.4,20,20,0,0,1,5.71-14.4,19.13,19.13,0,0,1,14.4-5.94,20.34,20.34,0,1,1,0,40.69Z" style={{ fill: '#00b5e2' }} />
                </g>
              </g>
            </svg>
          </div>
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div style={adStyle.outerBox}>
                <img src={`${advertising.image}`} alt={`${advertising.title}`} style={adStyle.image} />
                <h3>{advertising.title}</h3>
                <div
                  dangerouslySetInnerHTML={this.createMarkup(advertising.content)}
                />
              </div>
              <img src={iphone} alt="privew" style={adStyle.iphone} />
            </div>
          </div>
        </div>
        <footer
          style={{
            marginLeft: 0,
            textAlign: 'right',
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          <div className="pull-right">
            handel: Web Portal by <a target="_blank" href="https://www.handel.group/" rel="noopener noreferrer">handel:</a>
          </div>
          <div className="clearfix" />
        </footer>
      </div>
    );
  }
}

AdvertisingManagePreviewPageUnsaved.propTypes = {
  setTitle: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

AdvertisingManagePreviewPageUnsaved.defaultProps = {};

export default compose(connect(
  null,
  dispatch => ({
    setTitle: title => dispatch(setTitle(title)),
  }),
))(AdvertisingManagePreviewPageUnsaved);
