// React and Redux
import React from "react";

// UI components and style
import { Box, Grid } from '@mui/material'
import MeasControl from './MeasControl';
import SelectCartridge from '../../Config/SelectCartridge'
import SystemStatus from './SystemStatus';
import Typography from '@mui/material/Typography';
import RefSource from '../../Hardware/ReferenceSources/RefSource';

export default function PageHeader(props) {
  return (
    <Grid container spacing={0}>
      <Grid item xs={0.5}/>
      <Grid item xs={2} paddingTop="20px">
        <Typography variant="h5"><b>{props.title}</b></Typography>
      </Grid>
      <Grid item xs={5.5}>
        <Box
          component="form"
          noValidate
        >
          <Grid container>
            {props.showCartSelect && (
              <Grid item xs={3}>
                <SelectCartridge/>
              </Grid>
            )}
            {!props.showCartSelect && (
              <Grid item xs={3}/>
            )}          
            {props.showMeasControl && (
              <Grid item xs={9}>
                <MeasControl 
                  measDescription={props.title}
                  startUrl={props.startUrl}
                  stopUrl={props.stopUrl}
                />
              </Grid>
            )}
            {!props.showMeasControl && (     
              <Grid item xs={9}/>
            )}
          </Grid>
          <Grid item>
            {props.showLORef && (
              <RefSource isRfSource={false}/>
            )}
            {props.showRFRef && (
              <RefSource isRfSource={true}/>
            )}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={4}>        
        <SystemStatus/>
      </Grid>
      <Grid item>&nbsp;</Grid>
    </Grid>
  );
}