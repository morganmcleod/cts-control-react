// React and Redux
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Chip, Button, OutlinedInput, Typography } from '@mui/material'
import EnableButton from '../../Shared/EnableButton';
import LockButton from './LockButton';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setInputLO, loSetPLL, loSetPLLConfig } from './LOSlice'
import { setInputRF, rfSetPLL, rfSetPLLConfig } from './RFSlice'

export default function PLL(props) {  
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
  const prefix = props.isRfSource ? '/rfsource' : '/lo'

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get(prefix + '/pll')
      .then(res => {
        dispatch(props.isRfSource ? rfSetPLL(res.data) : loSetPLL(res.data));
        setIsLocked(res.data.isLocked)
      })
      .catch(error => {
        console.log(error);
      })
    axios.get(prefix + '/pll/config')
      .then(res => {
        dispatch(props.isRfSource ? rfSetPLLConfig(res.data) : loSetPLLConfig(res.data));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, prefix, props.isRfSource]);

  // Periodic refresh timer
  useEffect(() => {
    let isMounted = true;
  
    // first render load
    fetch();
    
    // periodic load
    const timer = setInterval(() => { 
      if (isMounted)
        fetch();
    }, props.interval ?? 5000);
    
    // return cleanup function
    return () => {
      isMounted = false;
      clearInterval(timer);      
    };
  }, [props.interval, fetch]);

  // LOCK button handler
  const lockHandler = () => {
    // Ignore if already locking
    if (isLocking)
      return;
    
    // Update button state
    setIsLocked(false);
    setIsLocking(true);
    setLockFailed(false);

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
    dispatch(props.isRfSource ? setInputRF(value) : setInputLO(value));
  }

  const unlockDetect = pll.unlockDetected;
  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={12}><Typography variant="body1" fontWeight="bold">PLL</Typography></Grid>        

      <Grid item xs={4}>
        <Chip 
          label={isLocked ? "LOCKED" : "UNLOCK"}
          color={isLocked ? "success" : "error"}
          size="small"
        />
      </Grid>
      <Grid item xs={4}>
        <OutlinedInput
          name="loFreq"
          size="small"
          margin="none"          
          style={{width: '60%'}}
          className="smallinput"
          onChange={e => onChangeLO(e.target.value)}
          value = {inputFreq}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;GHz</Typography>
      </Grid>
      <Grid item xs={2.5}>
        <LockButton
          isLocked={isLocked}
          isLocking={isLocking}
          lockFailed={lockFailed}
          className="custom-btn-sm"
          onClick={lockHandler}
        />
      </Grid>
      
      <Grid item xs={4}><Typography variant="body2" paddingTop="6px">Unlock detect latch:</Typography></Grid>
      <Grid item xs={4}>
        <Chip 
          label={unlockDetect ? "YES" : "NO"}
          color={unlockDetect ? "error" : "success"}
          size="small"
        />
      </Grid>
      <Grid item xs={2.5}>
        <Button
          className="custom-btn-sm"
          variant="contained"
          size="small"
          style={{
            minWidth: '100%',
            maxWidth: '100%' 
          }}
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
