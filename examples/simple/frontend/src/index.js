'use strict';

const config = {
  apiPrefix: '/dev'
};

// Handle localhost vs on S3 static site
const iconsPath = ((typeof process.env === 'undefined') ? config.apiPrefix : process.env.PUBLIC_URL) + '/icons/';
const defaultHeadIcon = 'icons8-head-profile-50.png';

class Village extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      config: config
    };
    this.addConversation = this.addConversation.bind(this);
    this.makeMockConversation = this.makeMockConversation.bind(this);
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
        console.log('addConvo api error, making mock object\n'+err);
        const convo = this.makeMockConversation(this.state.conversations.length+1);
        console.log(convo);
        this.setState({
          conversations: [...this.state.conversations, convo ]
        });
        // alert('Error fetching conversations.');
      });
  }

  makeMockConversation(id) {
    // This function creates a new mock conversation with the given int (id) appended to the strings.

    // Generate a random HTML-friendly color
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

    const conversation = {
        color: randomColor,
        persons: [
            {
                name: `Person A-${id}`,
                icon: defaultHeadIcon,
                currentLine: `1: Hello from Person A-${id}!`
            },
            {
                name: `Person B-${id}`,
                icon: defaultHeadIcon,
                currentLine: `Greetings from Person B-${id}!`
            }
        ],
        lines: [
            {
                name: `Person A-${id}`,
                text: `2. How are you, Person B-${id}?`,
                sentiment: "neutral"
            },
            {
                name: `Person B-${id}`,
                text: `I'm doing great, thanks, Person A-${id}! How about you?`,
                sentiment: "positive"
            }
        ],
        currentLineIndex: 0
    };

    return conversation;
}

  render() {
    return (
      <div className="container">
        <h1 className="display-4 text-center">A Village of Wonder</h1>
        <button className="btn btn-secondary" type="button" onClick={this.addConversation}>Add Conversation</button>
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
    const persons = this.createPersonsFromLines(props.data.lines, props.data.color);
    this.state = {
      persons: persons,
      currentLineIndex: 0 // Start from the first line
    };
  }

  // Create an array of Persons from the lines of a conversation.
  createPersonsFromLines(lines, color) {
    const personMap = {};

    lines.forEach(line => {
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

  render() {
    return (
      <div>
        {this.state.persons.map((person, index) => (
          <Person key={index} data={person} color={person.color} updateLine={() => alert('hello from '+person.name) } />
        ))}
      </div>
    );
  }
}

// Person component represents an individual with a name, icon, and a line of text they've spoken.
class Person extends React.Component {

  render() {
    return (
      <div className="d-flex align-items-center mt-2 rounded-div" style={{ backgroundColor: this.props.color }}>
        <button className="mr-2 wide-btn spacing" type="button" onClick={this.props.updateLine}>{this.props.data.name}</button>
        <img src={this.props.data.icon} alt="Icon" className="icon mr-2 spacing" />

        <input
          type="text"
          readOnly
          className="form-control spacing"
          value={this.props.data.currentLine}
        />
      </div>
    );
  }
}

let domContainer = document.querySelector("#Village");
ReactDOM.render(<Village />, domContainer);
