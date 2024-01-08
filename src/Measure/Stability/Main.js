// React and Redux
import React, { useState } from "react";

// UI components and style
import { 
  Box, 
  Grid, 
  Tab,
  Typography
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import AmpStabilitySettings from "./AmpStabilitySettings";
import MeasurementStatus from '../Shared/MeasurementStatus';
import TimeSeriesGraph from './TimeSeriesGraph';
import '../../components.css'
import './Main.css'

import Attenuator from "../../Hardware/WarmIFPlate/Attenuator";
import TimeSeriesList from "./TimeSeriesList";
import AllanVarianceGraph from "./AllanVarianceGraph";

export default function StabilityMain(props) {
  const [settingsTab, setSettingsTab] = useState('0');
  const [displayTab, setDisplayTab] = useState('0')

  return (
    <Grid container>
      <Grid item xs={3.5}>
        <TabContext value={settingsTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList 
              onChange={(e, val) => setSettingsTab(val)} 
              aria-label="Stability settings"
            >
              <Tab label="Amplitude Stability" value="0" />
            </TabList>
          </Box>
          <TabPanel value = "0">
            <AmpStabilitySettings/>
          </TabPanel>
        </TabContext>    
      </Grid>
      
      <Grid item xs={5}>
        <TabContext value={displayTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
           <TabList 
            onChange={(e, val) => setDisplayTab(val)} 
            aria-label="Stability display" 
            textColor="secondary"
            indicatorColor="secondary"
            >
              <Tab label="Time series" value="0"/>
              <Tab label="Allan variance" value="1"/>
           </TabList>
          </Box>
          <TabPanel value = "0" padding = {0}>
            <Box>
              <TimeSeriesGraph/>
            </Box>
          </TabPanel>
          <TabPanel value = "1" padding = {0}>
            <Box>
              <AllanVarianceGraph/>
              <Typography 
                paddingTop="20px" 
                fontWeight="bold" 
                align="center"
                color="primary"
              >
                Select sub-test to view results:</Typography>
              <TimeSeriesList/>          
            </Box>
          </TabPanel>   
        </TabContext>
      </Grid>
      
      <Grid item xs={3.5}>
        <Grid container>
          <Grid item xs={12}>
            <Attenuator/>
          </Grid>          
          <Grid item xs={12}>&nbsp;</Grid>
          <Grid item xs={12}>
            <MeasurementStatus childKeyName="Time series key"/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>    
  )
}
