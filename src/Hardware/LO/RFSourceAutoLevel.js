// React and Redux
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'

// UI components and style
import { Grid, Button, OutlinedInput, Typography } from '@mui/material'
import '../../components.css'
import EnableButton from "../../Shared/EnableButton";
import AppEventDialog from '../../Shared/AppEventDialog';
import RFPowerGraph from "./RFPowerGraph";
import { resetSequence } from "../../Shared/AppEventSlice";

// HTTP and store
import axios from "axios";

export default function RFSourceAutoLevel(props) {
  const dispatch = useDispatch();
  const rfPowerState = useSelector((state) => state.AppEvent.rfPower);

  // Local state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [target, setTarget] = useState(-5);
  const [freqIF, setFreqIF] = useState(10);
  const [atten, setAtten] = useState(22);
  const [usePNA, setUsePNA] = useState(false);

  const rfPowerLen = rfPowerState.y.length;
  const rfPower = rfPowerLen > 0 ? (rfPowerState.y[rfPowerLen - 1].toFixed(2)) + (usePNA ? " dB" : " dBm") : ""

  const onClickRun = () => {
    dispatch(resetSequence("rfPower"));
    setDialogOpen(true);
    const params = {
      freqIF: Number(freqIF),
      target: Number(target),
      atten: Number(atten)
    }
    axios.put('/rfsource/auto_rf' + (usePNA ? '/pna' : '/meter'), null, {params: params})
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
    setTimeout(() => {setDialogOpen(false)}, 10000);
  }

  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={12}><Typography variant="body1" fontWeight="bold">Auto Level</Typography></Grid>  
      
      <Grid item xs={3}>
        <Typography variant="body2" display="inline" paddingTop="4px">Target [dBm]:</Typography>
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          size="small"
          margin="none"          
          style={{width: '90%'}}
          className="smallinput"
          onChange={e => setTarget(e.target.value)}
          value = {target}
        />
      </Grid>
      <Grid item xs={0.5}/>
      <Grid item xs={2.5}>
        <EnableButton
          enableColor = "green"
          disableColor = "blue"
          enableText = "PNA"
          disableText = "METER"
          enable={usePNA}          
          onClick={e => {setUsePNA(!usePNA)}}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          className="custom-btn-sm"
          variant="contained"
          size="small"
          onClick={e => {onClickRun()}}
        >
          RUN
        </Button>
        <AppEventDialog
          open={dialogOpen}
          title="Setting RF Power"
          onClose={() => {setDialogOpen(false)}}              
        >
          <Typography variant="body1" fontWeight="bold" color="secondary" align="center">
            RF power: {rfPower} 
          </Typography>
          <RFPowerGraph 
            onComplete={() => {setDialogOpen(false)}}
          />
        </AppEventDialog>
      </Grid>
      
      <Grid item xs={3}>
        <Typography variant="body2" display="inline" paddingTop="4px">IF [GHz]:</Typography>
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          size="small"
          margin="none"          
          style={{width: '90%'}}
          className="smallinput"
          onChange={e => setFreqIF(e.target.value)}
          value = {freqIF}
        />
      </Grid>
      <Grid item xs={6}/>

      <Grid item xs={3}>
        <Typography variant="body2" display="inline" paddingTop="4px">IF atten [dB]:</Typography>
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          size="small"
          margin="none"          
          style={{width: '90%'}}
          className="smallinput"
          onChange={e => setAtten(e.target.value)}
          value={atten}
        />
      </Grid>
      <Grid item xs={3}/>

    </Grid>
  );
};
