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

  updateLineIndexForConversation(index, newLineIndex) {
    const updatedConversations = [...this.state.conversations];
    updatedConversations[index].currentLineIndex = newLineIndex;
    this.setState({ conversations: updatedConversations });
  }
  
  makeMockConversation(id) {
    // This function creates a new mock conversation with the given int (id) appended to the strings.

    // Generate a random HTML-friendly color
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

    const conversation = {
        color: randomColor,
        people: [
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
                text: `2. How are you, Person B-${id}?`
            },
            {
                name: `Person B-${id}`,
                text: `I'm doing great, thanks, Person A-${id}! How about you?`
            },
            {
                name: `Person A-${id}`,
                text: `I'm good.'`
            },
            {
                name: `Person B-${id}`,
                text: `I'm looking up.`
            },
            {
                name: `Person A-${id}`,
                text: `I'm hearing around.`
            },
            {
                name: `Person B-${id}`,
                text: `I'm finding time.`
            }
        ],
        currentLineIndex: -1
    };

    return conversation;
}

  render() {
    return (
      <div className="container">
        <h1 className="display-4 text-center">A Village of Wonder</h1>
        <button className="btn btn-secondary" type="button" onClick={this.addConversation}>Add Conversation</button>
        <div className="tall-div">
          {this.state.conversations.map((conversation, index) => (
            <Conversation key={index} data={conversation} updateLineIndex={(newLineIndex) => this.updateLineIndexForConversation(index, newLineIndex)} />
          ))}
        </div>
        <div className="hud">
          <h5>Scoreboard</h5>
          {this.state.conversations.map((conversation, index) => (
            <div key={index} style={{backgroundColor: conversation.color, display: 'inline-block', padding: '10px', margin: '5px'}}>
              {conversation.currentLineIndex}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
// Conversation component represents a conversation between Persons.
class Conversation extends React.Component {
  constructor(props) {
    super(props);
    const persons = this.createPeople(props.data.people, props.data.color);
    this.state = {
      persons: persons,
      lines: props.data.lines,
      currentLineIndex: -1 // The first line checked will be the first element in the array
    };
  }

  // Create an array of Persons from the lines of a conversation.
  createPeople(people, color) {
    const personMap = {};

    people.forEach(person => {
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

  updateConversationFor(person) {
    let newIndex = this.state.currentLineIndex + 1;

    // If out of lines
    if (newIndex >= this.state.lines.length) {
      person.currentLine = "Oops, I'm out of ideas";
      alert('out of lines');
      this.setState({ persons: this.state.persons });
      return;
    }

    const nextLine = this.state.lines[newIndex];

    // If the person is the speaker of the next line
    if (nextLine.name === person.name) {
      person.currentLine = nextLine.text;
      this.props.updateLineIndex(newIndex);
      this.setState({ currentLineIndex: newIndex, persons: this.state.persons });
    } else {
      // If the person is not the speaker of the next line
      person.currentLine = `Would you check with ${nextLine.name}? Remember, I said, "${person.currentLine}"`;
      this.setState({ persons: this.state.persons });
    }
  }

  render() {
    return (
      <div>
        {this.state.persons.map((person, index) => (
          <Person key={index} data={person} color={person.color} updateLine={() => this.updateConversationFor(person)} />
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

// HUD Component
class HUD extends React.Component {
  render() {
    return (
      <div className="hud mt-3">
        <h5>Scoreboard</h5>
        <div className="d-flex">
          {this.props.conversations.map((conversation, index) => (
            <div key={index} className="mr-2">
              <input
                type="text"
                readOnly
                className="form-control"
                value={conversation.currentLineIndex}
                style={{ backgroundColor: conversation.color, color: '#000' }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

let domContainer = document.querySelector("#Village");
ReactDOM.render(<Village />, domContainer);
