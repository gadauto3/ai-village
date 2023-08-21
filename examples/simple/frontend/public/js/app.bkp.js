'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var config = {
  apiPrefix: '/dev'
};

var Village = function (_React$Component) {
  _inherits(Village, _React$Component);

  function Village(props) {
    _classCallCheck(this, Village);

    var _this = _possibleConstructorReturn(this, (Village.__proto__ || Object.getPrototypeOf(Village)).call(this, props));

    _this.state = {
      info: {
        application: "",
        version: ""
      },
      config: config,
      clicks: [_this.newClickData()]
    };
    _this.state.clicks = [].concat(_toConsumableArray(_this.state.clicks), [_this.newClickData()]); // Add another row
    _this.addPersonRow = _this.addPersonRow.bind(_this);
    _this.reverseRandomPersonText = _this.reverseRandomPersonText.bind(_this);
    _this.newClickData = _this.newClickData.bind(_this);
    return _this;
  }

  _createClass(Village, [{
    key: 'newClickData',
    value: function newClickData() {
      var now = new Date();
      var timeString = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + (now.getHours() < 12 ? "am" : "pm");
      // const numClicks = this.state?.clicks?.length + 1 || 1; // The OR condition ensures it works for the initial state
      var numClicks = this.state && this.state.clicks && this.state.clicks.length ? this.state.clicks.length + 1 : 1;

      return {
        button: 'Click #' + numClicks,
        icon: "⭐",
        textField: 'Button click #' + numClicks + ' at ' + timeString
      };
    }
  }, {
    key: 'getApiInfo',
    value: function getApiInfo(e) {
      var _this2 = this;

      e.preventDefault();

      fetch(this.state.config.apiPrefix + "/api/info", {
        method: "GET",
        headers: {
          accept: "application/json"
        }
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        _this2.setState({
          info: response
        });
      }).catch(function (err) {
        console.log(err);
      });
    }
  }, {
    key: 'addPersonRow',
    value: function addPersonRow() {
      var _this3 = this;

      this.setState(function (prevState) {
        return {
          clicks: [].concat(_toConsumableArray(prevState.clicks), [_this3.newClickData()])
        };
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'handleChange',
    value: function handleChange(changeObject) {
      this.setState(changeObject);
    }
  }, {
    key: 'reverseTextAtIndex',
    value: function reverseTextAtIndex(index) {
      var clicksCopy = [].concat(_toConsumableArray(this.state.clicks));
      clicksCopy[index].button = clicksCopy[index].button.split("").reverse().join("");
      clicksCopy[index].textField = clicksCopy[index].textField.split("").reverse().join("");

      this.setState({
        clicks: clicksCopy
      });
    }
  }, {
    key: 'reverseRandomPersonText',
    value: function reverseRandomPersonText() {
      if (this.state.clicks.length === 0) return;

      var randomIndex = Math.floor(Math.random() * this.state.clicks.length);
      var clicksCopy = [].concat(_toConsumableArray(this.state.clicks));
      clicksCopy[randomIndex].button = clicksCopy[randomIndex].button.split("").reverse().join("");
      clicksCopy[randomIndex].textField = clicksCopy[randomIndex].textField.split("").reverse().join("");

      this.setState({
        clicks: clicksCopy
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'row justify-content-center' },
          React.createElement(
            'div',
            { className: 'col-md-8' },
            React.createElement(
              'h1',
              { className: 'display-4 text-center' },
              'A Village of Wonder'
            ),
            React.createElement(
              'form',
              { className: 'd-flex flex-column' },
              React.createElement(
                'legend',
                { className: 'text-center' },
                'Meet the people'
              ),
              this.state.info.application !== "" ? React.createElement(
                'legend',
                { className: 'text-center' },
                'Application: ',
                this.state.info.application,
                '. Version:',
                " ",
                this.state.info.version
              ) : null,
              React.createElement(
                'button',
                {
                  className: 'btn btn-primary',
                  type: 'button',
                  onClick: function onClick(e) {
                    return _this4.getApiInfo(e);
                  }
                },
                'Get API Info'
              ),
              React.createElement(
                'div',
                { className: 'mt-2' },
                React.createElement(
                  'button',
                  {
                    className: 'btn btn-secondary wide-btn',
                    type: 'button',
                    onClick: this.addPersonRow
                  },
                  'Add Entry'
                ),
                React.createElement(
                  'button',
                  {
                    className: 'btn btn-warning ml-2',
                    type: 'button',
                    onClick: this.reverseRandomPersonText
                  },
                  'Reverse Random Person Text'
                )
              ),
              this.state.clicks.map(function (click, index) {
                return React.createElement(Person, {
                  key: index,
                  data: click,
                  handleReverse: function handleReverse() {
                    return _this4.reverseTextAtIndex(index);
                  }
                });
              })
            )
          )
        )
      );
    }
  }]);

  return Village;
}(React.Component);

var Person = function (_React$Component2) {
  _inherits(Person, _React$Component2);

  function Person() {
    _classCallCheck(this, Person);

    return _possibleConstructorReturn(this, (Person.__proto__ || Object.getPrototypeOf(Person)).apply(this, arguments));
  }

  _createClass(Person, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'd-flex align-items-center mt-2' },
        React.createElement(
          'button',
          {
            className: 'btn btn-outline-info mr-3 wide-btn',
            type: 'button',
            onClick: this.props.handleReverse
          },
          this.props.data.button
        ),
        React.createElement(
          'span',
          { className: 'icon mr-2' },
          this.props.data.icon
        ),
        React.createElement('input', {
          type: 'text',
          readOnly: true,
          className: 'form-control',
          value: this.props.data.textField
        })
      );
    }
  }]);

  return Person;
}(React.Component);

var domContainer = document.querySelector("#Village");
ReactDOM.render(React.createElement(Village, null), domContainer);