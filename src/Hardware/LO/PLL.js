// React and Redux
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput';
import EnableButton from '../../Shared/EnableButton';
import LockButton from './LockButton';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { loSetPLL, loSetPLLConfig } from './LOSlice'
import { rfSetPLL, rfSetPLLConfig } from './RFSlice'

export default function PLL(props) {
  // State for user input prior to clicking one of the LOCK button
  const [inputLOFreq, setInputLOFreq] = useState("");
  
  // State for appearance of the LOCK button
  const [isLocked, setIsLocked] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [lockFailed, setLockFailed] = useState(false);

  // Periodic refresh timer
  const timer = useRef(null);

  // Timer for updating the LOCK button after success or failure
  const lockTimer = useRef(null);

  // Redux store interfaces
  const pll = useSelector((state) => props.isRfSource ? state.RF.PLL : state.LO.PLL);
  const pllConfig = useSelector((state) => props.isRfSource ? state.RF.PLLConfig : state.LO.PLLConfig);
  const dispatch = useDispatch();

  // URL prefix
  const prefix = props.isRfSource ? '/rfsource' : '/lo'

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get(prefix + '/pll')
      .then(res => {
        dispatch(props.isRfSource ? rfSetPLL(res.data) : loSetPLL(res.data));
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

  // LOCK button handler
  const lockHandler = () => {
    // Ignore if already locking
    if (isLocking)
      return;
    
    // Update button state
    setIsLocked(false);
    setIsLocking(true);
    setLockFailed(false);

    const freqLOGHz = Number(inputLOFreq);
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
        lockTimer.current = setInterval(handleLockTimer, 1500);
      })
      .catch(error => {
        console.log(error);
      })
  }

  // Finalize LOCK button appearance
  const handleLockTimer = () => {
    clearInterval(lockTimer.current);
    lockTimer.current = null;
    setLockFailed(false);
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

  const unlockDetect = !pll.isLocked || pll.unlockDetected;
  return (
    <Grid container spacing={0} className="component-data">
      <Grid item xs={12} className="component-header">PLL</Grid>        

      <Grid item xs={3}>
        <Chip 
          label={isLocked ? "LOCKED" : "UNLOCK"}
          color={isLocked ? "success" : "error"}
          size="small"
        />
      </Grid>
      <Grid item xs={5} className="input-grid">
        <OutlinedInput
          name="loFreq"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '60%'}}
          onChange={e => setInputLOFreq(e.target.value)}
          value = {inputLOFreq}
        />
        &nbsp;GHz
      </Grid>
      <Grid item xs={3}>
        <LockButton
          isLocked={isLocked}
          isLocking={isLocking}
          lockFailed={lockFailed}
          className="custom-lock-btn"
          onClick={lockHandler}
        />
      </Grid>
      <Grid item xs={1}/>

      <Grid item xs={3} className="component-title">Unlock seen:</Grid>
      <Grid item xs={5}>
        <Chip 
          label={unlockDetect ? "UNLOCK" : "OK"}
          color={unlockDetect ? "error" : "success"}
          size="small"
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          className="custom-lock-btn"
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
      <Grid item xs={1}/>

      <Grid item xs={3} className="component-title">Correction:</Grid>
      <Grid item xs={5}>{pll.corrV}&nbsp;V</Grid>
      <Grid item xs={3}>
        <Button
          className="custom-lock-btn"
          variant="contained"
          size="small"
          style={{
            minWidth: '100%',
            maxWidth: '100%' 
          }}
          onClick={e => pllAdjustHandler()}
        >
          ADJUST
        </Button>
      </Grid>
      <Grid item xs={1}/>

      <Grid item xs={3} className="component-title">Ref Tot Pwr:</Grid>
      <Grid item xs={3}>{pll.refTP}&nbsp;V</Grid>
      <Grid item xs={2} className="component-title">PLL:</Grid>
      <Grid item xs={3}>
        <EnableButton
          className="custom-lock-btn" 
          id="nullPLL"
          size="small"
          enableColor="red"
          enableText="NULL"
          disableText="NORMAL"
          width="100%"
          enable={pll.nullPLL}
          onClick={e => setNullHandler(!pll.nullPLL)}/>
      </Grid>
      <Grid item xs={1}/>

      <Grid item xs={3} className="component-title">IF Tot Pwr:</Grid>
      <Grid item xs={9}>{pll.IFTP}&nbsp;V</Grid>

      <Grid item xs={3} className="component-title">Temperature:</Grid>
      <Grid item xs={9}>{pll.temperature}&nbsp;C</Grid>

      <Grid item xs={3} className="component-title">Loop BW:</Grid>
      <Grid item xs={2}>
        <EnableButton
          className='custom-btn'
          id="loopBW"
          size="sm"
          type="checkbox"
          enableText="7.5"
          disableText="15"
          width="100%"
          enable={pllConfig.loopBW}
          onClick={e => setLoopBWHandler(1 - pllConfig.loopBW)}/>
      </Grid>
      <Grid item xs={7}>
        &nbsp;MHz / V
      </Grid>

      <Grid item xs={3} className="component-title">Lock SB:</Grid>
      <Grid item xs={2}>
        <EnableButton
          className='custom-btn'
          style={{width: "65px"}}
          id="lockSB"
          size="sm"
          type="checkbox"
          enableText="BELOW"
          disableText="ABOVE"
          width="100%"
          enable={pllConfig.lockSB}
          onClick={e => setLockSBHandler(1 - pllConfig.lockSB)}/>
      </Grid>
      <Grid item xs={7}>
        &nbsp;Reference
      </Grid>
    </Grid>
  );
};
