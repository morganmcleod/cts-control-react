import React from "react";
import { Grid } from '@mui/material';
import RefSource from './RefSource'

import '../../components.css'

export default function RefSources(props) {
  return (
    <Grid container border={1} borderTop={0}>
      <Grid item xs={3}><RefSource isRfSource={false}/></Grid>
      <Grid item xs={3} sx={{borderRight:1}}/>
      <Grid item xs={3}><RefSource isRfSource={true}/></Grid>
      <Grid item xs={3}/>
    </Grid>
  );
}