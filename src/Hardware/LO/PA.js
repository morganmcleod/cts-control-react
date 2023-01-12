// React and Redux
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material'
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
    <Grid container paddingLeft="5px">
      <Grid item xs={12}><Typography variant="body1" fontWeight="bold">Power Amp</Typography></Grid>        

      <Grid container spacing = {0.4}>
        <Grid item xs={3}></Grid>
        <Grid item xs={3}><Typography variant="body2" paddingTop="4px" paddingLeft="11px">VD</Typography></Grid>
        <Grid item xs={3}><Typography variant="body2" paddingTop="4px" paddingLeft="11px">VG</Typography></Grid>
        <Grid item xs={3}><Typography variant="body2" paddingTop="4px" paddingLeft="7px">ID [mA]</Typography></Grid>
      </Grid>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Pol0:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px" paddingLeft="11px">{pa.VDp0}</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px" paddingLeft="11px">{pa.VGp0}</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px" paddingLeft="11px">{pa.IDp0}</Typography></Grid>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Pol1:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px" paddingLeft="11px">{pa.VDp1}</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px" paddingLeft="11px">{pa.VGp1}</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px" paddingLeft="11px">{pa.IDp1}</Typography></Grid>
    
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Pol0:</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="set_VDp0"
          size="small"
          margin="none"          
          style={{ "width": "90%" }}
          className="smallinput"
          onChange={(e) => setInputVDp0(e.target.value)}
          value = {inputVDp0}
        />
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="set_VGp0"
          size="small"
          margin="none"          
          style={{ "width": "90%" }}
          className="smallinput"
          onChange={(e) => setInputVGp0(e.target.value)}
          value = {inputVGp0}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          className="custom-btn-sm"
          variant="contained"
          size="small"
          onClick={(e) => setPAHandler(0)}
        >
          SET
        </Button>
      </Grid>          

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Pol1:</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="set_VDp1"
          size="small"
          margin="none"          
          style={{ "width": "90%" }}
          className="smallinput"
          onChange={(e) => setInputVDp1(e.target.value)}
          value = {inputVDp1}
        />
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="set_VGp1"
          size="small"
          margin="none"          
          style={{ "width": "90%" }}
          className="smallinput"
          onChange={(e) => setInputVGp1(e.target.value)}
          value = {inputVGp1}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          className="custom-btn-sm"
          variant="contained"
          size="small"
          onClick={(e) => setPAHandler(1)}
        >
          SET
        </Button>
      </Grid>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">3V&nbsp;supply:</Typography></Grid>
      <Grid item xs={9}><Typography fontWeight="bold" paddingTop="2px" paddingLeft="11px">{pa.supply3V}</Typography></Grid>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">5V&nbsp;supply:</Typography></Grid>
      <Grid item xs={9}><Typography fontWeight="bold" paddingTop="2px" paddingLeft="11px">{pa.supply5V}</Typography></Grid>

    </Grid>
  );
}
