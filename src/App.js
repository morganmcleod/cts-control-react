import './App.css'
import { ThemeProvider } from "@mui/material/styles";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'

import CCA from './components/CCA'
import LO from './components/LO'
import MainMenu from './components/MainMenu'
import { ThemeContext, loadTheme, mapTheme } from "./themes";

import React from 'react';
const axios = require('axios').default
axios.defaults.baseURL = 'http://localhost:8000';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.setTheme = (themeId) => {
      this.setState({theme: mapTheme(themeId)});      
    };

    this.state = {
      theme: loadTheme(),
      setTheme: this.setTheme
    }
  }

  render() {
    let theme = this.state.theme;
    let containerStyle = {
      backgroundColor: theme.palette.background.paper,
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
    };

    return (
      <ThemeContext.Provider value={this.state}>
        <ThemeProvider theme={theme}>
          <Box className="App-header"
            fluid="true"
            style={containerStyle}
          >
            <Stack spacing={0}>
              <Grid container>
                <Grid item xs={0.5}/>
                <Grid item xs={11}>
                  Cold Cartridge
                </Grid>
                <Grid item xs={0.5}>
                  <MainMenu/>
                </Grid>
              </Grid>
              <CCA/>
              <div style={{paddingTop:'5px'}}>
                Local Oscillator
              </div>
              <LO/>
            </Stack>
          </Box>
        </ThemeProvider>
      </ThemeContext.Provider>
    );
  }
}

export default App;
