import './App.css';
import React from 'react';
import SIS from './components/SIS'
import CartridgeTemps from './components/CartridgeTemps';

const axios = require('axios').default
axios.defaults.baseURL = 'http://localhost:8000';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SIS pol="0" sis="1"/>
        <CartridgeTemps />
      </header>
    </div>
  );
}

export default App;
