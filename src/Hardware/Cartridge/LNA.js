// React and Redux
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput';
import EnableButton from '../../Shared/EnableButton';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setLNA, setLNAEnable } from './CartridgeSlice'

export default function LNA(props) {
  // Periodic refresh timer
  const timer = useRef(null);

  // Redux store interfaces
  const thisLNA = useSelector((state) => state.Cartridge.LNA)[props.pol][props.lna - 1];
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get("/cca/lna", {params: {pol: props.pol, lna: props.lna}})
      .then(res => {
        dispatch(setLNA({pol: props.pol, lna: props.lna, data:res.data}));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, props.pol, props.lna]);

  // Periodic refresh timer
  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    } else {
      // first render load
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

  // ENABLE button handler
  const onClickEnable = (e) => {
    const enable = e.currentTarget.value !== 'true';
    console.log('setEnableHandler ' + enable);
    dispatch(setLNAEnable({pol: props.pol, lna: props.lna, data: enable}))
    axios.put("/cca/lna/enable", {pol: props.pol, lna: props.lna, enable: enable})
      .then(res => {
        const result = res.data;
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      })
  }
  
  // SET button helper
  const setValueHandler = (what) => {
    let params = {
      pol: props.pol,
      lna: props.lna
    }
    params[what] =  document.getElementsByName("set" + what)[0].value
    if (params[what]) {
      axios.put("/cca/lna", params)
        .then(res => {
          const result = res.data;
          console.log(result);
        })
        .catch(error => {
          console.log(error);
        })
      }
  }

  // SET button handler
  const setAllHandler = () => {
    setValueHandler('VD1');
    setValueHandler('VD2');
    setValueHandler('VD3');
    setValueHandler('ID1');
    setValueHandler('ID2');
    setValueHandler('ID3');
  }
  
  return (
    <Grid container className="component-data">
      <Grid item xs={12} className="component-header">LNA {props.lna}</Grid>

      <Grid item xs={12}>
        <EnableButton
          enableColor="green"
          disableColor="red"
          enable={thisLNA.enable}
          onClick={(e) => onClickEnable(e)}/>
      </Grid>
      
      <Grid item xs={3} className="component-title">VD1 [V]:</Grid>
      <Grid item xs={2}>{thisLNA.VD1}</Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setVD1"
          size="small"
          margin="none"
          className="component-input"
        />
      </Grid>
      <Grid item xs={0.5}/>
      <Grid item xs={3.5}>
        <Button 
          className="custom-btn"
          variant="contained"
          size="small"
          onClick={(e) => setAllHandler()}
        >
          SET
        </Button>
      </Grid>
      
      <Grid item xs={3} className="component-title">VD2 [V]:</Grid>
      <Grid item xs={2}>{thisLNA.VD2}</Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setVD2"
          size="small"
          margin="none"
          className="component-input"
        />
      </Grid>
      <Grid item xs={4}/>

      <Grid item xs={3} className="component-title">VD3 [V]:</Grid>
      <Grid item xs={2}>{thisLNA.VD3}</Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setVD3"
          size="small"
          margin="none"
          className="component-input"
        />
      </Grid>
      <Grid item xs={4}/>

      <Grid item xs={3} className="component-title">ID1 [mA]:</Grid>
      <Grid item xs={2}>{thisLNA.ID1}</Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setID1"
          size="small"
          margin="none"
          className="component-input"
        />
      </Grid>
      <Grid item xs={4}/>
      
      <Grid item xs={3} className="component-title">ID2 [mA]:</Grid>
      <Grid item xs={2}>{thisLNA.ID2}</Grid>
      <Grid item xs={3}><OutlinedInput
          name="setID2"
          size="small"
          margin="none"
          className="component-input"
        />
      </Grid>
      <Grid item xs={4}/>
      
      <Grid item xs={3} className="component-title">ID3 [mA]:</Grid>
      <Grid item xs={2}>{thisLNA.ID3}</Grid>
      <Grid item xs={3}><OutlinedInput
          name="setID3"
          size="small"
          margin="none"
          className="component-input"
        />
      </Grid>
      <Grid item xs={4}/>

      <Grid item xs={3} className="component-title">VG1 [V]:</Grid>
      <Grid item xs={9}>{thisLNA.VG1}</Grid>

      <Grid item xs={3} className="component-title">VG2 [V]:</Grid>
      <Grid item xs={9}>{thisLNA.VG2}</Grid>

      <Grid item xs={3} className="component-title">VG3 [V]:</Grid>
      <Grid item xs={9}>{thisLNA.VG3}</Grid>
    </Grid>
  );
}
