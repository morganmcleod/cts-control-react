// React and Redux
import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { loSetPA, loSetPAInputs, loSetPAInputsSendNow } from './LOSlice'
import { rfSetPA, rfSetPAInputs, rfSetPAInputsSendNow } from './RFSlice'

export default function PA(props) {
  // Redux store interfaces
  const pa = useSelector((state) => props.isRfSource ? state.RF.PA : state.LO.PA);
  const paInputs = useSelector((state) => props.isRfSource ? state.RF.PAInputs : state.LO.PAInputs);
  const dispatch = useDispatch();
  
  const setPAInputs = (val) => {
    dispatch(props.isRfSource ? rfSetPAInputs(val) : loSetPAInputs(val));
  }
  const setInputVDp0 = (val) => {
    setPAInputs({...paInputs, VDp0: val});
  }
  const setInputVDp1 = (val) => {
    setPAInputs({...paInputs, VDp1: val});
  } 
  const setInputVGp0 = (val) => {
    setPAInputs({...paInputs, VGp0: val});
  }
  const setInputVGp1 = (val) => {
    setPAInputs({...paInputs, VGp1: val});
  }

  // URL prefix
  const prefix = props.isRfSource ? '/rfsource' : '/lo'
  
  // Only fetch data when mounted
  const isMounted = useRef(false);
  const timer = useRef(0);

  // Load data from REST API
  const fetch = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = 0;
    }
    if (isMounted.current) {      
      axios.get(prefix + '/pa')
        .then(res => {
          dispatch(props.isRfSource ? rfSetPA(res.data) : loSetPA(res.data));
          timer.current = setTimeout(() => {fetch()}, props.interval ?? 5000);
        })
        .catch(error => {
          console.log(error);
        })
    }
  }, [dispatch, prefix, props.isRfSource, props.interval]);
  
  // Fetch on first render:
  useEffect(() => {
    isMounted.current = true;
    fetch();
    return () => { isMounted.current = false; };
  }, [fetch]);

  // SET buttons handler
  const setPAHandler = useCallback((pol) => {
    const params = {
      pol: pol,
      VDControl: Number((pol === 0) ? paInputs.VDp0 : paInputs.VDp1),
      VG: Number((pol === 0) ? paInputs.VGp0 : paInputs.VGp1)
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
  }, [fetch, prefix, paInputs.VDp0, paInputs.VDp1, paInputs.VGp0, paInputs.VGp1]);

  // Other components can cause this one to send the YTO limits to the server
  useEffect(() => {
    if (paInputs.sendNow) {
      dispatch(props.isRfSource ? rfSetPAInputsSendNow(false) : loSetPAInputsSendNow(false)); 
      setPAHandler(0);
      setPAHandler(1);
    }
  }, [dispatch, paInputs.sendNow, props.isRfSource, setPAHandler])

  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={12}><Typography variant="body1" fontWeight="bold">PA</Typography></Grid>        

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
          value = {paInputs.VDp0}
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
          value = {paInputs.VGp0}
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
          value = {paInputs.VDp1}
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
          value = {paInputs.VGp1}
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
