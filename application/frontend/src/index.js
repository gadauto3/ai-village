"use strict";

import ScoreCalculator from './ScoreCalculator';

const config = {
  apiPrefix: "/dev",
};

function isLocalHost() {
  if (
    typeof window !== "undefined" &&
    window.location.host.includes("localhost")
  ) {
    console.log("You are running on localhost!");
    return true;
  } else {
    return false;
  }
}

// Handle localhost vs on S3 static site
const iconsPath =
  (isLocalHost() ? process.env.PUBLIC_URL : config.apiPrefix) + "/icons/";
const defaultHeadIcon = "icons8-head-profile-50.png";
const MAX_CONVOS = 7;

class Village extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      config: config,
      scores: [],
      totalScore: 0,
      isApiSuccess: false,
      isRetrieveCalled: false,
    };

    this.colorIndex = 0;
    this.lastSelectedConversation = -1;
    this.addConversation = this.addConversation.bind(this);
    this.retrieveConversations = this.retrieveConversations.bind(this);
    this.makeMockConversation = this.makeMockConversation.bind(this);
    this.handleScoreNotice = this.handleScoreNotice.bind(this);
  }

  // Score calculation
  componentDidMount() {
    this.scoreCalculator = new ScoreCalculator(
      this.state.conversations.map((conv) => conv.lines.length)
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.conversations.length != this.state.conversations.length) {
      this.scoreCalculator = new ScoreCalculator(
        this.state.conversations.map((conv) => conv.lines.length)
      );
    }
  }

  handleScoreNotice(index) {
    let scores = [...this.state.scores];

    if (scores[index] > 0) {
      return; // Score already calculated
    }
    const convoIndex = this.state.conversations[index].currentLineIndex;
    const updatedScores = this.scoreCalculator.updateScoresForIndex(
      index,
      convoIndex
    );

    const totalScore = this.scoreCalculator.getTotalScore();
    this.setState({ scores: [...updatedScores], totalScore: totalScore });
    console.log("scores", updatedScores);
  }

  // Add conversation to the list
  addConversation() {
    if (this.state.conversations.length < MAX_CONVOS) {
      const convo = this.makeMockConversation(
        this.state.conversations.length + 1
      );
      this.setState({
        conversations: [...this.state.conversations, convo],
      });
    }
  }

  retrieveConversations() {
    this.retrieveBtn.disabled = true;  // Disable the Retrieve button
    this.setState({
        isRetrieveCalled: true,
    });

    fetch(this.state.config.apiPrefix + "/api/getConversations", {
        method: "GET",
        headers: {
            accept: "application/json",
        },
    })
    .then((response) => response.json())
    .then((village) => {
        this.setState({
            conversations: village.conversations,
            isApiSuccess: true,
        });
    })
    .catch((err) => {
        console.log("retrieveConversations api error\n", err);

        if (isLocalHost()) {
          this.makeMockLines();
        } else {
          alert("Sorry, failed to retrieve conversations due to an error, try refreshing.\n"+err);
        }
        // this.setState({
        //   isRetrieveCalled: false,
        // });
    });
  }

  updateConversationLines(conversation, lines) {
    const updatedConversations = this.state.conversations.map((c) => {
      if (c === conversation) {
        c.lines = lines;
      }
      return c;
    });
    this.setState({ conversations: updatedConversations });
  }

  updateLineIndexForConversation(index, newLineIndex) {
    const updatedConversations = [...this.state.conversations];
    updatedConversations[index].currentLineIndex = newLineIndex;
    this.lastSelectedConversation = index;
    this.setState({ conversations: updatedConversations });
  }

  makeMockConversation(id) {
    // This function creates a new mock conversation with the given int (id) appended to the strings.

    // Generate HTML-friendly rainbow colors
    const colors = [ "#FFCCCC", "#FFDFCC", "#FFFFCC", "#DFFFD8", "#CCDDFF", "#D1CCFF", "#E8CCFF" ];
    const rainbowColor = colors[this.colorIndex];
    this.colorIndex = (this.colorIndex + 1) % colors.length;

    const conversation = {
      color: rainbowColor,
      people: [
        {
          name: `Person A-${id}`,
          icon: defaultHeadIcon,
          currentLine: ``,
        },
        {
          name: `Person B-${id}`,
          icon: defaultHeadIcon,
          currentLine: ``,
        },
      ],
      lines: [],
      currentLineIndex: -1,
    };

    return conversation;
  }

  makeMockLines() {
    const conversations = [...this.state.conversations];
    conversations.forEach(conversation => {
      const personA = conversation.people[0].name;
      const personB = conversation.people[1].name;
      const lines = [
        {
          name: personA,
          text: `How are you, ${personB}?`,
        },
        {
          name: personB,
          text: `I'm doing great, thanks, ${personA}! How about you?`,
        },
        {
          name: personA,
          text: `I'm good.`,
        },
        {
          name: personB,
          text: `I'm looking up.`,
        },
        {
          name: personA,
          text: `I'm hearing around.`,
        },
        {
          name: personB,
          text: `I'm finding time.`,
        },
      ];
      conversation.lines = lines;
    });
    this.setState({ conversations, isApiSuccess: true},
      () => {
        // Update lines after the state has been updated and the component re-rendered
        console.log("====conversations:::", this.state.conversations);
      });
  }
  
  render() {
    return (
      <div className="container">
        <h1 className="display-4 text-center">A Village of Wonder</h1>
        <button
          className="btn btn-secondary ml-2"
          type="button"
          onClick={this.addConversation}
          disabled={this.state.conversations.length >= MAX_CONVOS || this.state.isRetrieveCalled}
        >
          Add Conversation
        </button>
        <button
          className="btn btn-secondary ml-2"
          type="button"
          onClick={this.retrieveConversations}
          disabled={!this.state.conversations.length}
          ref={(btn) => {
            this.retrieveBtn = btn;
          }}
        >
          Retrieve
        </button>
        <div className="tall-div">
          {this.state.conversations.map((conversation, index) => (
            <Conversation
              key={index}
              data={conversation}
              isApiSuccess={this.state.isApiSuccess}
              apiPrefix={this.state.config.apiPrefix}
              updateConversationLines={this.updateConversationLines}
              updateLineIndex={(newLineIndex) =>
                this.updateLineIndexForConversation(index, newLineIndex)
              }
            />
          ))}
        </div>
        <div className="hud rounded-div">
          <h5>Scoreboard</h5>
          <div className="conversation-row">
            {this.state.conversations.map((conversation, index) => (
              <div
                key={index}
                className="conversation-div"
                style={{ backgroundColor: conversation.color }}
              >
                {conversation.currentLineIndex + 1}
              </div>
            ))}
          </div>

          <div className="conversation-row">
            {this.state.conversations.map((conversation, index) => (
              <div
                key={index}
                className="conversation-div"
                style={{ backgroundColor: conversation.color }}
              >
                {this.state.scores[index] || 0}
              </div>
            ))}
          </div>

          <div>
            <button
              className="btn btn-primary spacing"
              onClick={() =>
                this.handleScoreNotice(this.lastSelectedConversation)
              }
            >
              I’m noticing AI generation
            </button>
            <h5>Total Score: {this.state.totalScore}</h5>
          </div>
        </div>
      </div>
    );
  }
}

// Conversation component represents a conversation between people.
class Conversation extends React.Component {
  constructor(props) {
    super(props);
    const people = this.createPeople(props.data.people, props.data.color);
    this.state = {
      people: people,
      apiPrefix: props.apiPrefix,
      currentLineIndex: -1, // The first line checked will be the first element in the array
    };

    this.retrieveAdditionalConversation = this.retrieveAdditionalConversation.bind(this);
    this.updateConversationFor = this.updateConversationFor.bind(this);
  }

  // Create an array of people from the lines of a conversation.
  createPeople(people, color) {
    const personMap = {};

    people.forEach((person) => {
      if (!personMap[person.name]) {
        personMap[person.name] = {
          name: person.name,
          currentLine: person.currentLine,
          icon: iconsPath + person.icon,
          color: color || "#FFF", // Default to white if no color is provided
        };
      } else {
        personMap[person.name].currentLine = person.currentLine;
      }
    });
    return Object.values(personMap);
  }

  retrieveAdditionalConversation(person) {
    fetch(this.state.apiPrefix + "/api/addToConversation", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json", // Indicates the content type of the request body
      },
      body: JSON.stringify({ lines: this.state.lines }), // Send the current lines as the request body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Conversations fetched successfully!", data);

        // Check if moreLines is empty
        if (data.moreLines.length) {
          const addedLines = this.state.lines.concat(data.moreLines);

          this.setState(
            (prevState) => {
              return { lines: prevState.lines.concat(data.moreLines) };
            },
            () => {
              // Update lines after the state has been updated and the component re-rendered
              this.updateConversationFor(person, false);
              this.props.updateConversationLines(this.props.data, this.state.lines);
            }
          );
        } else {
          console.log("No moreLines");
          this.updateConversationFor(person, false);
        }
      })
      .catch((err) => {
        console.log("addToConvo api error");
        this.updateConversationFor(person, false);
      });
  }
  
  updateConversationFor(person, canUseAPI) {
    let newIndex = this.props.data.currentLineIndex + 1;

    // If out of lines
    if (newIndex >= this.props.data.lines.length - 1) {
      if (canUseAPI) {
        this.retrieveAdditionalConversation(person);
      } else {
        person.currentLine = "Oops, I'm out of ideas";
        this.setState({ people: this.state.people });
      }
      return;
    }

    const nextLine = this.props.data.lines[newIndex];

    // If the person is the speaker of the next line
    if (nextLine.name === person.name) {
      person.currentLine = nextLine.text;
      this.props.updateLineIndex(newIndex);
    } else {
      // If the person is not the speaker of the next line
      person.currentLine = `Would you check with ${nextLine.name}? Remember, I said, "${person.currentLine}"`;
      this.setState({ people: this.state.people });
    }
  }

  render() {
    return (
      <div>
        {this.state.people.map((person, index) => (
          <Person
            key={index}
            data={person}
            color={person.color}
            isApiSuccess={this.props.isApiSuccess}
            updateLine={() => this.updateConversationFor(person, true)}
            isClickable={this.props.data.lines.length > 0}
          />
        ))}
      </div>
    );
  }
}

// Person component represents an individual with a name, icon, and a line of text they've spoken.
class Person extends React.Component {
  render() {
    return (
      <div
        className="d-flex align-items-center mt-2 rounded-div"
        style={{ backgroundColor: this.props.color }}
      >
        <button
          className="mr-2 wide-btn spacing"
          type="button"
          onClick={this.props.updateLine}
          disabled={!this.props.isClickable && !this.props.isApiSuccess}
        >
          {this.props.data.name}
        </button>
        <img
          src={this.props.data.icon}
          alt="Icon"
          className="icon mr-2 spacing"
        />
        <textarea
          readOnly
          className="form-control spacing"
          value={this.props.data.currentLine}
          style={{
            overflow: "auto",
            whiteSpace: "pre-wrap",
            resize: "none",
            border: "none",
            outline: "none",
          }}
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
                style={{ backgroundColor: conversation.color, color: "#000" }}
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
