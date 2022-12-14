// React and Redux
import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { loSetYTO } from './LOSlice'
import { rfSetYTO } from './RFSlice'

export default function YTO(props) {
  // State for user input prior to clicking the SET button
  const [inputLowGHz, setInputLowGHz] = useState("");
  const [inputHighGHz, setInputHighGHz] = useState("");

  // Redux store interfaces
  const yto = useSelector((state) => props.isRfSource ? state.RF.YTO : state.LO.YTO);
  const dispatch = useDispatch();

  // URL prefix
  const prefix = props.isRfSource ? '/rfsource' : '/lo'

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get(prefix + '/yto')
      .then(res => {
        const yto = res.data;
        dispatch(props.isRfSource ? rfSetYTO(yto) : loSetYTO(yto));
        if (inputLowGHz === "")
          setInputLowGHz(yto.lowGHz);
        if (inputHighGHz === "")
          setInputHighGHz(yto.highGHz);
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, inputHighGHz, inputLowGHz, prefix, props.isRfSource]);

  // Load only on first render
  useEffect(() => {
    fetch();
  }, [fetch]);

  // SET button handler
  const setLimitsHandler = () => {
    const params = {
      lowGHz:  Number(inputLowGHz),
      highGHz: Number(inputHighGHz)
    }
    axios.put(prefix + '/yto/limits', params)
      .then(res => {
        console.log(res.data);
        fetch();
      })
      .catch(error => {
        console.log(error);
      })
  }

  // -1 and +1 buttons handler
  const tweakYTO = (amount) => {
    const params = {
      courseTune: yto.courseTune + amount
    }
    axios.put(prefix + '/yto/coursetune', params)
      .then(res => {
        console.log(res.data);
        fetch();
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <Grid container spacing={0} className="component-data">
      <Grid item xs={12} className="component-header">YTO</Grid>        

      <Grid item xs={3} className="component-title">low [GHz]:</Grid>
      <Grid item xs={2}>{yto.lowGHz}</Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setLow"
          size="small"
          margin="none"
          className="component-input"
          onChange={e => setInputLowGHz(e.target.value)}
          value = {inputLowGHz}
        />
      </Grid>
      <Grid item xs={4}/>
      
      <Grid item xs={3} className="component-title">high [Ghz]:</Grid>
      <Grid item xs={2}>{yto.highGHz}</Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setHigh"
          size="small"
          margin="none"
          className="component-input"
          onChange={e => setInputHighGHz(e.target.value)}
          value = {inputHighGHz}
        />
      </Grid>
      <Grid item xs={0.5}/>
      <Grid item xs={3.5}>
        <Button
          className="custom-btn"
          variant="contained"
          size="small"
          onClick={e => setLimitsHandler()}
        >
          SET
        </Button>
      </Grid>

      <Grid item xs={3} className="component-title">courseTune:</Grid>
      <Grid item xs={2}>{yto.courseTune}</Grid>
      <Grid item xs={3}>
        <Button 
          className="custom-btn"
          variant="contained"
          size="small"
          style={{
            maxWidth: '30%',
            minWidth: '30%'              
          }}
          onClick={e => tweakYTO(-1)}
        >-1</Button>
        <Button 
          className="custom-btn" 
          variant="contained"
          size="small"
          style={{
            maxWidth: '30%',
            minWidth: '30%'
          }}
          onClick={e => tweakYTO(1)}
        >+1</Button>
      </Grid>
      <Grid item xs={4}/>

      <Grid item xs={3} className="component-title">YTO freq:</Grid>
      <Grid item xs={8}>{yto.ytoFreqGHz.toFixed(3)} GHz</Grid>
      <Grid item xs={3} className="component-title">LO freq:</Grid>
      <Grid item xs={8}>{yto.loFreqGHz.toFixed(3)} GHz</Grid>
      
    </Grid>
  );
};
