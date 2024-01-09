// React and Redux
import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

// UI components and style
import { 
  Box, 
  Grid, 
  Tab,
  Typography
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import StabilitySettings from "./StabilitySettings";
import MeasurementStatus from '../Shared/MeasurementStatus';
import LiveTimeSeries from './LiveTimeSeries';
import TimeSeriesGraph from './TimeSeriesGraph';
import TimeSeriesList from "./TimeSeriesList";
import AllanGraph from "./AllanGraph";
import '../../components.css'
import './Main.css'

import { setMode, setDisplayTab } from './StabilitySlice';
import { setTestTypeId } from "../Shared/MeasureSlice";
import TestTypes from "../../Shared/TestTypes";

export default function StabilityMain(props) {
  const mode = useSelector((state) => state.Stability.mode);
  const displayTab = useSelector((state) => state.Stability.displayTab);
  const settingsTab = (mode && mode === 'phase') ? '1' : '0';
  const plotTitle = (mode && mode === 'phase') ? "Allan Deviation" : "Allan Variance";
  const globalMode = mode ? mode : "amplitude";
  const dispatch = useDispatch();

  const onTabChange = useCallback((val) => {
    dispatch(setMode((val === '1') ? 'phase' : 'amplitude'));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setTestTypeId((mode === 'phase') ? TestTypes.PHASE_STABILITY : TestTypes.AMP_STABILITY));
  }, [dispatch, mode])

  return (
    <Grid container>
      <Grid item xs={3.5}>
        <TabContext value={settingsTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList 
              onChange={(e, val) => onTabChange(val)} 
              aria-label="Stability settings"
            >
              <Tab label="Amplitude Stability" value="0"/>
              <Tab label="Phase Stability" value="1"/>
            </TabList>
          </Box>
          <TabPanel value = "0">
            <StabilitySettings mode='amplitude'/>
          </TabPanel>
          <TabPanel value = "1">
            <StabilitySettings mode='phase'/>
          </TabPanel>
        </TabContext>    
      </Grid>
      
      <Grid item xs={5}>
        <TabContext value={displayTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
           <TabList 
            onChange={(e, val) => dispatch(setDisplayTab(val))} 
            aria-label="Stability display" 
            textColor="secondary"
            indicatorColor="secondary"
            >
              <Tab label="Current measurement" value="0"/>
              <Tab label="Time series" value="1"/>
              <Tab label={plotTitle} value="2"/>
           </TabList>
          </Box>
          <TabPanel value = "0" padding = {0}>
            <LiveTimeSeries mode={globalMode}/>
          </TabPanel>
          <TabPanel value = "1" padding = {0}>
            <Typography variant="body2" fontWeight="bold" color="secondary">
              Select sub-test to view results
            </Typography>
            <TimeSeriesList mode={globalMode}/>
            <br/>
            <TimeSeriesGraph mode={globalMode}/>
          </TabPanel>
          <TabPanel value = "2" padding = {0}>
            <Typography variant="body2" fontWeight="bold" color="secondary">
              Select sub-test to view results
            </Typography>
            <TimeSeriesList mode={globalMode}/>
            <br/>
            <AllanGraph mode={globalMode}/>            
          </TabPanel>   
        </TabContext>
      </Grid>

      <Grid item xs={3.5}>
        <Grid container>
          <Grid item xs={12}>
            <MeasurementStatus childKeyName="Time series key"/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>    
  )
}
