import './App.css'
import React from 'react';
import { ThemeProvider } from "@mui/material/styles";
import { Box, Divider, Grid } from '@mui/material';

import { ThemeContext, loadTheme, mapTheme } from "./themes";
import AppEventHandler from './Shared/AppEventHandler';
import CCA from './Hardware/Cartridge/CCA';
import Presets from './Hardware/Cartridge/Presets';
import FEMC from './Hardware/FEMC/FEMC';
import CartBias from './Config/CartBias';
import LO from './Hardware/LO/LO';
import CTSAppBar from './Shared/AppBar';
import TabPanel from './Shared/TabPanel';
import PageHeader from './Measure/Shared/PageHeader';
import RefSources from './Hardware/ReferenceSources/RefSources';
import BeamScannerMain from './Measure/BeamScanner/Main';

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
        <AppEventHandler/>
        <CTSAppBar setVisibleTab={this.setVisibleTab}/>
        <ThemeProvider theme={theme}>
          <Box
            minHeight={"100vh"}
            padding={"5px"}
            style={containerStyle}
          >            
            <TabPanel index={0} visibleTab={this.state.visibleTab}>
              <PageHeader
                title="Cold Cartridge"
                showCartSelect={true}
              />
              <CCA/>
              <Grid container>
                <Grid item xs={6}>
                  <Presets/>
                </Grid>
                <Grid item xs={6}>
                  <FEMC/>
                </Grid>
              </Grid>              
            </TabPanel>
            <TabPanel index={1} visibleTab={this.state.visibleTab}>
              <PageHeader 
                title="LO & RF Source" 
                showLORef={true}
              />
              <LO/>
              <RefSources/>
            </TabPanel>
            
            <TabPanel index={2} visibleTab={this.state.visibleTab}>
              <PageHeader 
                title="Cartridge Bias"
                showCartSelect={true}
              />
              <CartBias/>
            </TabPanel>
            
            <TabPanel index={4} visibleTab={this.state.visibleTab}>
              <PageHeader 
                title="Beam Patterns" 
                showCartSelect={true}
                showMeasControl={true}
                startUrl="/measure/start"
                measureType={2}
                stopUrl="/measure/stop"                
              />
              <Divider variant="fullWidth" color="blue"/>
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
