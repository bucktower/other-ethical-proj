import React from 'react';
import logo from './logo.svg';
import './App.css';

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require('firebase/database');

/*
REACT_APP_API_KEY=AIzaSyAylkbPwGjXuySbA5pDT3DK3ac8JBpZZnM
REACT_APP_AUTH_DOMAIN=ethical-hacking-56322.firebaseapp.com
REACT_APP_DATABASE_URL=https://ethical-hacking-56322.firebaseio.com
REACT_APP_PROJECT_ID=ethical-hacking-56322
REACT_APP_STORAGE_BUCKET=ethical-hacking-56322.appspot.com
REACT_APP_MESSAGING_SENDER_ID=65240116622
REACT_APP_APP_ID=1:652401166225:web:6739c523cf47fe83b4fc30
*/

// establish firebase configs
const config = {
  apiKey: "AIzaSyAylkbPwGjXuySbA5pDT3DK3ac8JBpZZnM",//process.env.REACT_APP_API_KEY,
  authDomain: "ethical-hacking-56322.firebaseapp.com",//process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: "https://ethical-hacking-56322.firebaseio.com",//process.env.REACT_APP_DATABASE_URL,
  projectId: "ethical-hacking-56322",//process.env.REACT_APP_PROJECT_ID,
  storageBucket: "ethical-hacking-56322.appspot.com",
  messagingSenderId: 65240116622,//process.env.REACT_APP_MESSAGING_SENDER_ID,
};
firebase.initializeApp(config);


class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value: "temp",
      shouldShow: false,
      output: "failed",
    }
    this.testClick = this.testClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  testClick = () => {
    // gets value based on key in input
    var database = firebase.database();
    var val = database.ref('/keys/' + this.state.value).once('value').then((snapshot) => {
      var temp = (snapshot.val());
      console.log(temp.priv)
      this.setState({shouldShow: true, output: temp.priv})
    }).catch((snapshot) => {
      // Reject keys not in database
      alert("Key is invalid!");
      console.log("invalid key");
    });
    
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  render () {
    // successful code!
    if (this.state.shouldShow) {
      return (
        <div>
          <p>{this.state.output}</p>
        </div>
      )
    }
    // default site
    return (
      <div className="App">
        <form>
          <label>
             Code:
            <input type="text" name="code" onChange={this.handleChange} />
          </label>
        </form>
        <button onClick={this.testClick}>Click Me</button>
        <p>{this.state.value}</p>
      </div>
    );
  }
}

export default App;
