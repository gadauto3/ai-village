'use strict';

const config = {
  apiPrefix: '/dev'
};

class Village extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      config: config
    };
    this.addConversation = this.addConversation.bind(this);
  }

  // Fetch conversations from the API
  addConversation() {
    // TODO: change api path
    //fetch(this.state.config.apiPrefix + "/api/getConversations", {
    fetch(this.state.config.apiPrefix + "/api/info", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((village) => {
        this.setState({
          conversations: village.conversations
        });
        alert('Conversations fetched successfully!');
      })
      .catch((err) => {
        console.log(err);
        alert('Error fetching conversations.');
      });
  }

  render() {
    return (
      <div className="container">
        <h1 className="display-4 text-center">A Village of Wonder</h1>
        <button className="btn btn-secondary" onClick={this.addConversation}>Add Conversation</button>
        {this.state.conversations.map((conversation, index) => (
          <Conversation key={index} data={conversation} />
        ))}
      </div>
    );
  }
}

// Conversation component represents a conversation between Persons.
class Conversation extends React.Component {
  constructor(props) {
    super(props);
    const persons = this.createPersonsFromLines(props.data.lines);
    this.state = {
      persons: persons,
      currentLineIndex: 0, // Start from the first line
      color: props.data.color || '#FFF' // Default to white if no color is provided
    };
  }

  // Create an array of Persons from the lines of a conversation.
  createPersonsFromLines(lines) {
    const personMap = {};
    lines.forEach(line => {
      if (!personMap[line.name]) {
        personMap[line.name] = {
          name: line.name,
          currentLine: line.text,
          icon: '' // Placeholder icon, update as per requirement.
        };
      } else {
        personMap[line.name].currentLine = line.text;
      }
    });
    return Object.values(personMap);
  }

  render() {
    return (
      <div style={{ backgroundColor: this.state.color }}>
        {this.state.persons.map((person, index) => (
          <Person key={index} data={person} />
        ))}
      </div>
    );
  }
}

// Person component represents an individual with a name, icon, and a line of text they've spoken.
class Person extends React.Component {
  render() {
    return (
      <div className="d-flex align-items-center mt-2">
        <span className="icon mr-2">{this.props.data.icon}</span>
        <span className="mr-2">{this.props.data.name}</span>
        <input
          type="text"
          readOnly
          className="form-control"
          value={this.props.data.currentLine}
        />
      </div>
    );
  }
}

let domContainer = document.querySelector("#App");
ReactDOM.render(<Village />, domContainer);
