import React, { Component } from 'react';
import IdleTimer from 'react-idle-timer';
import { string, func } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import $ from 'jquery';

/* eslint func-names: 0 */
/* eslint import/extensions:0 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'font-awesome/css/font-awesome.min.css';
import 'gentelella/build/css/custom.min.css';
import LoginRequired from '../../common/hocs/LoginRequired';
import ErrorBoundary from '../../common/hocs/ErrorBoundary';
import ErrorPage from '../components/ErrorPage';
import Sidebar from './AdminLayout/Sidebar';
import TopNav from './AdminLayout/TopNav';
import Alert from '../../common/components/Alert';
import { clearIdentity } from '../../common/actions';
import { IDLE_TIMEOUT } from '../../common/constants/params';

function AdminLayout(WrappedComponent) {
  class Wrapper extends Component {
    constructor(props) {
      super(props);
      this.idleTimer = null;
      this.onIdle = this._onIdle.bind(this);
    }

    componentDidMount() {
      const $BODY = $('body');
      if (!$BODY.hasClass('nav-sm') && !$BODY.hasClass('nav-md')) {
        $('body').addClass('nav-md');
      }
      this.initSidebar();
    }

    componentWillUnmount() {
      $('body').removeClass('nav-md');
    }

    _onIdle() {
      this.props.logout();
    }

    initSidebar() {
      const CURRENT_URL = window.location.href.split('#')[0].split('?')[0];
      const $BODY = $('body');
      const $MENU_TOGGLE = $('#menu_toggle');
      const $SIDEBAR_MENU = $('#sidebar-menu');
      const $SIDEBAR_FOOTER = $('.sidebar-footer');
      const $LEFT_COL = $('.left_col');
      const $RIGHT_COL = $('.right_col');
      const $NAV_MENU = $('.nav_menu');
      const $FOOTER = $('footer');
      const $ACTIVEMENU = $('active');

      // TODO: This is some kind of easy fix, maybe we can improve this
      function setContentHeight() {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        const bodyHeight = $BODY.outerHeight();
        const footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height();
        const leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height();
        let contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
      }

      /**
       * This will toggle the side bar menu on, or off, according to the given toggleOn value
       * @param {Boolean} toggleOn true to toggle the Side bar on, and vice versa
       */
      function toggleSideBarOn(toggleOn) {
        if (!toggleOn) {
          $SIDEBAR_MENU.find('li.active ul').hide();
          $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
          $SIDEBAR_MENU.find('li.active-sm ul').show();
          $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        if ($BODY.hasClass('nav-md')) {
          $BODY.removeClass('nav-md');
          $BODY.addClass('nav-sm');
        } else if ($BODY.hasClass('nav-sm')) {
          $BODY.removeClass('nav-sm');
          $BODY.addClass('nav-md');
        }

        setContentHeight();
      }

      $SIDEBAR_MENU.find('a').on('click', function () {
        const $li = $(this).parent();

        if ($li.is('.active')) {
          $li.removeClass('active active-sm');
          $('ul:first', $li).slideUp(() => {
            setContentHeight();
          });
        } else {
          // prevent closing menu if we are on child menu
          if (!$li.parent().is('.child_menu')) {
            $SIDEBAR_MENU.find('li').removeClass('active active-sm');
            $SIDEBAR_MENU.find('li ul').slideUp();
          } else if ($BODY.is('.nav-sm')) {
            $SIDEBAR_MENU.find('li').removeClass('active active-sm');
            $SIDEBAR_MENU.find('li ul').slideUp();
          }
          $li.addClass('active');

          $('ul:first', $li).slideDown(() => {
            setContentHeight();
          });
        }
      });

      // toggle small or large menu
      $MENU_TOGGLE.on('click', () => {
        if ($BODY.hasClass('nav-md')) {
          toggleSideBarOn(false);
        } else {
          toggleSideBarOn(true);
        }
      });

      // check active menu
      $SIDEBAR_MENU.find(`a[href="${CURRENT_URL}"]`)
        .parent('li')
        .addClass('current-page');

      $SIDEBAR_MENU.find('a').filter(function () {
        if (this.href === CURRENT_URL) {
          const $li = $(this).parent();
          $li.find('.menu-label')[0].className = 'menu-label text-bold';
          return true;
        }
        const $li = $(this).parent();
        $li.find('.menu-label')[0].className = 'menu-label text-thin';

        return false;
      }).parent('li').addClass('current-page')
        .parents('ul')
        .slideDown(() => {
          setContentHeight();
        })
        .parent()
        .addClass('active');

      // recompute content when resizing
      $(window).resize(() => {
        setContentHeight();
      });

      setContentHeight();
    }

    render() {
      const { title, ...passThroughProps } = this.props;

      return (
        <div className="container body">
          <div className="main_container">
            <IdleTimer
              ref={(ref) => { this.idleTimer = ref; }}
              onIdle={this.onIdle}
              debounce={250}
              timeout={IDLE_TIMEOUT}
            />
            <div className="col-md-3 left_col">
              <div className="left_col scroll-view">
                <div
                  className="navbar nav_title"
                  style={{
                    border: 0,
                    background: '#239DFF',
                    textAlign: 'center',
                    height: 100,
                    padding: '10% 15%',
                  }}
                >
                  <Link to="/admin/dashboard" className="site_title" style={{ paddingLeft: 0 }}>
                    <svg viewBox="0 0 231 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                      <title>Combined Shape Copy</title>
                      <desc>Created with Sketch.</desc>
                      <defs />
                      <g id="version-3" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="Splash-screen-Copy-2" transform="translate(-72.000000, -190.000000)" fill="#FFFFFF">
                          <path d="M93.6434096,242.66464 L102.788091,242.66464 L102.788091,217.977274 C102.788091,211.233336 98.4754787,207.368999 90.9526982,207.368999 C88.3591514,207.368999 85.8982716,207.898667 83.4224435,208.993438 L82.4844316,209.405609 L82.4844316,191.337225 L73.33975,191.337225 L73.33975,242.66464 L82.4844316,242.66464 L82.4844316,213.678386 L82.8450617,213.488154 C84.2969247,212.729088 85.7207594,212.406438 87.5911775,212.406438 C91.4983147,212.406438 93.6434096,214.452373 93.6434096,218.173102 L93.6434096,242.66464 Z M104.125973,244 L92.3055281,244 L92.3055281,218.173102 C92.3055281,215.192789 90.7621061,213.743662 87.5911775,213.743662 C86.0888637,213.743662 84.9658654,213.965601 83.8241816,214.497133 L83.8241816,244 L72,244 L72,190 L83.8241816,190 L83.8241816,207.376459 C86.1598686,206.471921 88.4974241,206.031775 90.9526982,206.031775 C99.2042131,206.031775 104.125973,210.49292 104.125973,217.977274 L104.125973,244 Z M131.526383,224.299344 C127.942505,224.659294 125.309719,225.3736 123.629893,226.447855 C121.950067,227.522111 121.10922,229.422574 121.10922,232.147379 C121.10922,234.206369 121.667916,235.724501 122.789046,236.709235 C123.912044,237.6977 125.547025,238.190067 127.699594,238.190067 C129.269175,238.190067 130.541658,237.940153 131.526383,237.449651 L131.526383,224.299344 Z M127.161452,243.954866 C116.585461,243.954866 111.295597,240.153941 111.295597,232.553955 C111.295597,228.256932 113.087536,225.151661 116.671414,223.225088 C120.255292,221.305975 125.212554,220.052677 131.526383,219.470788 L131.526383,217.792264 C131.526383,216.003702 130.980767,214.752269 129.885797,214.032369 C128.783353,213.318063 127.206297,212.963708 125.145287,212.963708 C123.486015,212.963708 121.871588,213.159536 120.302006,213.567977 C118.732425,213.965228 117.209557,214.50422 115.733402,215.1719 L113.448166,209.203813 C115.55589,208.31233 117.854206,207.624135 120.333771,207.159743 C122.82268,206.687891 125.074282,206.451033 127.096052,206.451033 C131.573097,206.451033 135.071022,207.480528 137.578615,209.537653 C140.086209,211.594778 141.340006,214.974207 141.340006,219.674076 L141.340006,241.274822 C139.772293,242.12714 137.782287,242.781764 135.360647,243.253616 C132.937138,243.725468 130.207187,243.954866 127.161452,243.954866 Z M171.457474,243.286627 L171.457474,217.994992 C171.457474,216.516025 171.050131,215.309353 170.242917,214.373109 C169.435704,213.429405 168.051108,212.965013 166.074183,212.965013 C165.089457,212.965013 164.308404,213.017234 163.725416,213.129136 C163.14056,213.239172 162.44546,213.429405 161.643852,213.697969 L161.643852,243.286627 L151.153815,243.286627 L151.153815,209.137977 C153.039181,208.28566 155.25715,207.623575 157.809588,207.159184 C160.363896,206.687332 163.205959,206.452338 166.343254,206.452338 C171.812499,206.452338 175.777561,207.472508 178.245915,209.505388 C180.706795,211.541998 181.940037,214.346999 181.940037,217.924121 L181.940037,243.286627 L171.457474,243.286627 Z M211.651283,212.964267 C210.765591,212.695704 209.807025,212.557692 208.78306,212.557692 C206.019475,212.557692 204.00331,213.645002 202.730828,215.814029 C201.463951,217.983056 200.832381,221.036106 200.832381,224.967583 C200.832381,228.996042 201.443397,232.062147 202.66356,234.160303 C203.893066,236.262188 205.815803,237.317794 208.448589,237.317794 C209.917269,237.317794 210.982343,237.133156 211.651283,236.780666 L211.651283,212.964267 Z M208.289763,243.955426 C202.691588,243.955426 198.319182,242.370153 195.181888,239.192146 C192.042724,236.019735 190.480617,231.433633 190.480617,225.43757 C190.480617,219.711936 191.938085,215.165 194.866103,211.78557 C197.79412,208.409871 201.620909,206.720156 206.359551,206.720156 C207.607742,206.720156 208.571914,206.764917 209.240854,206.858168 C209.911664,206.942094 210.713271,207.098757 211.651283,207.32256 L211.651283,190.621241 L222.141321,190.621241 L222.141321,241.275382 C220.433466,242.166865 218.497649,242.842005 216.324526,243.285881 C214.151403,243.731623 211.473771,243.955426 208.289763,243.955426 Z M246.60624,212.623713 C242.168435,212.623713 239.948598,216.331388 239.948598,223.735546 L252.593073,221.874249 C252.593073,218.703702 252.088564,216.370553 251.077679,214.871071 C250.072399,213.377184 248.583165,212.623713 246.60624,212.623713 Z M240.626881,228.858776 C241.342536,234.140533 244.255605,236.781412 249.364219,236.781412 C251.292562,236.781412 253.071421,236.602369 254.706402,236.244284 C256.346989,235.882469 257.699819,235.418077 258.776103,234.834323 L261.126739,241.339539 C259.603871,242.10047 257.759612,242.730849 255.586489,243.221351 C253.40776,243.711853 250.931932,243.954307 248.155268,243.954307 C242.641178,243.954307 238.354725,242.277647 235.28283,238.922463 C232.210934,235.569144 230.680592,230.962527 230.680592,225.104476 C230.680592,219.378842 232.111901,214.837501 234.980125,211.484182 C237.848348,208.128998 241.860124,206.450473 247.013584,206.450473 C252.167043,206.450473 256.006913,208.108482 258.540666,211.418906 C261.074419,214.725599 262.341296,219.514989 262.341296,225.772156 L240.626881,228.858776 Z M271.072654,243.286441 L281.555217,243.286441 L281.555217,190.6218 L271.072654,190.6218 L271.072654,243.286441 Z M297.020641,243.823755 C295.406215,243.823755 294.014145,243.241866 292.851907,242.079954 C291.684064,240.914312 291.099208,239.506217 291.099208,237.855668 C291.099208,236.197658 291.66351,234.787698 292.779034,233.622056 C293.902032,232.462009 295.312787,231.88012 297.020641,231.88012 C298.674308,231.88012 300.086931,232.462009 301.254775,233.622056 C302.417013,234.787698 303,236.197658 303,237.855668 C303,239.506217 302.417013,240.914312 301.254775,242.079954 C300.086931,243.241866 298.674308,243.823755 297.020641,243.823755 M297.020641,222.687401 C295.406215,222.687401 294.014145,222.111107 292.851907,220.9436 C291.684064,219.783553 291.099208,218.375458 291.099208,216.717448 C291.099208,215.061304 291.66351,213.651344 292.779034,212.493162 C293.902032,211.325654 295.312787,210.749361 297.020641,210.749361 C298.674308,210.749361 300.086931,211.325654 301.254775,212.493162 C302.417013,213.651344 303,215.061304 303,216.717448 C303,218.375458 302.417013,219.783553 301.254775,220.9436 C300.086931,222.111107 298.674308,222.687401 297.020641,222.687401" id="Combined-Shape-Copy" />
                        </g>
                      </g>
                    </svg>
                  </Link>
                </div>

                <div className="clearfix" />
                <br />

                <Sidebar />
              </div>
            </div>

            <TopNav />

            <div className="right_col" role="main" style={{ backgroundColor: '#F5FAFE' }}>
              <div className="">
                <div className="row">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <Alert />
                    <WrappedComponent {...passThroughProps} />
                  </div>
                </div>
              </div>
            </div>

            <footer>
              <div className="pull-right">
                handel: Web Portal by <a target="_blank" href="https://www.handel.group/" rel="noopener noreferrer">handel:</a>
              </div>
              <div className="clearfix" />
            </footer>

          </div>
        </div>
      );
    }
  }

  Wrapper.propTypes = {
    title: string,
    logout: func.isRequired,
  };

  Wrapper.defaultProps = {
    title: 'handel:',
  };

  Wrapper.displayName = 'AdminLayout';
  return Wrapper;
}

export default compose(
  LoginRequired('/login'),
  connect(
    state => ({
      title: state.common.title,
    }),
    dispatch => ({
      logout: () => dispatch(clearIdentity()),
    }),
  ),
  AdminLayout,
  ErrorBoundary(ErrorPage),
);
