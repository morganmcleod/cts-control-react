// React and Redux
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Button, OutlinedInput, Typography} from '@mui/material';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { 
  setSIS, 
  setInputVj, 
  setInputImag
} from './CartridgeSlice'

export default function SIS(props) {
  // Periodic refresh timer
  const timer = useRef(null);
  
  // Redux store interfaces
  const SIS = useSelector((state) => state.Cartridge.SIS[props.pol][props.sis - 1]);
  const inputs = useSelector((state) => state.Cartridge.inputs.SIS[props.pol][props.sis - 1]);
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

  // SET button handler
  const setButtonHandler = (name) => {
    switch (name) {
      case "setVj": {
        const params = {
          pol: props.pol,
          sis: props.sis,
          Vj: inputs.Vj.trim()
        }
        axios.put("/cca/sis", params)
          .then(res => {
            console.log(res.data);
          })
          .catch(error => {
            console.log(error);
          })
        }
        break;
      case "setImag": {
        const params = {
          pol: props.pol,
          sis: props.sis,
          Imag: inputs.Imag.trim()
        }
        axios.put("/cca/sis", params)
          .then(res => {
            console.log(res.data);
          })
          .catch(error => {
            console.log(error);
          })
        }
        break;
      default:
        break;
    }
  }

   // if apply is incremented, "click" the SET buttons
   const lastApply = useRef(inputs.apply);
   useEffect(() => {
    if (inputs.refresh > lastApply.current) {
      lastApply.current = inputs.refresh;
      const params = {
        pol: props.pol,
        sis: props.sis,
        Vj: inputs.Vj,
        Imag: inputs.Imag
      }
      axios.put("/cca/sis", params)
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.log(error);
        })
    }
  }, [inputs.refresh, props.pol, props.sis, inputs, dispatch]);

  const valueChangeHandler = (e) => {
    switch (e.target.name) {
      case "setVj":
        dispatch(setInputVj({pol: props.pol, sis:props.sis, data:e.target.value}));
        break;
      case "setImag":
        dispatch(setInputImag({pol: props.pol, sis:props.sis, data:e.target.value}));
        break;
      default:
        break;
    }
  }

  return (
    <Grid container name={'sis' + props.pol + props.sis} paddingLeft="5px">
      <Grid item xs={12}><Typography variant="body1" fontWeight="bold">SIS {props.sis}</Typography></Grid>

      <Grid item xs={3}><Typography variant="body2">Vj [mV]:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold">{SIS.Vj.toFixed(3)}</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setVj"
          size="small"
          margin="none"
          value={inputs.Vj}
          onChange={(e) => valueChangeHandler(e)}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={0.5}/>
      <Grid item xs={3.5}>
        <Button 
          name="setVj"
          variant="contained"
          size="small"
          onClick={(e) => setButtonHandler(e.target.name)}
          style={{paddingTop: "0%", paddingBottom: "0%"}}
          disabled={!inputs.Vj.trim() || isNaN(inputs.Vj.trim())}
        >
          SET
        </Button>
      </Grid>

      <Grid item xs={3}><Typography variant="body2">Ij [mA]:</Typography></Grid>
      <Grid item xs={9}><Typography fontWeight="bold">{SIS.Ij.toFixed(3)}</Typography></Grid>

      <Grid item xs={12}><Typography variant="body1" fontWeight="bold">Magnet {props.sis}</Typography></Grid>

      <Grid item xs={3}><Typography variant="body2">Imag [mA]:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold">{SIS.Imag.toFixed(2)}</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setImag"
          size="small"
          margin="none"
          value={inputs.Imag}
          onChange={(e) => valueChangeHandler(e)}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={0.5}/>
      <Grid item xs={3.5}>
        <Button
          name="setImag"          
          variant="contained"
          size="small"
          onClick={(e) => setButtonHandler(e.target.name)}
          style={{paddingTop: "0%", paddingBottom: "0%"}}
          disabled={!inputs.Imag.trim() || isNaN(inputs.Imag.trim())}
        >
          SET
        </Button> 
      </Grid>
      
      <Grid item xs={3}><Typography variant="body2">Vmag [mV]:</Typography></Grid>
      <Grid item xs={9}><Typography fontWeight="bold">{SIS.Vmag.toFixed(2)}</Typography></Grid>
    </Grid>
  );
}
