// React and Redux
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Chip, Button, FormGroup, FormControlLabel, Switch, OutlinedInput, Typography } from '@mui/material'
import EnableButton from '../../Shared/EnableButton';
import LockButton from './LockButton';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setInputLO, loSetPLL, loSetPLLConfig } from './LOSlice'
import { setInputRF, rfSetPLL, rfSetPLLConfig } from './RFSlice'
import { loRefSetFreqGHz } from '../ReferenceSources/LORefSlice'
import { rfRefSetFreqGHz } from '../ReferenceSources/RFRefSlice'

export default function PLL(props) {
  // State for the frequency input:
  const [freqChanged, setFreqChanged] = useState(false);
  const [controlRefSynth, setControlRefSynth] = useState(true);

  // Redux store interfaces
  const inputFreq = useSelector((state) => props.isRfSource ? state.RF.inputLOFreq : state.LO.inputLOFreq);
  const pll = useSelector((state) => props.isRfSource ? state.RF.PLL : state.LO.PLL);
  const pllConfig = useSelector((state) => props.isRfSource ? state.RF.PLLConfig : state.LO.PLLConfig);
  const dispatch = useDispatch();

  // State for appearance of the LOCK button
  const [isLocked, setIsLocked] = useState(pll.isLocked);
  const [isLocking, setIsLocking] = useState(false);
  const [lockFailed, setLockFailed] = useState(false);
  
  // URL prefix
  const prefix = props.isRfSource ? '/rfsource' : '/lo';
  const refPrefix = props.isRfSource ? '/rfref' : '/loref';
  const setPll = props.isRfSource ? rfSetPLL : loSetPLL;
  const setPllConfig = props.isRfSource ? rfSetPLLConfig : loSetPLLConfig;

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
      axios.get(prefix + '/pll')
        .then(res => {
          dispatch(setPll(res.data));
          setIsLocked(res.data.isLocked && !freqChanged);
        })
        .catch(error => {
          console.log(error);
        })
      axios.get(prefix + '/pll/config')
        .then(res => {
          dispatch(setPllConfig(res.data));    

          timer.current = setTimeout(() => {fetch()}, props.interval ?? 5000);
        })
        .catch(error => {
          console.log(error);
        })
      }
  }, [dispatch, freqChanged, prefix, setPll, setPllConfig, props.interval]);

  // Fetch on first render:
  useEffect(() => {
    isMounted.current = true;
    fetch();
    return () => { isMounted.current = false; };
  }, [fetch]);

  // LOCK button handler
  const lockHandler = () => {
    // Ignore if already locking
    if (isLocking)
      return;
    
    // Update button state
    setIsLocked(false);
    setIsLocking(true);
    setLockFailed(false);

    // Optionally set the reference synth frequency
    if (controlRefSynth) {
      // lockSB 0=lock below ref, 1=lock above ref, CTS floog is 10 MHz:
      const refFreq = ((inputFreq / pllConfig.coldMult) + ((pllConfig.lockSB === 1) ? -0.01 : 0.01)) / pllConfig.warmMult;

      dispatch(props.isRfSource ? rfRefSetFreqGHz(refFreq) : loRefSetFreqGHz(refFreq));
      axios.put(refPrefix + "/frequency", null, {params: {value: refFreq}})
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })      
    }

    const freqLOGHz = Number(inputFreq);
    axios.put(prefix + '/pll/lock', {freqLOGHz: freqLOGHz})
      .then(res => {
        const result = res.data;
        console.log(result);
        // Update button state
        if (result.success) {
          setIsLocked(true);
          setIsLocking(false);
        } else {
          setIsLocked(false);
          setIsLocking(false);
          setLockFailed(true);
        }
        setFreqChanged(false);
        // Load content now
        fetch();
        // Set a timer to finalize LOCK button appearance
        const lockTimer = setInterval(() => {
          clearInterval(lockTimer);
          setLockFailed(false);
        }, 1500);
      })
      .catch(error => {
        console.log(error);
      })
  }

  // CLEAR unlock detect handler
  const clearUnlockHandler = () => {
    axios.put(prefix + '/pll/clearunlock')
      .then(res => {
        console.log(res.data);
        fetch();
      })
      .catch(error => {
        console.log(error);
      })
  }

  // ADJUST PLL handler
  const pllAdjustHandler = () => {
    const params = {
      targetCV: 0.0
    }
    axios.put(prefix + '/pll/adjust', params)
      .then(res => {
        console.log(res.data);
        fetch();
      })
      .catch(error => {
        console.log(error);
      })
  }

  // NULL PLL handler
  const setNullHandler = (checked) => {
    const params = {
      value: checked
    }
    axios.put(prefix + '/pll/nullintegrator', params)
      .then(res => {
        console.log(res.data);
        const newPll = { ...pll, nullPLL: params.value };
        dispatch(props.isRfSource ? rfSetPLL(newPll): loSetPLL(newPll));
        fetch();
      })
      .catch(error => {
        console.log(error);
      })
  }

  // Loop BW handler
  const setLoopBWHandler = (checked) => {
    const params = {
      loopBW: checked ? 1 : 0
    }
    axios.put(prefix + '/pll/config', params)
      .then(res => {
        console.log(res.data);
        const newConfig = { ...pllConfig, loopBW: params.loopBW };
        dispatch(props.isRfSource ? rfSetPLLConfig(newConfig) : loSetPLLConfig(newConfig));
      })
      .catch(error => {
        console.log(error);
      })
  }

  // Lock SB handler
  const setLockSBHandler = (checked) => {
    const params = {
      lockSB: checked ? 1 : 0
    }
    axios.put(prefix + '/pll/config', params)
      .then(res => {
        console.log(res.data);
        const newConfig = { ...pllConfig, lockSB: params.lockSB }
        dispatch(props.isRfSource ? rfSetPLLConfig(newConfig) : loSetPLLConfig(newConfig));
      })
      .catch(error => {
        console.log(error);
      })
  }

  // Change LO handler
  const onChangeLO = (value) => {
    setIsLocked(false);
    setFreqChanged(true);
    dispatch(props.isRfSource ? setInputRF(value) : setInputLO(value));
  };

  // Set Reference synth hander
  const onChangeSetRef = (value) => {
    setControlRefSynth(value);
  };
  
  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={3}><Typography variant="body1" fontWeight="bold">PLL</Typography></Grid>
      <Grid item xs={7}>
        <FormGroup>
          <FormControlLabel 
            control={
              <Switch 
                checked={controlRefSynth}
                onChange={e => onChangeSetRef(e.target.checked)}
                size="small"                
              />
            } 
            label={
              <Typography variant="subtitle2" display="inline">
                {props.isRfSource ? "Set RF reference" : "Set LO reference"}
              </Typography>
            }
            labelPlacement="start"
            style={{marginLeft: "0px", marginRight: "0px"}}      
          />
        </FormGroup>
      </Grid>
      <Grid item xs={2}/>
      <Grid item xs={3.5}>
        <Typography variant="body2" display="inline" paddingTop="4px">Frequency:</Typography>
      </Grid>
      <Grid item xs={4}>
        <OutlinedInput
          name="loFreq"
          size="small"
          margin="none"          
          style={{width: '60%'}}
          className="smallinput"
          onChange={e => onChangeLO(e.target.value)}
          value = {freqChanged ? inputFreq : pll.loFreqGHz}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;GHz</Typography>
      </Grid>
      <Grid item xs={0.5}/>
      <Grid item xs={2.5}>
        <LockButton
          isLocked={isLocked && !freqChanged}
          isLocking={isLocking}
          lockFailed={lockFailed}
          className="custom-btn-sm"
          onClick={lockHandler}
        />
      </Grid>
      
      <Grid item xs={3.5}><Typography variant="body2" paddingTop="6px">Unlock Detect:</Typography></Grid>
      <Grid item xs={4}>
        <Chip
          label={pll.unlockDetected ? "UNLOCK" : "OK"}
          color={pll.unlockDetected ? "error" : "success"}
          size="small"
        />
      </Grid>
      <Grid item xs={0.5}/>
      <Grid item xs={2.5}>
        <Button
          id="clearUnlock"
          className="custom-btn-sm"
          variant="contained"
          size="small"
          style={{
            minWidth: '100%',
            maxWidth: '100%' 
          }}
          disabled={!pll.unlockDetected}
          onClick={e => clearUnlockHandler()}
        >
          CLEAR
        </Button>
      </Grid>      

      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">Correction:</Typography></Grid>
      <Grid item xs={4}><Typography fontWeight="bold" paddingTop="2px">{pll.corrV}&nbsp;V</Typography></Grid>
      <Grid item xs={2.5}>
        <Button
          className="custom-btn-sm"
          variant="contained"
          size="small"
          disabled={!isLocked}
          style={{
            minWidth: '100%',
            maxWidth: '100%' 
          }}
          onClick={e => pllAdjustHandler()}
        >
          ZERO CV
        </Button>
      </Grid>
      
      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">Ref Tot Pwr:</Typography></Grid>
      <Grid item xs={2.8}><Typography fontWeight="bold" paddingTop="2px">{pll.refTP}&nbsp;V</Typography></Grid>
      <Grid item xs={1.2}><Typography variant="body2" paddingTop="4px">Null:&nbsp;</Typography></Grid>
      <Grid item xs={2.5}>
        <EnableButton
          className="custom-btn-sm" 
          id="nullPLL"
          size="small"
          enableColor="red"
          enableText="NULL"
          disableText="NORMAL"
          width="100%"
          enable={pll.nullPLL}
          onClick={e => setNullHandler(!pll.nullPLL)}/>
      </Grid>
      
      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">IF Tot Pwr:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold" paddingTop="2px">{pll.IFTP}&nbsp;V</Typography></Grid>

      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">Temperature:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold" paddingTop="2px">{pll.temperature}&nbsp;C</Typography></Grid>

      <Grid item xs={4}><Typography variant="body2" paddingTop="6px">Loop BW:</Typography></Grid>
      <Grid item xs={2}>
        <EnableButton
          className="custom-btn-sm"
          id="loopBW"
          size="sm"
          type="checkbox"
          disableText="7.5"
          enableText="15"
          width="100%"
          enable={pllConfig.loopBW}
          onClick={e => setLoopBWHandler(1 - pllConfig.loopBW)}/>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body2" paddingTop="6px">&nbsp;&nbsp;MHz / V</Typography>
      </Grid>

      <Grid item xs={4}><Typography variant="body2" paddingTop="6px">Lock SB:</Typography></Grid>
      <Grid item xs={2}>
        <EnableButton
          className="custom-btn-sm"
          style={{width: "65px"}}
          id="lockSB"
          size="sm"
          type="checkbox"
          disableText="BELOW"
          enableText="ABOVE"
          width="100%"
          enable={pllConfig.lockSB}
          onClick={e => setLockSBHandler(1 - pllConfig.lockSB)}/>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body2" paddingTop="6px">&nbsp;&nbsp;Reference</Typography>
      </Grid>
    </Grid>
  );
};
