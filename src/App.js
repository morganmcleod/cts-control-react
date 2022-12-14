import './App.css'
import React from 'react';
import { ThemeProvider } from "@mui/material/styles";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'

import { ThemeContext, loadTheme, mapTheme } from "./themes";
import CCA from './Hardware/Cartridge/CCA';
import LO from './Hardware/LO/LO';
import RFSource from './Hardware/LO/RFSource';
import CTSAppBar from './Shared/AppBar';
import TabPanel from './Shared/TabPanel';
import BeamScannerMain from './Measure/BeamScanner/Main';
import SystemStatus from './Measure/Shared/SystemStatus';

import axios from "axios";
axios.defaults.baseURL = 'http://localhost:8000';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.setTheme = (themeId) => {
      this.setState({theme: mapTheme(themeId)});      
    };

    this.state = {
      theme: loadTheme(),
      setTheme: this.setTheme,
      visibleTab: 0
    }
  }

  setVisibleTab = (index) => {
    this.setState({visibleTab: index});
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
        <CTSAppBar setVisibleTab={this.setVisibleTab}/>
        <ThemeProvider theme={theme}>
          <Box
            minHeight={"100vh"}
            padding={"5px"}
            style={containerStyle}
          >            
            <TabPanel index={0} visibleTab={this.state.visibleTab}>
              <Grid container spacing={0} className="component-data">
                <Grid item xs={6} className="component-header">Cold Cartridge</Grid>
                <Grid item xs={6} paddingBottom={"10px"}>
                  <SystemStatus/>
                </Grid>
              </Grid>
              <CCA/>
            </TabPanel>
            <TabPanel index={1} visibleTab={this.state.visibleTab}>
              <Grid container spacing={0} className="component-data">
                <Grid item xs={6} className="component-header">Local Oscillator</Grid>
                <Grid item xs={6} paddingBottom={"10px"}>
                  <SystemStatus/>
                </Grid>
              </Grid>
              <LO/>
            </TabPanel>
            <TabPanel index={2} visibleTab={this.state.visibleTab}>
              <Grid container spacing={0} className="component-data">
                <Grid item xs={6} className="component-header">RF Source</Grid>
                <Grid item xs={6} paddingBottom={"10px"}>
                  <SystemStatus/>
                </Grid>
              </Grid>
              <RFSource/>
            </TabPanel>
            <TabPanel index={3} visibleTab={this.state.visibleTab}>
              <Grid container spacing={0} className="component-data">
                <Grid item xs={6} className="component-header">Beam Patterns</Grid>
                <Grid item xs={6} paddingBottom={"10px"}>
                  <SystemStatus/>
                </Grid>
              </Grid>
              <BeamScannerMain/>
            </TabPanel>
            <Box flex={1} overflow="auto"/>
          </Box>
        </ThemeProvider>
      </ThemeContext.Provider>
    );
  }
}

export default App;
