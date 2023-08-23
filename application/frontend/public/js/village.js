'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
      conversations: [],
      config: config
    };
    _this.addConversation = _this.addConversation.bind(_this);
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
        _this2.setState({
          conversations: village.conversations
        });
        alert('Conversations fetched successfully!');
      }).catch(function (err) {
        console.log(err);
        alert('Error fetching conversations.');
      });
    }
  }, {
    key: 'render',
    value: function render() {
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
          { className: 'btn btn-secondary', onClick: this.addConversation },
          'Add Conversation'
        ),
        this.state.conversations.map(function (conversation, index) {
          return React.createElement(Conversation, { key: index, data: conversation });
        })
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

    var _this3 = _possibleConstructorReturn(this, (Conversation.__proto__ || Object.getPrototypeOf(Conversation)).call(this, props));

    var people = _this3.createPeopleFromLines(props.data.lines);
    _this3.state = {
      people: people,
      currentLineIndex: 0, // Start from the first line
      color: props.data.color || '#FFF' // Default to white if no color is provided
    };
    return _this3;
  }

  // Create an array of people from the lines of a conversation.


  _createClass(Conversation, [{
    key: 'createPeopleFromLines',
    value: function createPeopleFromLines(lines) {
      var personMap = {};
      lines.forEach(function (line) {
        if (!personMap[line.name]) {
          personMap[line.name] = {
            name: line.name,
            currentLine: line.text,
            icon: '' // Placeholder icon, update as per requirement.
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
        { style: { backgroundColor: this.state.color } },
        this.state.people.map(function (person, index) {
          return React.createElement(Person, { key: index, data: person });
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
        { className: 'd-flex align-items-center mt-2' },
        React.createElement(
          'span',
          { className: 'icon mr-2' },
          this.props.data.icon
        ),
        React.createElement(
          'span',
          { className: 'mr-2' },
          this.props.data.name
        ),
        React.createElement('input', {
          type: 'text',
          readOnly: true,
          className: 'form-control',
          value: this.props.data.currentLine
        })
      );
    }
  }]);

  return Person;
}(React.Component);

var domContainer = document.querySelector("#App");
ReactDOM.render(React.createElement(Village, null), domContainer);