// React and Redux
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setSIS } from './CartridgeSlice'

export default function SIS(props) {
  // Periodic refresh timer
  const timer = useRef(null);
  
  // Redux store interfaces
  const thisSIS = useSelector((state) => state.Cartridge.SIS)[props.pol][props.sis - 1];
  const dispatch = useDispatch();
  
  // Load data from REST API
  const fetch = useCallback(() => {
    let params = {
      pol: props.pol,
      sis: props.sis,
      averaging: props.averaging ? props.averaging : 1
    }
    axios.get("/cca/sis", { params: params })
      .then(res => {
        dispatch(setSIS({pol: props.pol, sis:props.sis, data:res.data}));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, props.pol, props.sis, props.averaging]);

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

  // SET VJ button handler
  const setVjHandler = () => {
    const params = {
      pol: props.pol,
      sis: props.sis,
      Vj: document.getElementsByName("setVj")[0].value
    }
    axios.put("/cca/sis", params)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  // SET IMAG button handler
  const setImagHandler = () => {
    const params = {
      pol: props.pol,
      sis: props.sis,
      Imag: document.getElementsByName("setImag")[0].value
    }
    axios.put("/cca/sis", params)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <Grid container className="component-data">
      <Grid item xs={12}className="component-header">SIS {props.sis}</Grid>

      <Grid item xs={3} className="component-title">Vj [mV]:</Grid>
      <Grid item xs={2}>{thisSIS.Vj.toFixed(3)}</Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setVj"
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
          onClick={(e) => setVjHandler()}
        >
          SET
        </Button>
      </Grid>

      <Grid item xs={3} className="component-title">Ij [mA]:</Grid>
      <Grid item xs={9}>{thisSIS.Ij.toFixed(3)}</Grid>

      <Grid item xs={12} className="component-header">Magnet {props.sis}</Grid>

      <Grid item xs={3} className="component-title">Imag [mA]:</Grid>
      <Grid item xs={2}>{thisSIS.Imag.toFixed(2)}</Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setImag"
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
          onClick={(e) => setImagHandler()}
        >
          SET
        </Button> 
      </Grid>
      
      <Grid item xs={3} className="component-title">Vmag [mV]:</Grid>
      <Grid item xs={9}>{thisSIS.Vmag.toFixed(2)}</Grid>
    </Grid>
  );
}
