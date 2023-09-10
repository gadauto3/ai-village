"use strict";

const config = {
  apiPrefix: "/dev",
};

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
    this.updateConversationLines = this.updateConversationLines.bind(this);
    this.makeMockConversation = this.makeStartingConversation.bind(this);
    this.handleScoreNotice = this.handleScoreNotice.bind(this);
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
      const convo = this.makeStartingConversation(
        this.state.conversations.length + 1
      );
      this.setState({
        conversations: [...this.state.conversations, convo],
      });
    }
  }

  retrieveConversations() {
    this.retrieveBtn.disabled = true; // Disable the Retrieve button
    this.setState({
        isRetrieveCalled: true,
    });

    const apiPath = "/api/getConversations?numConvos=" + this.state.conversations.length;
    fetch(this.state.config.apiPrefix + apiPath, {
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
        },
        () => {
          this.scoreCalculator = new ScoreCalculator(
            this.state.conversations.map((conv) => conv.lines.length)
          );
        });
    })
    .catch((err) => {
        console.log("retrieveConversations api error\n", err);

        if (isLocalHost()) {
          this.makeMockLines();
        } else {
          alert("Sorry, failed to retrieve conversations due to an error, try refreshing.\n"+err);
        }
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

  makeStartingConversation(id) {
    // Generate HTML-friendly rainbow colors
    const colors = [ "#FFCCCC", "#FFDFCC", "#FFFFCC", "#DFFFD8", "#CCDDFF", "#D1CCFF", "#E8CCFF" ];
    const rainbowColor = colors[this.colorIndex];
    this.colorIndex = (this.colorIndex + 1) % colors.length;

    const conversation = {
      color: rainbowColor,
      people: [
        {
          name: `Person ${id * 2 - 1}`,
          icon: defaultHeadIcon,
          currentLine: ``,
        },
        {
          name: `Person ${id * 2}`,
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
    const conversations = deepCopy(this.state.conversations);
    const names = [ "George", "Carlos", "Jimena", "Vanessa", "Chris", "Cri-Cri", "Leo", "Rosa", "Liliana", "Lianna", "Camden" ];
    let nameIndex = 0;
    conversations.forEach((conversation) => {
      const personA = names[nameIndex++];
      const personB = names[nameIndex++];
      conversation.people[0].name = personA;
      conversation.people[1].name = personB;

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
          text: `I'm good. I'm going blab on a bit because I need to test a rather long text where people will read what I say in my words for the birds and I really don't like curds.`,
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
        this.scoreCalculator = new ScoreCalculator(
          this.state.conversations.map((conv) => conv.lines.length)
        );
      });
  }
  
  render() {
    return (
      <div className="container">
        <h1 className="display-4 text-center">A Village of Wonder</h1>

        {!this.state.isRetrieveCalled ? (
          <p>
              Start by using Add Conversation. The more conversations you choose to add, the higher the potential score.<br />
              When you've finished selecting, click Begin.
          </p>
        ) : null}

        {/* Conditional Rendering for "Add Conversation" Button */}
        {this.state.conversations.length < MAX_CONVOS - 1 && !this.state.isRetrieveCalled ? (
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={this.addConversation}
          >
            Add Conversation
          </button>
        ) : null}

        {!this.state.isRetrieveCalled ? (
          <button
            className="btn btn-secondary ml-2"
            type="button"
            onClick={this.retrieveConversations}
            disabled={!this.state.conversations.length}
            ref={(btn) => {
              this.retrieveBtn = btn;
            }}
          >
            Begin
          </button>
        ) : null}
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
        <div>

          {this.state.isRetrieveCalled ? (
            <p>
              Now your goal is to select the "I'm noticing AI generation" button <em>once 
              per conversation</em> when you think you notice that the 
              AI is creating further conversation between the villagers. <br />
              The highest score is 15 per conversation. You can guess once per conversation. 
              Refresh the page to start over.
            </p>
          ) : null}
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
            <h5>Total Score: {this.state.totalScore} out of {this.state.conversations.length*15}</h5>
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
      isFetching: false,
      currentLineIndex: -1, // The first line checked will be the first element in the array
    };

    this.retrieveAdditionalConversation = this.retrieveAdditionalConversation.bind(this);
    this.updateConversationFor = this.updateConversationFor.bind(this);
  }

  componentDidUpdate(prevProps) {
      // Check if the people prop has changed
      if (this.props.data.people !== prevProps.data.people) {
          const people = this.createPeople(this.props.data.people, this.props.data.color);
          this.setState({ people: people });
      }
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

    this.setState({ isFetching: true }); // true indicates a fetch in progress

    const currentLines = this.props.data.lines;
    console.log("fetching now for", currentLines);
    fetch(this.state.apiPrefix + "/api/addToConversation", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json", // Indicates the content type of the request body
      },
      body: JSON.stringify({ lines: currentLines }), // Send the current lines as the request body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Conversations fetched successfully!", data);

        // Check if moreLines is empty
        if (data.moreLines.length) {
          console.log("adding more lines", data.moreLines);
          const addedLines = this.props.data.lines.concat(data.moreLines);
          this.props.updateConversationLines(this.props.data, addedLines);
        } else {
          console.log("No moreLines");
          this.updateConversationFor(person, false);
        }
        // Reset the flag to false to allow future fetch operations
        this.setState({ isFetching: false });
      })
      .catch((err) => {
        console.log("addToConvo api error", err);
        this.updateConversationFor(person, false);
        
        // Reset the flag to false to allow future fetch operations
        this.setState({ isFetching: false });
      });
  }
  
  updateConversationFor(person, canUseAPI) {
    let newIndex = this.props.data.currentLineIndex + 1;

    if (newIndex == this.props.data.lines.length - 2) {
      if (canUseAPI && !this.state.isFetching) {
        this.retrieveAdditionalConversation(person);
      }
    }

    // If out of lines
    if (newIndex >= this.props.data.lines.length) {

      // Don't give up just yet if fetching
      if (this.state.isFetching) {
        alert("Hi, this is Gabriel. Thanks for your patience with this prototype. Would you try again in 5 seconds?")
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
        <div
          className="form-control spacing"
        >
          {this.props.data.currentLine}
        </div>
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

class ScoreCalculator {
  constructor(linesLengths) {
    this.linesLengths = linesLengths;
    this.scores = new Array(linesLengths.length).fill(0);
    this.PERFECT_SCORE = 15;
    this.OVERESTIMATE_MULTIPLIER = 2;
    this.UNDERESTIMATE_MULTIPLIER = 3;
  }

  // Setter method to update scores directly if needed
  setScoreValues(scores) {
    if (scores.length !== this.linesLengths.length) {
      throw new Error("Scores array length doesn't match linesLengths array length");
    }
    this.scores = scores;
  }

  // This method will use the logic from the provided Node class
  updateScoresForIndex(index, selection) {
    if (index < 0 || index >= this.scores.length) {
      throw new Error("Index out of range");
    }
    
    const delta = this.linesLengths[index] - selection;

    const deltaMul = delta * ((delta < 0) ? this.OVERESTIMATE_MULTIPLIER : this.UNDERESTIMATE_MULTIPLIER);
    const score = this.PERFECT_SCORE - Math.abs(deltaMul);
    this.scores[index] = score;

    return this.scores;
  }

  // Original method from the React class
  getTotalScore() {
    return this.scores.reduce((acc, curr) => acc + curr, 0);
  }
}

let domContainer = document.querySelector("#Village");
ReactDOM.render(<Village />, domContainer);

/** Helper functions */

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

// TODO: fix deployment system so I can just use lodash
function deepCopy(obj) {
  if (obj === null) return null;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    const copy = obj.slice();
    for (let i = 0; i < copy.length; i++) {
      copy[i] = deepCopy(copy[i]);
    }
    return copy;
  } else {
    const copy = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepCopy(obj[key]);
      }
    }
    return copy;
  }
}
