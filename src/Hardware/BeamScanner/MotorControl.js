// React and Redux
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid'
import OutlinedInput from '@mui/material/OutlinedInput';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ForwardIcon from '@mui/icons-material/Forward';
import DebouncedPositiveInput from "../../Shared/DebouncedPositiveInput";
import '../../components.css'

// HTTP and store
import axios from "axios";
import { 
  setXYSpeed,
  setPolSpeed,
  setIsConnected,
  setMotorStatus,
  setPosition,
  setNamedParam
} from './MotorControlSlice'

export default function MotorController(props) {
  // Local state validates the GOTO position:
  const [goto, setGoto] = useState({x: 0, y:0, pol:0});
  const [gotoValid, setGotoValid] = useState(false);
  
  // Periodic refresh timer
  const timer = useRef(null);

  // Redux store interfaces
  const thisMC = useSelector((state) => state.MotorControl);
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get('/beamscan/mc/isconnected')
      .then(res => {
        dispatch(setIsConnected(res.data.value))
      })
      .catch(error => {
        console.log(error);
      })
      
    axios.get('beamscan/mc/status')
      .then(res => {
        const motor_status = res.data;
        dispatch(setMotorStatus(motor_status))
        // if currently in motion, ignore GOTO inputs
        if (motor_status.xMotion || 
            motor_status.yMotion || 
            motor_status.polMotion) 
        {
          setGotoValid(false);
        }
      })
      .catch(error => {
        console.log(error);
      })

    axios.get('/beamscan/mc/position')
      .then(res => {
        dispatch(setPosition(res.data));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch]);

  // Load thes on first render only
  useEffect(() => {
    axios.get('/beamscan/mc/xy_speed')
    .then(res => {
      dispatch(setXYSpeed(res.data.value));
    })
    .catch(error => {
      console.log(error);
    })
    
    axios.get(`/beamscan/mc/pol_speed`)
    .then(res => {
      dispatch(setPolSpeed(res.data.value));
    })
    .catch(error => {
      console.log(error);
    })
  }, [dispatch]);

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
    }, props.interval ?? 1000);
    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [props.interval, fetch]);
  
  // HOME buttons handler
  const handleHome = (axis) => {
    axios.put("/beamscan/mc/home/" + axis)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  // SET ZERO buttons handler
  const handleSetZero = (axis) => {
    axios.put("/beamscan/mc/set_zero/" + axis)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  // Any named field change handler
  const handleParamChange = (e) => {
    dispatch(setNamedParam({name: e.target.name, data: e.target.value}));
    if (e.target.value > 0) {
      const params = { value: e.target.value }
      axios.put("/beamscan/mc/" + e.target.name, params)
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  // Any GOTO field changed handler
  const handleGotoChange = (e) => {
    let newGoto = gotoValid ? {...goto} : {...thisMC.position};
    newGoto[e.target.name] = e.target.value;
    setGoto(newGoto);
    setGotoValid(true);
  }

  // GOTO button handler
  const handleGoto = () => {
    if (gotoValid && goto.x >= 0 && goto.y >= 0 && goto.pol >= 0) {
      axios.put("/beamscan/mc/next_pos", goto)
      .then(res => {
        console.log(res.data);
        setGoto(thisMC.position);
        setGotoValid(false);
        if (res.data.success) {
          const params = { trigger: false };
          axios.put("/beamscan/mc/start_move", params)
            .then(res => {
              console.log(res.data);
            })
            .catch(error => {
              console.log(error);
            })
        }
      })
      .catch(error => {
        console.log(error);
      })
    }
  }
  
  return (
    <Grid container spacing={0} className="component-data">
      <Grid item xs={12} className="component-header">Motor Controller</Grid>

      <Grid item xs={3}>
        <Chip 
          label={(thisMC.isConnected) ? "CONNECTED" : "ERROR"}
          color={thisMC.isConnected ? "success" : "error"}
          size="small"
        />
      </Grid>
      <Grid item xs={2} className="component-title">X [mm]</Grid>
      <Grid item xs={2} className="component-title">Y [mm]</Grid>
      <Grid item xs={5} className="component-title">Pol [deg]</Grid>

      <Grid item xs={3} className="component-title">Position:</Grid>
      <Grid item xs={2}>{thisMC.position.x}</Grid>
      <Grid item xs={2}>{thisMC.position.y}</Grid>
      <Grid item xs={5}>{thisMC.position.pol}</Grid>
      
      <Grid item xs={3} className="component-title">Go To:</Grid>
      <Grid item xs={2} className="input-grid">
        <OutlinedInput
          name="x"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '80%'}}
          onChange={e => {handleGotoChange(e)}}
          value = {gotoValid ? goto.x : thisMC.position.x}
        />
      </Grid>
      <Grid item xs={2} className="input-grid">
        <OutlinedInput
          name="y"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '80%'}}
          onChange={e => {handleGotoChange(e)}}
          value = {gotoValid ? goto.y : thisMC.position.y}
        />
      </Grid>
      <Grid item xs={2} className="input-grid">
        <OutlinedInput
          name="pol"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '80%'}}
          onChange={e => {handleGotoChange(e)}}
          value = {gotoValid ? goto.pol : thisMC.position.pol}
        />
      </Grid>
      <Grid item xs={2}>
        <Button
          className="custom-lock-btn"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleGoto()}
        >
          GO
        </Button>
      </Grid>
      
      <Grid item xs={3} className="component-title">In Motion:</Grid>
      <Grid item xs={2}>{thisMC.motor_status.xMotion ? <ForwardIcon color="success"/> : <div/>}</Grid>
      <Grid item xs={2}>{thisMC.motor_status.yMotion ? <ForwardIcon color="success"/> : <div/>}</Grid>
      <Grid item xs={5}>{thisMC.motor_status.polMotion ? <ForwardIcon color="success"/> : <div/>}</Grid>

      <Grid item xs={3} className="component-title">Power:</Grid>
      <Grid item xs={2}>{thisMC.motor_status.xPower ? <CheckCircleIcon color="success"/> : <ErrorIcon color="error"/>}</Grid>
      <Grid item xs={2}>{thisMC.motor_status.yPower ? <CheckCircleIcon color="success"/> : <ErrorIcon color="error"/>}</Grid>
      <Grid item xs={5}>{thisMC.motor_status.polPower ? <CheckCircleIcon color="success"/> : <ErrorIcon color="error"/>}</Grid>

      <Grid item xs={3} className="component-title">Speed:</Grid>
      <Grid item xs={4} className="input-grid">
        <DebouncedPositiveInput
          name = "xy_speed"
          style = {{width: '40%'}}
          onSave = {e => {handleParamChange(e)}}
          value = {thisMC.xy_speed}
        />&nbsp;mm/sec
      </Grid>
      <Grid item xs={4} className="input-grid">
        <DebouncedPositiveInput
          name="pol_speed"
          style={{width: '40%'}}
          onSave={e => {handleParamChange(e)}}
          value = {thisMC.pol_speed}
        />&nbsp;deg/sec
      </Grid>
      <Grid item xs={1}/>
      
      <Grid item xs={3} className="component-title">Acceleration:</Grid>
      <Grid item xs={4} className="input-grid">
        <DebouncedPositiveInput
          name="xy_accel"
          style={{width: '40%'}}
          onSave={e => {handleParamChange(e)}}
          value = {thisMC.xy_accel}
        />&nbsp;mm/sec^2
      </Grid>
      <Grid item xs={4} className="input-grid">
        <DebouncedPositiveInput
          name="pol_accel"
          style={{width: '40%'}}
          onSave={e => {handleParamChange(e)}}
          value = {thisMC.pol_accel}
        />&nbsp;deg/sec^2
      </Grid>
      <Grid item xs={1}/>

      <Grid item xs={3} className="component-title">Deceleration:</Grid>
      <Grid item xs={4} className="input-grid">
        <DebouncedPositiveInput
          name="xy_decel"
          style={{width: '40%'}}
          onSave={e => {handleParamChange(e)}}
          value = {thisMC.xy_decel}
        />&nbsp;mm/sec^2
      </Grid>
      <Grid item xs={4} className="input-grid">
        <DebouncedPositiveInput
          name="pol_decel"
          style={{width: '40%'}}
          onSave={e => {handleParamChange(e)}}
          value = {thisMC.pol_decel}
        />&nbsp;deg/sec^2
      </Grid>
      <Grid item xs={1}/>

      <Grid item xs={3} className="component-title">Trigger Interval:</Grid>
      <Grid item xs={4} className="input-grid">
        <DebouncedPositiveInput
          name="trigger_interval"
          style={{width: '40%'}}
          onSave={e => {handleParamChange(e)}}
          value = {thisMC.trigger_interval}
        />&nbsp;mm
      </Grid>
      <Grid item xs={5}/>

      <Grid item xs={3} className="component-title">Home:</Grid>
      <Grid item xs={2}>
        <Button
          className="custom-lock-btn"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleHome('x')}
        >
          X
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button
          className="custom-lock-btn"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleHome('y')}
        >
          Y
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button
          className="custom-lock-btn"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleHome('pol')}
        >
          Pol
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button
          className="custom-lock-btn"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleHome('xy')}
        >
          XY
        </Button>
      </Grid>
      <Grid item xs={1}/>

      <Grid item xs={3} className="component-title">Set Zero:</Grid>
      <Grid item xs={2}>
        <Button
          className="custom-lock-btn"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleSetZero('x')}
        >
          X
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button
          className="custom-lock-btn"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleSetZero('y')}
        >
          Y
        </Button>
      </Grid>
      <Grid item xs={2}>          
        <Button
          className="custom-lock-btn"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleSetZero('pol')}
        >
          Pol
        </Button>
      </Grid>
      <Grid item xs={2}>          
        <Button
          className="custom-lock-btn"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleSetZero('xy')}
        >
          XY
        </Button>
      </Grid>
      <Grid item xs={1}/>
    </Grid>
  );
}
