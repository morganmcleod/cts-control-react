import './App.css'
import Grid from '@mui/material/Grid'
import CCA from './components/CCA'
import LO from './components/LO'

import React from 'react';
const axios = require('axios').default
axios.defaults.baseURL = 'http://localhost:8000';

function App() {
  return (
    <header className="App-header">
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>Cold Cartridge</Grid>
        <Grid item xs={12}><CCA/></Grid>
        <Grid item xs={12}>Local Oscillator</Grid>
        <Grid item xs={12}><LO/></Grid>
      </Grid>
    </header>
  );
}

export default App;
