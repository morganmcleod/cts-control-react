import './App.css'
import { ThemeProvider } from "@mui/material/styles";
import Box from '@mui/material/Box';
import CCA from './components/CCA'
import LO from './components/LO'
import CTSAppBar from './components/AppBar'
import BeamScannerMain from './components/BeamScanner/Main';
import { ThemeContext, loadTheme, mapTheme } from "./themes";
import eventBus from './components/EventBus';
import React from 'react';
const axios = require('axios').default
axios.defaults.baseURL = 'http://localhost:8000';


class TabPanel extends React.Component {
  constructor(props) {
    super(props);
    this.index = props.index ?? 0;
    this.state = { visibleIndex: 0 }
  }
  componentDidMount() {
    eventBus.on("AppBar-click", (index) => {
      console.log("AppBar-click " + index);
      this.setState({visibleIndex: index});
    });
  }

  componentWillUnmount() {
    eventBus.remove("AppBar-click")
  }

  render() {
    return (
      <div
        hidden={this.state.visibleIndex !== this.index}
        id={`simple-tabpanel-${this.index}`}
      >
        {this.state.visibleIndex === this.index && (          
          <Box sx={{ p: 3 }}>
            {this.props.children}
          </Box>
        )}
      </div>
      )
  }
}

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
        <CTSAppBar/>
        <ThemeProvider theme={theme}>
          <Box
            minHeight={"100vh"}
            padding={"20px"}
            style={containerStyle}
          >            
            <TabPanel index={0}>
              <CCA/>
            </TabPanel>
            <TabPanel index={1}>
              <LO/>
            </TabPanel>
            <TabPanel index={3}>
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
