import React from 'react';
import PropTypes from 'prop-types';

class AdsSectionField extends React.Component {
  constructor(props) {
    super(props);

    this.onHandleSectionClick = this.onHandleSectionClick.bind(this);
  }

  onHandleSectionClick(section) {
    const { input } = this.props;
    input.onChange(section);
  }

  render() {
    const {
      input, meta: { touched, error, warning },
      label, required,
      style,
      className = '',
    } = this.props;

    const selectedHorizontal = input.value && input.value.trim().toLowerCase().includes('horizontal');
    const selectedVertical = input.value && input.value.trim().toLowerCase().includes('vertical');

    return (
      <div style={{ marginBottom: 15, paddingLeft: 10, ...style.outerBox }}>
        <label style={style.label}>
          {(required && label) ? `${label} *` : `${label}`}
        </label>
        <div
          className={className}
          style={{
            ...style.inputBox,
          }}
        >
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <span
                style={{ cursor: 'pointer', paddingLeft: 10 }}
                onClick={() => this.onHandleSectionClick('Horizontal')}
              >
                <span
                  className={
                    selectedHorizontal ?
                      'handel-check-circle-fulfill' : 'handel-radio-btn'
                  }
                  style={
                    selectedHorizontal ? { color: '#239dff' } : {}
                  }
                />
                <span>
                  <span
                    className="handel-horizontal"
                    style={{
                      display: 'inline-block',
                      marginLeft: 15,
                      marginRight: 4,
                    }}
                  />
                  <span>Horizontal</span>
                </span>
              </span>

            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <span
                style={{ cursor: 'pointer', paddingLeft: 10 }}
                onClick={() => this.onHandleSectionClick('Vertical')}
              >
                <span
                  className={
                  selectedVertical ?
                    'handel-check-circle-fulfill' : 'handel-radio-btn'
                  }
                  style={
                    selectedVertical ? { color: '#239dff' } : {}
                  }
                />
                <span>
                  <span
                    className="handel-vertical"
                    style={{
                      display: 'inline-block',
                      marginLeft: 15,
                      marginRight: 4,
                    }}
                  />
                  <span>Vertical</span>
                </span>
              </span>

            </div>
          </div>
        </div>
        <div>
          {
            touched &&
            ((error && <span className="text-danger" style={{ ...style.error }}>{error}</span>) ||
              (warning && <span>{warning}</span>))
          }
        </div>
      </div >
    );
  }
}

AdsSectionField.propTypes = {
  input: PropTypes.any.isRequired,
  label: PropTypes.string,
  meta: PropTypes.any.isRequired,
  required: PropTypes.bool,
  style: PropTypes.any,
  className: PropTypes.string,
};

AdsSectionField.defaultProps = {
  label: '',
  required: false,
  style: {},
  className: '',
};

export default AdsSectionField;
