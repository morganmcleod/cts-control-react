// React and Redux
import React, { useCallback, useEffect, useRef, useState, Fragment } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Button, OutlinedInput, Typography} from '@mui/material';
import AppEventDialog from '../../Shared/AppEventDialog';
import SISCurrent from "../Dialogs/SISCurrent";
import '../../components.css'

// HTTP and store
import axios from "axios";
import { 
  setSIS, 
  setInputVj, 
  setInputImag
} from './CartridgeSlice'

export default function SIS(props) {
  // Local state
  const [dialogOpen, setDialogOpen] = useState(false);

  // Redux store interfaces
  const SIS = useSelector((state) => state.Cartridge.SIS[props.pol][props.sis - 1]);
  const inputs = useSelector((state) => state.Cartridge.inputs.SIS[props.pol][props.sis - 1]);
  const cartConfig = useSelector((state) => state.CartBias.cartConfig);
  const dispatch = useDispatch();
  
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
      let params = {
        pol: props.pol,
        sis: props.sis,
        averaging: props.averaging ? props.averaging : 1
      }
      axios.get("/cca/sis", { params: params })
        .then(res => {
          dispatch(setSIS({pol: props.pol, sis:props.sis, data:res.data}));
          timer.current = setTimeout(() => {fetch()}, props.interval ?? 5000);
        })
        .catch(error => {
          console.log(error);
        })
      }
  }, [dispatch, props.pol, props.sis, props.averaging, props.interval]);

  // Fetch on first render:
  useEffect(() => {
    isMounted.current = true;
    fetch();
    return () => { isMounted.current = false; };
  }, [fetch]);

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
      case "autoIj":
        setDialogOpen(true);
        axios.put("/cartassy/auto_lo", null, {params: {pol: props.pol}})
          .then(res => {
            console.log(res.data);
          })
          .catch(error => {
            console.log(error);              
          })
        setTimeout(() => {setDialogOpen(false)}, 10000);
        break;
      default:
        break;
    }
  }

   // if apply is incremented, "click" the SET buttons
   const lastApply = useRef(inputs.apply);
   useEffect(() => {
    if (inputs.apply > lastApply.current) {
      lastApply.current = inputs.apply;
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
  }, [inputs.apply, props.pol, props.sis, inputs, dispatch]);

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

      <Grid item xs={3}><Typography variant="body2">Ij [uA]:</Typography></Grid>
      <Grid item xs={5.5}><Typography fontWeight="bold">{SIS.Ij.toFixed(2)}</Typography></Grid>
      <Grid item xs={3.5}>
        {props.sis === "1" &&
          <Fragment>
            <Button 
              name="autoIj"
              variant="contained"
              size="small"
              onClick={(e) => setButtonHandler(e.target.name)}
              style={{paddingTop: "0%", paddingBottom: "0%"}}
              disabled={!cartConfig}
            >
              AUTO
            </Button>
            <AppEventDialog
              open={dialogOpen}
              title="Setting SIS Current"
              onClose={() => {setDialogOpen(false)}}              
            >
              <SISCurrent 
                pol={props.pol} 
                onComplete={() => {setDialogOpen(false)}}
              />
            </AppEventDialog>
          </Fragment>
        }
      </Grid>

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
