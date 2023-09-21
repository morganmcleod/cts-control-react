// React and Redux
import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Button, OutlinedInput, Typography } from '@mui/material'
import '../../components.css'

// HTTP and store
import axios from "axios";
import { 
  loSetYTO, 
  loSetYTOLowInput,
  loSetYTOHighInput,
  loSetYTOSendNow,
  loSetYTOCourseTune 
} from './LOSlice'
import { 
  rfSetYTO, 
  rfSetYTOLowInput,
  rfSetYTOHighInput,
  rfSetYTOSendNow,
  rfSetYTOCourseTune 
} from './RFSlice'

export default function YTO(props) {
  const [lowChanged, setLowChanged] = useState(false);
  const [highChanged, setHighChanged] = useState(false);

  // Redux store interfaces
  const ytoState = useSelector((state) => props.isRfSource ? state.RF.YTO : state.LO.YTO);
  const ytoInputs = useSelector((state) => props.isRfSource ? state.RF.YTOInputs : state.LO.YTOInputs);
  const setYTOLowInput = props.isRfSource ? rfSetYTOLowInput : loSetYTOLowInput;
  const setYTOHighInput = props.isRfSource ? rfSetYTOHighInput : loSetYTOHighInput;
  const dispatch = useDispatch();

  // URL prefix
  const prefix = props.isRfSource ? '/rfsource' : '/lo'

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get(prefix + '/yto')
      .then(res => {
        const yto = res.data;
        dispatch(props.isRfSource ? rfSetYTO(yto) : loSetYTO(yto));
        if (ytoInputs.lowGHz === "" && !lowChanged)
          dispatch(setYTOLowInput(yto.lowGHz));
        if (ytoInputs.highGHz === "" && !highChanged)
          dispatch(setYTOHighInput(yto.highGHz));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, ytoInputs.highGHz, ytoInputs.lowGHz, prefix, props.isRfSource, setYTOLowInput, setYTOHighInput, lowChanged, highChanged]);

  const onChangeLimit = (e) => {
    if (e.target.name === "setLow") {
      setLowChanged(true);
      dispatch(setYTOLowInput(e.target.value));
    } else if (e.target.name === "setHigh") {
      setHighChanged(true);
      dispatch(setYTOHighInput(e.target.value));
    }
  }

  // Load only on first render
  useEffect(() => {
    fetch();
  }, [fetch]);
  
  // SET button handler
  const setLimitsHandler = useCallback(() => {
    const params = {
      lowGHz:  Number(ytoInputs.lowGHz),
      highGHz: Number(ytoInputs.highGHz)
    }
    if (isNaN(params.lowGHz) || params.lowGHz === 0 || isNaN(params.highGHz) || params.highGHz === 0) {
      return;
    }
    axios.put(prefix + '/yto/limits', params)
      .then(res => {
        setLowChanged(false);
        setHighChanged(false);
        console.log(res.data);
        fetch();
      })
      .catch(error => {
        console.log(error);
      })
  }, [fetch, prefix, ytoInputs.lowGHz, ytoInputs.highGHz]);

  // Other components can cause this one to send the YTO limits to the server
  useEffect(() => {
    if (ytoInputs.sendNow) {
      dispatch(props.isRfSource ? rfSetYTOSendNow(false) : loSetYTOSendNow(false)); 
      setLimitsHandler();
    }
  }, [dispatch, ytoInputs.sendNow, props.isRfSource, setLimitsHandler])

  // -1 and +1 buttons handler
  const tweakYTO = (amount) => {
    const params = {
      courseTune: ytoState.courseTune + amount
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
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{ytoState.lowGHz}</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setLow"
          size="small"
          margin="none"          
          onChange={e => onChangeLimit(e)}
          value = {ytoInputs.lowGHz}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={1}/>
      <Grid item xs={3}>
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
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{ytoState.highGHz}</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setHigh"
          size="small"
          margin="none"          
          onChange={e => onChangeLimit(e)}
          value = {ytoInputs.highGHz}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={4}/>
     

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">courseTune:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{ytoState.courseTune}</Typography></Grid>
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
      <Grid item xs={8}><Typography fontWeight="bold" paddingTop="2px">{ytoState.ytoFreqGHz.toFixed(3)} GHz</Typography></Grid>
    </Grid>
  );
};
