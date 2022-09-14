import logo from './logo.svg';
import './App.css';
import React from 'react';
const axios = require('axios').default
axios.defaults.baseURL = 'http://localhost:8000';

class CartridgeTemps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp0: 0,
      temp1: 0,
      temp2: 0,
      temp3: 0,
      temp4: 0,
      temp5: 0
    }
  }
  render() {
    return (<div>
      temp0: {this.state.temp0}<br/>
      temp1: {this.state.temp1}<br/>
    </div>);
  }
  componentDidMount() {
    axios.get(`/cca/tempsensors`)
      .then(res => {
        const temps = res.data;
        this.setState({ 
          temp0: temps.temp0,
          temp1: temps.temp1,
          temp2: temps.temp2,
          temp3: temps.temp3,
          temp4: temps.temp4,
          temp5: temps.temp5
         });
      })
  }
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <CartridgeTemps />
      </header>
    </div>
  );
}

export default App;
