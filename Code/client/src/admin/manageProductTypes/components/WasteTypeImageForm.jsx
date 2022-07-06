import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import InnerDivider from '../../../common/components/InnerDivider';

/* eslint no-underscore-dangle: 0 */

class WasteTypeImageForm extends Component {
  render() {
    const {
      data, openDlg,
    } = this.props;

    return (
      <div>
        <div style={{
          minHeight: 636,
          borderRadius: 3,
          border: 'solid 1px #e2eaf0',
          backgroundColor: '#ffffff',
          padding: 10,
          }}
        >
          <div>
            <span
              style={{
                color: '#239dff',
                fontSize: 20,
                lineHeight: '64px',
                paddingLeft: 24,
              }}
            >
              Product Types
            </span>
          </div>
          <InnerDivider />
          <div className="row">
            <div className="col-xs-5 col-sm-4 col-md-4 col-lg-3">
              <div style={{
                marginTop: '-10px',
                marginLeft: '29px',
                marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#1d415d',
                  }}
                >
                  Image
                </span>
              </div>

            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <div style={{
                marginTop: '-10px',
                marginLeft: '29px',
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#1d415d',
                  }}
                >
                  Type Name
                </span>
              </div>
            </div>
          </div>
          <InnerDivider />
          {
            (data && data.constructor === Array) ? (
              <div>
                {
                  data.map(d => (
                    <div
                      key={shortid.generate()}
                    >
                      <div className="row">
                        <div className="col-xs-5 col-sm-4 col-md-4 col-lg-3">
                          <div
                            onClick={() => openDlg(d._id)}
                          >
                            <img
                              src={d.image}
                              alt={d.name}
                              style={{
                                width: 160,
                                height: 120,
                                marginBottom: 15,
                                cursor: 'pointer',
                                }}
                            />
                          </div>
                        </div>
                        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                          <div
                            style={{
                              lineHeight: '100px',
                              paddingLeft: 30,
                              color: '#666666',
                            }}
                          >
                            <span>{d.name}</span>
                          </div>
                        </div>
                      </div>
                      <InnerDivider />
                    </div>
                  ))
                }
              </div>
            ) : (<div>No data</div>)
          }
        </div>
      </div>
    );
  }
}

WasteTypeImageForm.propTypes = {
  data: PropTypes.any.isRequired,
  openDlg: PropTypes.func.isRequired,
};

WasteTypeImageForm.defaultProps = {

};

export default withRouter(WasteTypeImageForm);
