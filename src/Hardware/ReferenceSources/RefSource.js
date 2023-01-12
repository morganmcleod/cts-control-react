// React and Redux
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import EnableButton from '../../Shared/EnableButton';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { loRefSetFreqGHz, loRefSetAmpDBm, loRefSetEnable, loRefSetStatus} from './LORefSlice'
import { rfRefSetFreqGHz, rfRefSetAmpDBm, rfRefSetEnable, rfRefSetStatus} from './RFRefSlice'

export default function RefSource(props) {
  // State for user input prior to clicking one of the SET buttons
  const [inputFreq, setInputFreq] = useState("");
  const [inputAmp, setInputAmp] = useState("");
  
  // Redux store interface
  const status = useSelector((state) => props.isRfSource ? state.RFRef : state.LORef);
  const dispatch = useDispatch();

  // URL prefix
  const prefix = props.isRfSource ? '/rfref' : '/loref'
  const title = props.isRfSource ? 'RF Reference' : 'LO Reference'

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get(prefix + '/status')
      .then(res => {
        dispatch(props.isRfSource ? rfRefSetStatus(res.data) : loRefSetStatus(res.data));
        setInputFreq(res.data.freqGHz);
        setInputAmp(res.data.ampDBm);        
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, prefix, props.isRfSource]);

  // Load only on first render
  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSetButton = (e) => {
    if (e.target.name === "set-freq") {
      dispatch(props.isRfSource ? rfRefSetFreqGHz(inputFreq) : loRefSetFreqGHz(inputFreq));
      axios.put(prefix + "/frequency", null, {params: {value: inputFreq}})
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
    } else if (e.target.name === "set-amp") {
      dispatch(props.isRfSource ? rfRefSetAmpDBm(inputAmp) : loRefSetAmpDBm(inputAmp));
      axios.put(prefix + "/amplitude", null, {params: {value: inputAmp}})
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
    }
  }
  
  // ENABLE button handler
  const onClickEnable = (e) => {
    const enable = e.currentTarget.value !== 'true';
    console.log('onClickEnable ' + enable);
    dispatch(props.isRfSource ? rfRefSetEnable(enable) : loRefSetEnable(enable));
    axios.put(prefix + "/output", null, {params: {enable: enable}})
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <Grid container>
      <Grid item xs={3}/>      
      <Grid item xs={9}><Typography variant="body2"><b>{title}</b></Typography></Grid>

      <Grid item xs={3}/>
      <Grid item xs={2}><Typography variant="body2">Frequency:</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          size="small"
          margin="none"          
          style={{ width: '60%' }}
          className="smallinput"
          onChange={(e) => setInputFreq(e.target.value)}
          value = {inputFreq}
        />
        <Typography variant="body2" fontWeight="bold" display="inline">&nbsp;GHz</Typography>
      </Grid>
      <Grid item xs={2}>
        <Button
          name="set-freq"
          className="custom-btn-sm"
          variant="contained"
          size="small"
          onClick={(e) => handleSetButton(e)}
        >
          SET
        </Button>
      </Grid>
      <Grid item xs={2}/>

      <Grid item xs={3}/>
      <Grid item xs={2}><Typography variant="body2">Amplitude</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          size="small"
          margin="none"          
          style={{ width: '60%' }}
          className="smallinput"
          onChange={(e) => setInputAmp(e.target.value)}
          value = {inputAmp}
        />
        <Typography variant="body2" fontWeight="bold" display="inline">&nbsp;dBm</Typography>
      </Grid>
      <Grid item xs={2}>
        <Button
          name="set-amp"
          className="custom-btn-sm"
          variant="contained"
          size="small"
          onClick={(e) => handleSetButton(e)}
        >
          SET
        </Button>
      </Grid>
      <Grid item xs={2}/>

      <Grid item xs={7.75}/>
      <Grid item xs={2}>
        <EnableButton
          enableColor="green"
          enable={status.enable}
          onClick={(e) => onClickEnable(e)}
        ></EnableButton>
      </Grid>
    </Grid>
  );
}