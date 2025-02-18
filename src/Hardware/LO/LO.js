import React from "react";

import {Grid, Typography} from '@mui/material';

import '../../components.css'
import AMC from './AMC'
import YTO from './YTO'
import PLL from './PLL'
import PA from './PA'
import RFSourceAutoLevel from "./RFSourceAutoLevel";
import SelectWCA from "../../Config/SelectWCA";

export default function LO(props) {
  return (
    <Grid container sx={{border:1, borderColor: "rgba(0, 0, 255, 0.25)"}}>

      <Grid item xs={6} height="8px" sx={{borderRight:1, borderColor: "rgba(0, 0, 255, 0.25)"}}>&nbsp;</Grid>
      <Grid item xs={6} height="8px">&nbsp;</Grid>

      <Grid item xs={1.9}/>
      <Grid item xs={2} textAlign="center">
        <Typography variant="h6">Local Oscillator</Typography>
      </Grid>
      <Grid item xs={2}>
        <SelectWCA isRfSource={false} id="select-wca"/>
      </Grid>
      <Grid item xs={0.1}/>

      <Grid item xs={1.9} sx={{borderLeft:1, borderColor: "rgba(0, 0, 255, 0.25)"}}/>
      <Grid item xs={2} textAlign="center">
        <Typography variant="h6">RF Source</Typography>
      </Grid>
      <Grid item xs={2}>
        <SelectWCA isRfSource={true} id="select-rfsource"/>
      </Grid>
      <Grid item xs={0.1}/>
      
      <Grid item xs={3}><PLL key="LOPLL" isRfSource={false}/></Grid>
      <Grid item xs={3} sx={{borderRight:1, borderColor: "rgba(0, 0, 255, 0.25)"}}><YTO key="LOYTO" isRfSource={false}/></Grid>
      
      <Grid item xs={3}><PLL key="RFPLL" isRfSource={true}/></Grid>      
      <Grid item xs={3}>
        <YTO key="RFYTO" isRfSource={true}/>
        <Grid item xs={3}><br/></Grid>
        <RFSourceAutoLevel/>
      </Grid>
      
      <Grid item xs={6} sx={{borderRight:1, borderColor: "rgba(0, 0, 255, 0.25)"}}><br/></Grid>
      <Grid item xs={6}><br/></Grid>
      <Grid item xs={3}><AMC key="LOAMC" isRfSource={false}/></Grid>
      <Grid item xs={3} sx={{borderRight:1, borderColor: "rgba(0, 0, 255, 0.25)"}}><PA key="LOPA" isRfSource={false}/></Grid>          
      
      <Grid item xs={3}><AMC key="RFAMC" isRfSource={true}/></Grid>
      <Grid item xs={3}><PA key="RFPA" isRfSource={true}/></Grid>
      <Grid item xs={3}></Grid>
    </Grid>
  );
}
