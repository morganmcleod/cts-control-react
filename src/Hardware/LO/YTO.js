// React and Redux
import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Button, OutlinedInput, Typography } from '@mui/material'
import '../../components.css'

// HTTP and store
import axios from "axios";
import { loSetYTO, loSetYTOCourseTune } from './LOSlice'
import { rfSetYTO, rfSetYTOCourseTune } from './RFSlice'

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
    dispatch(props.isRfSource ? rfSetYTOCourseTune(params.courseTune) : loSetYTOCourseTune(params.courseTune));
    axios.put(prefix + '/yto/coursetune', params)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={12}><Typography variant="body1" fontWeight="bold">YTO</Typography></Grid>        

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">low [GHz]:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{yto.lowGHz}</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setLow"
          size="small"
          margin="none"          
          onChange={e => setInputLowGHz(e.target.value)}
          value = {inputLowGHz}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={0.5}/>
      <Grid item xs={3.5}>
        <Button
          className="custom-btn-sm"
          variant="contained"
          size="small"
          onClick={e => setLimitsHandler()}
        >
          SET
        </Button>
      </Grid>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">high [Ghz]:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{yto.highGHz}</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setHigh"
          size="small"
          margin="none"          
          onChange={e => setInputHighGHz(e.target.value)}
          value = {inputHighGHz}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={4}/>
     

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">courseTune:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{yto.courseTune}</Typography></Grid>
      <Grid item xs={3}>
        <Button 
          className="custom-btn-sm"
          variant="contained"
          size="small"
          style={{
            maxWidth: '40%',
            minWidth: '40%'              
          }}
          onClick={e => tweakYTO(-1)}
        >-1</Button>
        <Button 
          className="custom-btn-sm" 
          variant="contained"
          size="small"
          style={{
            maxWidth: '40%',
            minWidth: '40%'
          }}
          onClick={e => tweakYTO(1)}
        >+1</Button>
      </Grid>
      <Grid item xs={4}/>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">YTO freq:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold" paddingTop="2px">{yto.ytoFreqGHz.toFixed(3)} GHz</Typography></Grid>
    </Grid>
  );
};
