'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactstrap = require('reactstrap');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STDForm = function (_Component) {
  _inherits(STDForm, _Component);

  _createClass(STDForm, [{
    key: '_formUrl',
    value: function _formUrl() {
      return 'https://docs.google.com/forms/d/e/' + '1FAIpQLSeWSgVlPi0Dr4X4TkEuUnB' + '__cXvXgAu6lihO8yMwunCAPFcRA/formResponse';
    }
  }]);

  function STDForm(props) {
    _classCallCheck(this, STDForm);

    var _this = _possibleConstructorReturn(this, (STDForm.__proto__ || Object.getPrototypeOf(STDForm)).call(this, props));

    _this.formMetadata = {
      url: _this._formUrl(),
      hiddenInputs: [{ fvv: '1' }, { fbzx: '-6547932234106580119' }],
      contactFields: {
        name: 'entry.337167177',
        email: 'entry.296559339',
        phone: 'entry.1898598422'
      },
      mailingFields: {
        address: 'entry.2136643779',
        city: 'entry.836010392',
        state: 'entry.792904564',
        postal: 'entry.2061755036',
        country: 'entry.1913603795'
      },
      stateList: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'],
      countryList: ['US', 'UK']
    };

    _this.alertText = {
      success: 'Thank you!',
      warning: 'Oops. Something isn\'t quite right.'
    };

    _this.state = {
      name: undefined,
      email: undefined,
      phone: undefined,
      address: undefined,
      city: undefined,
      state: undefined,
      postal: undefined,
      country: undefined,
      displaySuccess: false,
      displayWarning: false
    };

    _this.formSubmit = _this.formSubmit.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.serializeForm = _this.serializeForm.bind(_this);
    _this.toggleAlert = _this.toggleAlert.bind(_this);
    _this.resetForm = _this.resetForm.bind(_this);
    return _this;
  }

  _createClass(STDForm, [{
    key: 'serializeForm',
    value: function serializeForm() {
      var _this2 = this;

      var contactFields = Object.keys(this.formMetadata.contactFields);
      var mailingFields = Object.keys(this.formMetadata.mailingFields);
      var formData = _lodash2.default.concat(contactFields, mailingFields).map(function (key, index) {
        var param = '';
        index > 0 ? param += '&' : null;
        var name = _this2.formMetadata.contactFields[key] || _this2.formMetadata.mailingFields[key];
        return param + (name + '=' + encodeURIComponent(_this2.refs[key].props.value));
      });
      var hiddenFields = this.formMetadata.hiddenInputs.map(function (obj) {
        var kvPair = _lodash2.default.toPairs(obj)[0];
        return '&' + kvPair[0] + '=' + kvPair[1];
      });

      return _lodash2.default.concat(formData, hiddenFields).join('');
    }
  }, {
    key: 'validateForm',
    value: function validateForm() {
      for (var ref in this.refs) {
        if (!this.refs[ref].props.value) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: 'formSubmit',
    value: function formSubmit(e) {
      var _this3 = this;

      e.preventDefault();
      if (!this.validateForm()) {
        this.displayAlert('warning');
        return false;
      } else {
        _axios2.default.post(this.formMetadata.url, this.serializeForm())
        // success - will not fire due to false-negative CORS error
        .then(function (data) {
          console.log('fake success', data);
          return false;
        })
        // handle success in error block
        .catch(function (data) {
          console.log('success', data);
          _this3.resetForm();
          _this3.displayAlert('success');
        });
      }
    }
  }, {
    key: 'displayAlert',
    value: function displayAlert(type) {
      var _this4 = this;

      this.toggleAlert(type);
      setTimeout(function () {
        _this4.toggleAlert(type);
      }, 3000);
    }
  }, {
    key: 'toggleAlert',
    value: function toggleAlert(alertType) {
      var stateKey = 'display' + _lodash2.default.capitalize(alertType);
      var alertState = {};
      alertState[stateKey] = !this.state[stateKey];
      this.setState(alertState);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(e) {
      var inputUpdate = {};
      inputUpdate[e.target.id] = e.target.value;
      this.setState(inputUpdate);
    }
  }, {
    key: 'resetForm',
    value: function resetForm() {
      this.setState({
        name: undefined,
        email: undefined,
        phone: undefined,
        address: undefined,
        city: undefined,
        state: undefined,
        postal: undefined,
        country: undefined
      });
      this.forceUpdate();
    }
  }, {
    key: 'Input',
    value: function Input(section, property) {
      return _react2.default.createElement(
        _reactstrap.FormGroup,
        null,
        _react2.default.createElement(
          _reactstrap.Label,
          { 'for': property },
          _lodash2.default.capitalize(property)
        ),
        _react2.default.createElement(_reactstrap.Input, {
          ref: property,
          name: this.formMetadata[section + 'Fields'][property],
          id: property,
          placeholder: property + '...',
          value: this.state[property],
          onChange: this.handleChange
        })
      );
    }
  }, {
    key: 'Select',
    value: function Select(section, property) {
      return _react2.default.createElement(
        _reactstrap.FormGroup,
        null,
        _react2.default.createElement(
          _reactstrap.Label,
          { 'for': property },
          _lodash2.default.capitalize(property)
        ),
        _react2.default.createElement(
          _reactstrap.Input,
          {
            type: 'select',
            ref: property,
            name: this.formMetadata[section + 'Fields'][property],
            id: property,
            placeholder: property + '...',
            value: this.state[property],
            onChange: this.handleChange
          },
          _react2.default.createElement(
            'option',
            { selected: true, disabled: true },
            'Select...'
          ),
          this.formMetadata[property + 'List'].map(function (property) {
            return _react2.default.createElement(
              'option',
              { key: property },
              property
            );
          })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _reactstrap.Form,
          { onSubmit: this.formSubmit },
          _react2.default.createElement(
            _reactstrap.FormGroup,
            { row: true },
            _react2.default.createElement(
              _reactstrap.Col,
              { lg: 12 },
              this.Input('contact', 'name')
            )
          ),
          _react2.default.createElement(
            _reactstrap.FormGroup,
            { row: true },
            _react2.default.createElement(
              _reactstrap.Col,
              { lg: 8 },
              this.Input('contact', 'email')
            ),
            _react2.default.createElement(
              _reactstrap.Col,
              { lg: 4 },
              this.Input('contact', 'phone')
            )
          ),
          _react2.default.createElement(
            _reactstrap.FormGroup,
            { row: true },
            _react2.default.createElement(
              _reactstrap.Col,
              { lg: 8 },
              this.Input('mailing', 'address')
            ),
            _react2.default.createElement(
              _reactstrap.Col,
              { lg: 4 },
              this.Input('mailing', 'city')
            )
          ),
          _react2.default.createElement(
            _reactstrap.FormGroup,
            { row: true },
            _react2.default.createElement(
              _reactstrap.Col,
              { lg: 4 },
              this.Select('mailing', 'state')
            ),
            _react2.default.createElement(
              _reactstrap.Col,
              { lg: 4 },
              this.Input('mailing', 'postal')
            ),
            _react2.default.createElement(
              _reactstrap.Col,
              { lg: 4 },
              this.Select('mailing', 'country')
            )
          ),
          _react2.default.createElement(
            _reactstrap.FormGroup,
            { row: true },
            _react2.default.createElement(
              _reactstrap.Col,
              { lg: 4 },
              _react2.default.createElement(
                _reactstrap.Button,
                { type: 'submit', color: 'primary' },
                'Submit'
              )
            ),
            _react2.default.createElement(
              _reactstrap.Col,
              { lg: 8 },
              _react2.default.createElement(
                _reactstrap.Alert,
                { color: 'success', isOpen: this.state.displaySuccess },
                this.alertText.success
              ),
              _react2.default.createElement(
                _reactstrap.Alert,
                { color: 'warning', isOpen: this.state.displayWarning },
                this.alertText.warning
              )
            )
          )
        )
      );
    }
  }]);

  return STDForm;
}(_react.Component);

exports.default = STDForm;


_reactDom2.default.render(_react2.default.createElement(STDForm, null), document.getElementById('app'));