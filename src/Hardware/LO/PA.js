// React and Redux
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { loSetPA } from './LOSlice'
import { rfSetPA } from './RFSlice'

export default function PA(props) {
  // State for user input prior to clicking one of the SET buttons
  const [inputVDp0, setInputVDp0] = useState("");
  const [inputVDp1, setInputVDp1] = useState("");
  const [inputVGp0, setInputVGp0] = useState("");
  const [inputVGp1, setInputVGp1] = useState("");
  
  // Periodic refresh timer
  const timer = useRef(null);

  // Redux store interfaces
  const pa = useSelector((state) => props.isRfSource ? state.RF.PA : state.LO.PA);
  const dispatch = useDispatch();

  // URL prefix
  const prefix = props.isRfSource ? '/rfsource' : '/lo'

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get(prefix + '/pa')
      .then(res => {
        dispatch(props.isRfSource ? rfSetPA(res.data) : loSetPA(res.data));
        if (inputVGp0 === "")
          setInputVGp0(res.data.VGp0);
        if (inputVGp1 === "")
          setInputVGp1(res.data.VGp1);
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, inputVGp0, inputVGp1, prefix, props.isRfSource]);

  // Periodic refresh timer
  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    } else {
      fetch();
    }
    timer.current = setInterval(() => { 
      fetch();
    }, props.interval ?? 5000);
    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [props.interval, fetch]);

  // SET buttons handler
  const setPAHandler = (pol) => {
    const params = {
      pol: pol,
      VDControl: Number((pol === 0) ? inputVDp0 : inputVDp1),
      VG: Number((pol === 0) ? inputVGp0 : inputVGp1)
    }
    axios.put(prefix + '/pa/bias', params)
      .then(res => {
        const result = res.data;
        console.log(result);
        fetch();
      })
      .catch(error => {
        console.log(error);
      })
  }
  return (
    <Grid container spacing = {0.4} className="component-data">
      <Grid item xs={12} className="component-header">Power Amp</Grid>        

      <Grid container spacing = {0.4} className="component-title">
        <Grid item xs={3}></Grid>
        <Grid item xs={3}>VD</Grid>
        <Grid item xs={3}>VG</Grid>
        <Grid item xs={3}>ID [mA]</Grid>
      </Grid>

      <Grid item xs={3} className="component-title">Pol0:</Grid>
      <Grid item xs={3}>{pa.VDp0}</Grid>
      <Grid item xs={3}>{pa.VGp0}</Grid>
      <Grid item xs={3}>{pa.IDp0}</Grid>

      <Grid item xs={3} className="component-title">Pol1:</Grid>
      <Grid item xs={3}>{pa.VDp1}</Grid>
      <Grid item xs={3}>{pa.VGp1}</Grid>
      <Grid item xs={3}>{pa.IDp1}</Grid>
    
      <Grid item xs={3} className="component-title">Pol0:</Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="set_VDp0"
          size="small"
          margin="none"
          className="component-input"
          onChange={(e) => setInputVDp0(e.target.value)}
          value = {inputVDp0}
        />
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="set_VGp0"
          size="small"
          margin="none"
          className="component-input"
          onChange={(e) => setInputVGp0(e.target.value)}
          value = {inputVGp0}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          className="custom-btn"
          variant="contained"
          size="small"
          onClick={(e) => setPAHandler(0)}
        >
          SET
        </Button>
      </Grid>          

      <Grid item xs={3} className="component-title">Pol1:</Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="set_VDp1"
          size="small"
          margin="none"
          className="component-input"
          onChange={(e) => setInputVDp1(e.target.value)}
          value = {inputVDp1}
        />
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="set_VGp1"
          size="small"
          margin="none"
          className="component-input"
          onChange={(e) => setInputVGp1(e.target.value)}
          value = {inputVGp1}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          className="custom-btn"
          variant="contained"
          size="small"
          onClick={(e) => setPAHandler(1)}
        >
          SET
        </Button>
      </Grid>

      <Grid item xs={3} className="component-title">3V&nbsp;supply:</Grid>
      <Grid item xs={9}>{pa.supply3V}</Grid>
      
      <Grid item xs={3} className="component-title">5V&nbsp;supply:</Grid>
      <Grid item xs={9}>{pa.supply5V}</Grid>

    </Grid>
  );
}
