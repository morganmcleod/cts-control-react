// React and Redux
import React, { useState, useEffect } from "react";

// UI components and style
import { Box, Grid, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import NoiseTempSettings from "./NoiseTempSettings";
import CommonSettings, { fetchCommonSettings } from "./CommonSettings";
import WarmIFGraph from "./WarmIFGraph";
import '../../components.css'

import Temperatures from "../../Hardware/TemperatureMonitor/Temperatures"
import MeasurementStatus from '../Shared/MeasurementStatus';
import WarmIFSettings from "./WarmIFSettings";
import YFactorGraph from "./YFactorGraph";
import YFactorControls from "./YFactorControls"
import ChopperPowerGraph from "./ChopperPowerGraph";
import RawDataDisplay from "./RawDataDisplay";
import ColdLoad from "./ColdLoad";

export default function NoiseTempMain(props) {
  const [settingsTab, setSettingsTab] = useState('1');
  const [displayTab, setDisplayTab] = useState('1')

  useEffect(() => {
    // fetch this here because Y-factor uses tColdEff
    fetchCommonSettings();
  }, [])

  return (
    <Grid container>
      <Grid item xs={3.5}>
        <TabContext value={settingsTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList 
              onChange={(e, val) => setSettingsTab(val)} 
              aria-label="Noise temperature settings"
            >
              <Tab label="Settings" value="0" />
              <Tab label="Noise Temperature" value="1" />
              <Tab label="LO WG Integrity" value="2" />
            </TabList>
          </Box>
          <TabPanel value = "0">
            <CommonSettings/>
            <WarmIFSettings/>
          </TabPanel>
          <TabPanel value = "1">
            <NoiseTempSettings isLoWg={false}/>
          </TabPanel>
          <TabPanel value = "2">
            <NoiseTempSettings isLoWg={true}/>
          </TabPanel>
        </TabContext>    
      </Grid>
      
      <Grid item xs={5}>
        <TabContext value={displayTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
           <TabList 
            onChange={(e, val) => setDisplayTab(val)} 
            aria-label="Noise temperature display" 
            textColor="secondary"
            indicatorColor="secondary"            
          >
              <Tab label="Warm IF" value="0" />
              <Tab label="Raw NT" value="1" />
              <Tab label="Y-Factor" value="2" />
           </TabList>
          </Box>
          <TabPanel value = "0">
          <Box paddingTop="10px">
            <WarmIFGraph/>
          </Box>            
          </TabPanel>
          <TabPanel value = "1">
            <ChopperPowerGraph/>
            <RawDataDisplay/>
          </TabPanel>
          <TabPanel value = "2">
            <YFactorControls/>
            <YFactorGraph/>
          </TabPanel>
        </TabContext>
      </Grid>
      
      <Grid item xs={3.5}>
        <Grid container>
          <Grid item>
            <Temperatures/>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>
            <ColdLoad/>
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>
            <MeasurementStatus/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>    
  )
}
