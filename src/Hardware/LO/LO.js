import React from "react";

import Grid from '@mui/material/Grid'

import '../../components.css'
import AMC from './AMC'
import YTO from './YTO'
import PLL from './PLL'
import PA from './PA'

export default function LO(props) {
  return (
    <Grid container sx={{border:1}}> 
      <Grid item xs={3} sx={{borderRight:1}}><YTO isRfSource={false}/></Grid>
      <Grid item xs={3} sx={{borderRight:1}}><PLL isRfSource={false}/></Grid>
      <Grid item xs={3} sx={{borderRight:1}}><PA isRfSource={false}/></Grid>          
      <Grid item xs={3}><AMC isRfSource={false}/></Grid>
    </Grid>
  );
}
