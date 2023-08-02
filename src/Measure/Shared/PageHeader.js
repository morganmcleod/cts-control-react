// React and Redux
import React from "react";

// UI components and style
import { Grid } from '@mui/material'
import MeasControl from './MeasControl';
import SelectCartridge from '../../Config/SelectCartridge'
import SystemStatus from './SystemStatus';
import Typography from '@mui/material/Typography';
import RefSource from '../../Hardware/ReferenceSources/RefSource';

export default function PageHeader(props) {
  return (
    <Grid container paddingBottom="5px">

      {/* Title */}
      <Grid item xs={2} paddingTop="20px" paddingLeft="25px">
        <Typography variant="h5"><b>{props.title}</b></Typography>
      </Grid>

      {/* Cart select */}
      <Grid item xs={1.1}>
        <Grid container>

          {/* show cartridge SN select? */}
          {props.showCartSelect && (
            <Grid item><SelectCartridge/></Grid>
          )}

        </Grid>
      </Grid>

      {/* Measurement ctrls OR LO references */}
      <Grid item xs={5.4}>
        <Grid container>

          {/* show measurment start/stop controls? */}
          {props.showMeasControl && (
            <Grid item>
              <MeasControl 
                measDescription={props.title}
                startUrl={props.startUrl}
                stopUrl={props.stopUrl}
              />
            </Grid>
          )}

          {/* show LO reference */}
          {props.showLORef && (
            <>
              <Grid item xs={6}><RefSource isRfSource={false}/></Grid>
              <Grid item xs={6}><RefSource isRfSource={true}/></Grid>
            </>
          )}
        </Grid>
      </Grid>

      {/* System status */}
      <Grid item xs={3.5} paddingBottom="2px">
        <SystemStatus/>
      </Grid>
    </Grid>
  );
}