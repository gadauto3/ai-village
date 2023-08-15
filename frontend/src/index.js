"use strict";

const config = {
  apiPrefix: "/dev",
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        application: "",
        version: "",
      },
      config: config,
      clicks: [this.newClickData()],
    };
    this.state.clicks = [...this.state.clicks, this.newClickData()]; // Add another row
    this.addPersonRow = this.addPersonRow.bind(this);
    this.reverseRandomPersonText = this.reverseRandomPersonText.bind(this);
    this.newClickData = this.newClickData.bind(this);
  }

  newClickData() {
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}${
      now.getHours() < 12 ? "am" : "pm"
    }`;
    const numClicks = this.state?.clicks?.length + 1 || 1; // The OR condition ensures it works for the initial state
    return {
      button: `Click #${numClicks}`,
      icon: "⭐",
      textField: `Button click #${numClicks} at ${timeString}`,
    };
  }

  getApiInfo(e) {
    e.preventDefault();

    fetch(this.state.config.apiPrefix + "/api/info", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          info: response,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addPersonRow() {
    this.setState((prevState) => ({
      clicks: [...prevState.clicks, this.newClickData()],
    }));
  }

  componentDidMount() {}

  handleChange(changeObject) {
    this.setState(changeObject);
  }

  reverseTextAtIndex(index) {
    let clicksCopy = [...this.state.clicks];
    clicksCopy[index].button = clicksCopy[index].button
      .split("")
      .reverse()
      .join("");
    clicksCopy[index].textField = clicksCopy[index].textField
      .split("")
      .reverse()
      .join("");

    this.setState({
      clicks: clicksCopy,
    });
  }

  reverseRandomPersonText() {
    if (this.state.clicks.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.state.clicks.length);
    let clicksCopy = [...this.state.clicks];
    clicksCopy[randomIndex].button = clicksCopy[randomIndex].button
      .split("")
      .reverse()
      .join("");
    clicksCopy[randomIndex].textField = clicksCopy[randomIndex].textField
      .split("")
      .reverse()
      .join("");

    this.setState({
      clicks: clicksCopy,
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1 className="display-4 text-center">A Village of Wonder</h1>
            <form className="d-flex flex-column">
              <legend className="text-center">Meet the people</legend>
              {this.state.info.application !== "" ? (
                <legend className="text-center">
                  Application: {this.state.info.application}. Version:{" "}
                  {this.state.info.version}
                </legend>
              ) : null}
              <button
                className="btn btn-primary"
                type="button"
                onClick={(e) => this.getApiInfo(e)}
              >
                Get API Info
              </button>
              <div className="mt-2">
                <button
                  className="btn btn-secondary wide-btn"
                  type="button"
                  onClick={this.addPersonRow}
                >
                  Add Entry
                </button>
                <button
                  className="btn btn-warning ml-2"
                  type="button"
                  onClick={this.reverseRandomPersonText}
                >
                  Reverse Random Person Text
                </button>
              </div>
              {this.state.clicks.map((click, index) => (
                <Person
                  key={index}
                  data={click}
                  handleReverse={() => this.reverseTextAtIndex(index)}
                />
              ))}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

class Person extends React.Component {
  render() {
    return (
      <div className="d-flex align-items-center mt-2">
        <button
          className="btn btn-outline-info mr-3 wide-btn"
          type="button"
          onClick={this.props.handleReverse}
        >
          {this.props.data.button}
        </button>
        <span className="icon mr-2">{this.props.data.icon}</span>
        <input
          type="text"
          readOnly
          className="form-control"
          value={this.props.data.textField}
        />
      </div>
    );
  }
}

let domContainer = document.querySelector("#App");
ReactDOM.render(<App />, domContainer);
