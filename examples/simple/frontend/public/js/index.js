'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var config = {
  apiPrefix: '/dev'
};
var defaultHeadIcon = 'icons8-head-profile-50.png';

var Village = function (_React$Component) {
  _inherits(Village, _React$Component);

  function Village(props) {
    _classCallCheck(this, Village);

    var _this = _possibleConstructorReturn(this, (Village.__proto__ || Object.getPrototypeOf(Village)).call(this, props));

    _this.state = {
      conversations: [],
      config: config
    };
    _this.addConversation = _this.addConversation.bind(_this);
    _this.makeMockConversation = _this.makeMockConversation.bind(_this);
    return _this;
  }

  // Fetch conversations from the API


  _createClass(Village, [{
    key: 'addConversation',
    value: function addConversation() {
      var _this2 = this;

      // TODO: change api path
      //fetch(this.state.config.apiPrefix + "/api/getConversations", {
      fetch(this.state.config.apiPrefix + "/api/info", {
        method: "GET",
        headers: {
          accept: "application/json"
        }
      }).then(function (response) {
        return response.json();
      }).then(function (village) {
        console.log('Received: ');
        console.log(village);
        _this2.setState({
          conversations: village.conversations
        });
        alert('Conversations fetched successfully!');
      }).catch(function (err) {
        console.log('addConvo api error, making mock object\n' + err);
        var convo = _this2.makeMockConversation(_this2.state.conversations.length + 1);
        console.log(convo);
        _this2.setState({
          conversations: [].concat(_toConsumableArray(_this2.state.conversations), [convo])
        });
        console.log(_this2.state.conversations);
        // alert('Error fetching conversations.');
      });
    }
  }, {
    key: 'makeMockConversation',
    value: function makeMockConversation(id) {
      // This function creates a new mock conversation with the given int (id) appended to the strings.

      // Generate a random HTML-friendly color
      var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

      var conversation = {
        color: randomColor,
        persons: [{
          name: 'Person A-' + id,
          icon: defaultHeadIcon,
          currentLine: '1: Hello from Person A-' + id + '!'
        }, {
          name: 'Person B-' + id,
          icon: defaultHeadIcon,
          currentLine: 'Greetings from Person B-' + id + '!'
        }],
        lines: [{
          name: 'Person A-' + id,
          text: '2. How are you, Person B-' + id + '?',
          sentiment: "neutral"
        }, {
          name: 'Person B-' + id,
          text: 'I\'m doing great, thanks, Person A-' + id + '! How about you?',
          sentiment: "positive"
        }],
        currentLineIndex: 0
      };

      return conversation;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'h1',
          { className: 'display-4 text-center' },
          'A Village of Wonder'
        ),
        React.createElement(
          'button',
          { className: 'btn btn-secondary', type: 'button', onClick: this.addConversation },
          'Add Conversation'
        ),
        this.state.conversations.map(function (conversation, index) {
          return React.createElement(Conversation, { key: index, data: conversation, iconsPath: _this3.state.config.apiPrefix + '/icons/' });
        })
      );
    }
  }]);

  return Village;
}(React.Component);
// Conversation component represents a conversation between Persons.


var Conversation = function (_React$Component2) {
  _inherits(Conversation, _React$Component2);

  function Conversation(props) {
    _classCallCheck(this, Conversation);

    var _this4 = _possibleConstructorReturn(this, (Conversation.__proto__ || Object.getPrototypeOf(Conversation)).call(this, props));

    var persons = _this4.createPersonsFromLines(props.data.lines, props.data.color, props.iconsPath);
    _this4.state = {
      persons: persons,
      currentLineIndex: 0 // Start from the first line
    };
    return _this4;
  }

  // Create an array of Persons from the lines of a conversation.


  _createClass(Conversation, [{
    key: 'createPersonsFromLines',
    value: function createPersonsFromLines(lines, color, iconsPath) {
      var personMap = {};
      console.log('iconsPath: ' + iconsPath);
      lines.forEach(function (line) {
        if (!personMap[line.name]) {
          personMap[line.name] = {
            name: line.name,
            currentLine: line.text,
            icon: iconsPath + defaultHeadIcon, // Placeholder icon, update as per requirement.
            color: color || '#FFF' // Default to white if no color is provided
          };
        } else {
          personMap[line.name].currentLine = line.text;
        }
      });
      return Object.values(personMap);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        this.state.persons.map(function (person, index) {
          return React.createElement(Person, { key: index, data: person, color: person.color, updateLine: function updateLine() {
              return alert('hello from ' + person.name);
            } });
        })
      );
    }
  }]);

  return Conversation;
}(React.Component);

// Person component represents an individual with a name, icon, and a line of text they've spoken.


var Person = function (_React$Component3) {
  _inherits(Person, _React$Component3);

  function Person() {
    _classCallCheck(this, Person);

    return _possibleConstructorReturn(this, (Person.__proto__ || Object.getPrototypeOf(Person)).apply(this, arguments));
  }

  _createClass(Person, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'd-flex align-items-center mt-2 rounded-div', style: { backgroundColor: this.props.color } },
        React.createElement(
          'button',
          { className: 'mr-2 wide-btn spacing', type: 'button', onClick: this.props.updateLine },
          this.props.data.name
        ),
        React.createElement('img', { src: this.props.data.icon, alt: 'Icon', className: 'icon mr-2 spacing' }),
        React.createElement('input', {
          type: 'text',
          readOnly: true,
          className: 'form-control spacing',
          value: this.props.data.currentLine
        })
      );
    }
  }]);

  return Person;
}(React.Component);

var domContainer = document.querySelector("#Village");
ReactDOM.render(React.createElement(Village, null), domContainer);