// React and Redux
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Button, Grid, OutlinedInput, Typography } from '@mui/material'
import EnableButton from '../../Shared/EnableButton';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setLNA, setLNAEnable, setInputVd, setInputId } from './CartridgeSlice'

export default function LNA(props) {
  // Redux store interfaces
  const LNA = useSelector((state) => state.Cartridge.LNA[props.pol][props.lna - 1]);
  const inputs = useSelector((state) => state.Cartridge.inputs.LNA[props.pol][props.lna - 1]);
  const dispatch = useDispatch();

  // Only fetch data when mounted
  const isMounted = useRef(false);

  // Load data from REST API
  const fetch = useCallback(() => {
    if (isMounted.current) {
      axios.get("/cca/lna", {params: {pol: props.pol, lna: props.lna}})
        .then(res => {
          dispatch(setLNA({pol: props.pol, lna: props.lna, data:res.data}));
          setTimeout(() => {fetch()}, props.interval ?? 5000);
        })
        .catch(error => {
          console.log(error);
        })
      }
  }, [dispatch, props.pol, props.lna, props.interval]);

  // Fetch on first render:
  useEffect(() => {
    isMounted.current = true;
    fetch();
    return () => { isMounted.current = false; };
  }, [fetch]);

  // SET button handler
  const setButtonHandler = useCallback(() => {
    let params = {
      pol: props.pol,
      lna: props.lna,
      VD1: (inputs.VD1.trim() && !isNaN(inputs.VD1.trim())) ? inputs.VD1.trim() : null,
      VD2: (inputs.VD2.trim() && !isNaN(inputs.VD2.trim())) ? inputs.VD2.trim() : null,
      VD3: (inputs.VD3.trim() && !isNaN(inputs.VD3.trim())) ? inputs.VD3.trim() : null,
      ID1: (inputs.ID1.trim() && !isNaN(inputs.ID1.trim())) ? inputs.ID1.trim() : null,
      ID2: (inputs.ID2.trim() && !isNaN(inputs.ID2.trim())) ? inputs.ID2.trim() : null,
      ID3: (inputs.ID3.trim() && !isNaN(inputs.ID3.trim())) ? inputs.ID3.trim() : null
    }
    axios.put("/cca/lna", params)
      .then(res => {
        const result = res.data;
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      })
  }, [inputs, props.pol, props.lna]);

  const enableButtonHandler = useCallback(() => {
    const enable = !LNA.enable;
    console.log('enableButtonHandler ' + enable);
    dispatch(setLNAEnable({pol: props.pol, lna: props.lna, data: enable}))
    axios.put("/cca/lna/enable", {pol: props.pol, lna: props.lna, enable: enable})
      .then(res => {
        const result = res.data;
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      })
  }, [LNA.enable, dispatch, props.pol, props.lna]);

  // if apply is incremented, "click" the SET and ENABLE buttons
  const lastApply = useRef(inputs.apply);
  useEffect(() => {
    if (inputs.apply > lastApply.current) {
      lastApply.current = inputs.apply;
      setButtonHandler();
      if (!LNA.enable) {
        enableButtonHandler();        
      }
    }
  }, [inputs.apply, LNA.enable, setButtonHandler, enableButtonHandler]);
  
  const valueChangeHandler = (e) => {
    switch(e.target.name) {
      case "setVD1":
        dispatch(setInputVd({pol: props.pol, lna: props.lna, stage:1, data:e.target.value}));
        break; 
      case "setVD2":
        dispatch(setInputVd({pol: props.pol, lna: props.lna, stage:2, data:e.target.value}));
        break;
      case "setVD3":
        dispatch(setInputVd({pol: props.pol, lna: props.lna, stage:3, data:e.target.value}));
        break;
      case "setID1":
        dispatch(setInputId({pol: props.pol, lna: props.lna, stage:1, data:e.target.value}));
        break;
      case "setID2":
        dispatch(setInputId({pol: props.pol, lna: props.lna, stage:2, data:e.target.value}));
        break;
      case "setID3":
        dispatch(setInputId({pol: props.pol, lna: props.lna, stage:3, data:e.target.value}));
        break;
      default:
        break;
    }
  }

  const disableSetButton = () => {
    // if any button is non blank and it is numeric don't disable:
    if (inputs.VD1.trim() && !isNaN(inputs.VD1.trim()))
      return false;
    if (inputs.VD2.trim() && !isNaN(inputs.VD2.trim()))
      return false;
    if (inputs.VD3.trim() && !isNaN(inputs.VD3.trim()))
      return false;
    if (inputs.ID1.trim() && !isNaN(inputs.ID1.trim()))
      return false;
    if (inputs.ID2.trim() && !isNaN(inputs.ID2.trim()))
      return false;
    if (inputs.ID3.trim() && !isNaN(inputs.ID3.trim()))
      return false;
    return true;    
  }

  return (
    <Grid container name={'lna' + props.pol + props.lna} paddingLeft="5px">
      <Grid item xs={12}><Typography variant="body1" fontWeight="bold">LNA {props.lna}</Typography></Grid>

      <Grid item xs={12}>
        <EnableButton
          name={"enableLna" + props.pol + props.lna}
          enableColor="green"
          disableColor="red"
          enable={LNA.enable}
          onClick={() => enableButtonHandler()}/>
      </Grid>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">VD1 [V]:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{LNA.VD1}</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setVD1"
          size="small"
          margin="none"          
          value={inputs.VD1}
          onChange={(e) => valueChangeHandler(e)}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={0.5}/>
      <Grid item xs={3.5}>
        <Button 
          name="setLna"
          className="custom-btn-sm"
          variant="contained"
          size="small"
          onClick={(e) => setButtonHandler()}
          disabled={disableSetButton()}
        >
          SET
        </Button>
      </Grid>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">VD2 [V]:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{LNA.VD2}</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setVD2"
          size="small"
          margin="none"          
          value={inputs.VD2}
          onChange={(e) => valueChangeHandler(e)}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={4}/>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">VD3 [V]:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{LNA.VD3}</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setVD3"
          size="small"
          margin="none"          
          value={inputs.VD3}
          onChange={(e) => valueChangeHandler(e)}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={4}/>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">ID1 [mA]:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{LNA.ID1}</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="setID1"
          size="small"
          margin="none"          
          value={inputs.ID1}
          onChange={(e) => valueChangeHandler(e)}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={4}/>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">ID2 [mA]:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{LNA.ID2}</Typography></Grid>
      <Grid item xs={3}><OutlinedInput
          name="setID2"
          size="small"
          margin="none"          
          value={inputs.ID2}
          onChange={(e) => valueChangeHandler(e)}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={4}/>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">ID3 [mA]:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{LNA.ID3}</Typography></Grid>
      <Grid item xs={3}><OutlinedInput
          name="setID3"
          size="small"
          margin="none"          
          value={inputs.ID3}
          onChange={(e) => valueChangeHandler(e)}
          className="smallinput"
        />
      </Grid>
      <Grid item xs={4}/>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">VG1 [V]:</Typography></Grid>
      <Grid item xs={9}><Typography fontWeight="bold" paddingTop="2px">{LNA.VG1}</Typography></Grid>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">VG2 [V]:</Typography></Grid>
      <Grid item xs={9}><Typography fontWeight="bold" paddingTop="2px">{LNA.VG2}</Typography></Grid>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">VG3 [V]:</Typography></Grid>
      <Grid item xs={9}><Typography fontWeight="bold" paddingTop="2px">{LNA.VG3}</Typography></Grid>
    </Grid>
  );
}
