import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Button, Paper, Typography } from '@material-ui/core';

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require('firebase/database');

// establish firebase configs
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
firebase.initializeApp(config);


class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value: "temp",
      shouldShow: false,
      output: "failed",
      text: ""
    }
    this.testClick = this.testClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  testClick = () => {
    // gets value based on key in input
    if (this.state.text.length < 10) {
      alert("Letter is too short!");
      return;
    }
    var database = firebase.database();
    var val = database.ref('/keys/' + this.state.value).once('value').then((snapshot) => {
      var temp = (snapshot.val());
      console.log(temp.priv)
      this.setState({shouldShow: true, output: temp.priv})
    }).catch((snapshot) => {
      // Reject keys not in database
      alert("Key is invalid!");
      console.log(snapshot);
    });
    
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleChange2(event) {
    this.setState({text: event.target.value});
  }
  render () {
    // successful code!
    if (this.state.shouldShow) {
      return (
        <div className="App">
          <h1>Key Unlocked!</h1>
          <p>Your decrypt key is: {this.state.output}</p>
          <a href="https://raw.githubusercontent.com/bucktower/other-ethical-proj/master/decrypt.py">Download Here</a>
          <h2>Instructions</h2>
          <p>Save the above python script. In a command line terminal, run "python3 decrypt.py {this.state.output}". Make sure the folder to decrypt only contains the encrypted files.</p>
        </div>
      )
    }
    // default site
    return (
      <div className="App">
        <Container fixed style={{paddingTop: "25px"}}>
        <Paper>
        <Typography variant="h5" component="h2" style={{paddingTop: "20px"}}>
          You've Been Hacked!
        </Typography>
        <form>
          <br></br>
          <label>
             Code:
            <input type="text" name="code" onChange={this.handleChange} style={{marginLeft: "5px"}}/>
          </label>
          <br></br>
          <br></br>
          <label>
             Thank You Note:
            <input type="text" name="code" onChange={this.handleChange2} style={{marginLeft: "5px"}}/>
          </label>
        </form>
        <br></br>
        <Button variant="contained" color="primary" onClick={this.testClick} style={{marginBottom: "20px"}}>Submit</Button>
        </Paper>
        </Container>
      </div>
    );
  }
}

export default App;
