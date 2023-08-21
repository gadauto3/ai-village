'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var config = {
  apiPrefix: '/dev'
};

function isLocalHost() {
  if (typeof window !== 'undefined' && window.location.host.includes('localhost')) {
    console.log('You are running on localhost!');
    return true;
  } else {
    return false;
  }
}

// Handle localhost vs on S3 static site
var iconsPath = (isLocalHost() ? process.env.PUBLIC_URL : config.apiPrefix) + '/icons/';
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
        // alert('Error fetching conversations.');
      });
    }
  }, {
    key: 'updateLineIndexForConversation',
    value: function updateLineIndexForConversation(index, newLineIndex) {
      var updatedConversations = [].concat(_toConsumableArray(this.state.conversations));
      updatedConversations[index].currentLineIndex = newLineIndex;
      this.setState({ conversations: updatedConversations });
    }
  }, {
    key: 'makeMockConversation',
    value: function makeMockConversation(id) {
      // This function creates a new mock conversation with the given int (id) appended to the strings.

      // Generate a random HTML-friendly color
      var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

      var conversation = {
        color: randomColor,
        people: [{
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
          text: '2. How are you, Person B-' + id + '?'
        }, {
          name: 'Person B-' + id,
          text: 'I\'m doing great, thanks, Person A-' + id + '! How about you?'
        }, {
          name: 'Person A-' + id,
          text: 'I\'m good.\''
        }, {
          name: 'Person B-' + id,
          text: 'I\'m looking up.'
        }, {
          name: 'Person A-' + id,
          text: 'I\'m hearing around.'
        }, {
          name: 'Person B-' + id,
          text: 'I\'m finding time.'
        }],
        currentLineIndex: -1
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
        React.createElement(
          'div',
          { className: 'tall-div' },
          this.state.conversations.map(function (conversation, index) {
            return React.createElement(Conversation, { key: index, data: conversation, updateLineIndex: function updateLineIndex(newLineIndex) {
                return _this3.updateLineIndexForConversation(index, newLineIndex);
              } });
          })
        ),
        React.createElement(
          'div',
          { className: 'hud' },
          React.createElement(
            'h5',
            null,
            'Scoreboard'
          ),
          this.state.conversations.map(function (conversation, index) {
            return React.createElement(
              'div',
              { key: index, style: { backgroundColor: conversation.color, display: 'inline-block', padding: '10px', margin: '5px' } },
              conversation.currentLineIndex
            );
          })
        )
      );
    }
  }]);

  return Village;
}(React.Component);
// Conversation component represents a conversation between people.


var Conversation = function (_React$Component2) {
  _inherits(Conversation, _React$Component2);

  function Conversation(props) {
    _classCallCheck(this, Conversation);

    var _this4 = _possibleConstructorReturn(this, (Conversation.__proto__ || Object.getPrototypeOf(Conversation)).call(this, props));

    var people = _this4.createPeople(props.data.people, props.data.color);
    _this4.state = {
      people: people,
      lines: props.data.lines,
      currentLineIndex: -1 // The first line checked will be the first element in the array
    };
    return _this4;
  }

  // Create an array of people from the lines of a conversation.


  _createClass(Conversation, [{
    key: 'createPeople',
    value: function createPeople(people, color) {
      var personMap = {};

      console.log(people);
      people.forEach(function (person) {
        if (!personMap[person.name]) {
          personMap[person.name] = {
            name: person.name,
            currentLine: person.currentLine,
            icon: iconsPath + person.icon, // Placeholder icon, update as per requirement.
            color: color || '#FFF' // Default to white if no color is provided
          };
        } else {
          personMap[person.name].currentLine = person.currentLine;
        }
      });
      return Object.values(personMap);
    }
  }, {
    key: 'updateConversationFor',
    value: function updateConversationFor(person) {
      var newIndex = this.state.currentLineIndex + 1;

      // If out of lines
      if (newIndex >= this.state.lines.length) {
        person.currentLine = "Oops, I'm out of ideas";
        alert('out of lines');
        this.setState({ people: this.state.people });
        return;
      }

      var nextLine = this.state.lines[newIndex];

      // If the person is the speaker of the next line
      if (nextLine.name === person.name) {
        person.currentLine = nextLine.text;
        this.props.updateLineIndex(newIndex);
        this.setState({ currentLineIndex: newIndex, people: this.state.people });
      } else {
        // If the person is not the speaker of the next line
        person.currentLine = 'Would you check with ' + nextLine.name + '? Remember, I said, "' + person.currentLine + '"';
        this.setState({ people: this.state.people });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return React.createElement(
        'div',
        null,
        this.state.people.map(function (person, index) {
          return React.createElement(Person, { key: index, data: person, color: person.color, updateLine: function updateLine() {
              return _this5.updateConversationFor(person);
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

// HUD Component


var HUD = function (_React$Component4) {
  _inherits(HUD, _React$Component4);

  function HUD() {
    _classCallCheck(this, HUD);

    return _possibleConstructorReturn(this, (HUD.__proto__ || Object.getPrototypeOf(HUD)).apply(this, arguments));
  }

  _createClass(HUD, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'hud mt-3' },
        React.createElement(
          'h5',
          null,
          'Scoreboard'
        ),
        React.createElement(
          'div',
          { className: 'd-flex' },
          this.props.conversations.map(function (conversation, index) {
            return React.createElement(
              'div',
              { key: index, className: 'mr-2' },
              React.createElement('input', {
                type: 'text',
                readOnly: true,
                className: 'form-control',
                value: conversation.currentLineIndex,
                style: { backgroundColor: conversation.color, color: '#000' }
              })
            );
          })
        )
      );
    }
  }]);

  return HUD;
}(React.Component);

var domContainer = document.querySelector("#Village");
ReactDOM.render(React.createElement(Village, null), domContainer);