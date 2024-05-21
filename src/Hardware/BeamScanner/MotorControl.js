// React and Redux
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'
import useWebSocket, { ReadyState } from 'react-use-websocket';

// UI components and style
import {
  Accordion, AccordionSummary, AccordionDetails,
  Button, Chip, Fade, Grid, IconButton, OutlinedInput,
  Snackbar, Tooltip, Typography
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DangerousIcon from '@mui/icons-material/Dangerous';
import ErrorIcon from '@mui/icons-material/Error';
import ForwardIcon from '@mui/icons-material/Forward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DebouncedPositiveInput from "../../Shared/DebouncedPositiveInput";
import AlertDialog from "../../Shared/AlertDialog";
import '../../components.css'

// HTTP and store
import axios from "axios";
import { 
  setXYSpeed,
  setPolSpeed,
  setIsConnected,
  setMotorStatus,
  setGotoPosition,
  setNamedParam
} from './MotorControlSlice'
import { setMeasureActive, setMeasureDescription } from '../../Measure/Shared/MeasureSlice';

export default function MotorController(props) {
  // Local state validates the GOTO position:
  const [goto, setGoto] = useState({x: 0, y:0, pol:0});
  const [gotoChanged, setGotoChanged] = useState(false);
  const [accExpanded, setAccExpanded] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState("")

  // Redux store interfaces
  const thisMC = useSelector((state) => state.MotorControl);
  const measActive = useSelector((state) => state.Measure.active);
  const dispatch = useDispatch();

  const options = {retryOnError: true, shouldReconnect: (closeEvent) => true};
  const baseURL = axios.defaults.baseURL.replace('http', 'ws');
  const { 
    readyState: statusReady,
    lastMessage: statusMessage 
  } = useWebSocket(baseURL + "/beamscan/motorstatus_ws", options);

  useEffect(() => {
    if (statusReady === ReadyState.OPEN) {
      if (statusMessage !== null) {
        try {
          const status = JSON.parse(statusMessage.data);
          dispatch(setMotorStatus(status));
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [statusReady, statusMessage, dispatch]);


  // Close the controls accordion if a measurement has started:
  if (measActive && accExpanded)
    setAccExpanded(false);

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get('/beamscan/mc/device_info')
      .then(res => {
        dispatch(setIsConnected(res.data.is_connected))
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch]);

  // Load these on first render only
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
    // use spread operators here because we want a copy, not a ref:
    let newGoto = gotoChanged ? {...goto} : {...thisMC.position};
    newGoto[e.target.name] = e.target.value;
    setGoto(newGoto);
    setGotoChanged(true);
  }

  // GOTO button handler
  const handleGoto = () => {
    if (gotoChanged) {
      dispatch(setGotoPosition(goto));
    }
  }

  // STOP button handler
  const handleStop = () => {
    // stop any beam scan in progress:
    axios.put("/measure/stop")
      .then(res => {
        console.log(res.data);
        dispatch(setMeasureActive(false));
        dispatch(setMeasureDescription(null));
      })
      .catch(error => {
        console.log(error);
      })
    // and stop the motor controller:
    axios.put("/beamscan/mc/stop_move")
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleServoHere = () => {
    axios.put("/beamscan/mc/servo_here")
      .then(res => {
        console.log(res.data);
        if (!res.data.success) {
          setToastText(res.data.message);
          setToastOpen(true);
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleSetup = () => {
    axios.put("/beamscan/mc/setup")
      .then(res => {
        console.log(res.data);
        if (!res.data.success) {
          setToastText(res.data.message);
          setToastOpen(true);
        }
      })
      .catch(error => {
        console.log(error);
      })
  }  

  const handleGetErrorCode = () => {
    axios.get("/beamscan/mc/get_errorcode")
      .then(res => {
        console.log(res.data);
        setToastText(res.data.message);
        setToastOpen(true);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleCloseToast = () => {
    setToastOpen(false);
  }

  let gotoValid = {x:true, y:true, pol:true};
  if (gotoChanged) {
    if (goto.x < 0 || isNaN(goto.x))
      gotoValid.x = false;
    if (goto.y < 0 || isNaN(goto.y))
      gotoValid.y = false;
    if (isNaN(goto.pol))
      gotoValid.pol = false;
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={toastOpen}
        autoHideDuration={3000}
        message={toastText}
        onClose={handleCloseToast}
        TransitionComponent={Fade}
      />
      <Grid container>
        <Grid item xs={4.5} display="flex" alignItems="center">
          <Typography variant="h6">Motor Controller</Typography>
        </Grid>
        <Grid item xs={7.5}>
          <IconButton
            aria-label="STOP motor controller"
            size="large"
            color="error"
            onClick={e => handleStop()}
          >
            <Typography variant="h5"><b>STOP</b></Typography>
            <DangerousIcon fontSize="inherit" />
          </IconButton>
        </Grid>
        <Grid item xs={3}>
          <Chip          
            label={(thisMC.isConnected) ? "CONNECTED" : "ERROR"}
            color={thisMC.isConnected ? "success" : "error"}
            size="small"
          />
        </Grid>
        <Grid item xs={2}><Typography variant="body2">X [mm]</Typography></Grid>
        <Grid item xs={2}><Typography variant="body2">Y [mm]</Typography></Grid>
        <Grid item xs={2}><Typography variant="body2">Pol [deg]</Typography></Grid>
        <Grid item xs={3}><Typography variant="body2">Pol torque [%]</Typography></Grid>
      </Grid>
      <Grid container spacing={0} paddingLeft="10px">
        <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Position:</Typography></Grid>        
        <Grid item xs={2}><Typography fontWeight="bold">{thisMC.position.x}</Typography></Grid>
        <Grid item xs={2}><Typography fontWeight="bold">{thisMC.position.y}</Typography></Grid>
        <Grid item xs={2}><Typography fontWeight="bold">{thisMC.position.pol}</Typography></Grid>
        <Grid item xs={2}><Typography fontWeight="bold">{thisMC.motor_status.polTorque ?? 0}</Typography></Grid>
        
        <Grid item xs={3}><Typography variant="body2" paddingTop="6px">In motion:</Typography></Grid>
        <Grid item xs={2}>
          {thisMC.motor_status.xMotion 
          ? <ForwardIcon color="success" fontSize="medium" /> 
          : <ForwardIcon opacity={0.1} fontSize="medium"/>}
        </Grid>
        <Grid item xs={2}>
          {thisMC.motor_status.yMotion
          ? <ForwardIcon color="success" fontSize="medium" /> 
          : <ForwardIcon opacity={0.1} fontSize="medium"/>}
        </Grid>
        <Grid item xs={5}>
          {thisMC.motor_status.polMotion
          ? <ForwardIcon color="success" fontSize="medium" /> 
          : <ForwardIcon opacity={0.1} fontSize="medium"/>}
        </Grid>

        <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Power:</Typography></Grid>
        <Grid item xs={2}>
          {thisMC.motor_status.xPower 
          ? <CheckCircleIcon color="success" fontSize="medium"/> 
          : <ErrorIcon color="error" fontSize="medium"/>}
        </Grid>
        <Grid item xs={2}>
          {thisMC.motor_status.yPower
          ? <CheckCircleIcon color="success" fontSize="medium"/> 
          : <ErrorIcon color="error" fontSize="medium"/>}
        </Grid>
        <Grid item xs={5}>{thisMC.motor_status.polPower
          ? <CheckCircleIcon color="success" fontSize="medium"/> 
          : <ErrorIcon color="error" fontSize="medium"/>}
        </Grid>
      </Grid>
      <Accordion 
        elevation={2} 
        disabled={measActive}
        expanded={accExpanded}
        onChange={(e,expanded) => {setAccExpanded(expanded)}}
        style={{"width": "95%"}}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="all-controls-content"
          id="all-controls-header"
          sx={{
            marginTop: "10px",
            marginBottom: "10px",
            minHeight: "24px",
            height: "24px",
            padding: "0px"
          }}
        >
          <Typography variant="body2" fontWeight="bold" paddingLeft="5px">Controls</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={0} paddingLeft="10px" paddingBottom="7px">
            <Grid item xs={3} />
            <Grid item xs={2}><Typography variant="body2">X [mm]</Typography></Grid>
            <Grid item xs={2}><Typography variant="body2">Y [mm]</Typography></Grid>
            <Grid item xs={5}><Typography variant="body2">Pol [deg]</Typography></Grid>

            <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Go To:</Typography></Grid>
            <Grid item xs={2}>
              <OutlinedInput
                required={true}
                error={!gotoValid.x}
                name="x"
                size="small"
                margin="none"
                onChange={e => handleGotoChange(e)}
                value={gotoChanged ? goto.x : thisMC.position.x}
                style={{ 
                  width: '80%'
                }}
                className="smallinput"
              />
            </Grid>
            <Grid item xs={2}>
              <OutlinedInput
                required={true}
                error={!gotoValid.y}
                name="y"
                size="small"
                margin="none"
                onChange={e => handleGotoChange(e)}
                value={gotoChanged ? goto.y : thisMC.position.y}
                style={{ 
                  width: '80%'
                }}
                className="smallinput"
              />
            </Grid>
            <Grid item xs={2}>
              <OutlinedInput
                required={true}
                error={!gotoValid.pol}
                name="pol"
                size="small"
                margin="none"
                onChange={e => handleGotoChange(e)}
                value={gotoChanged ? goto.pol : thisMC.position.pol}
                style={{ 
                  width: '80%'
                }}
                className="smallinput"
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled = {!(gotoValid.x && gotoValid.y && gotoValid.pol)}
                variant="contained"
                size="small"
                onClick={e => handleGoto()}
                style={{
                  paddingTop: "0%", 
                  paddingBottom: "0%",
                  minWidth: '55%',
                  maxWidth: '55%'
                }}
              >
                GO
              </Button>
            </Grid>

            <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Speed:</Typography></Grid>
            <Grid item xs={4}>
              <DebouncedPositiveInput
                name="xy_speed"
                style={{ width: '40%' }}
                onSave={e => { handleParamChange(e) }}
                value={thisMC.xy_speed}
              /><Typography variant="body2" paddingTop="4px" display="inline">&nbsp;mm/sec</Typography>
            </Grid>
            <Grid item xs={4}>
              <DebouncedPositiveInput
                name="pol_speed"
                style={{ width: '40%' }}
                onSave={e => { handleParamChange(e) }}
                value={thisMC.pol_speed}
              /><Typography variant="body2" paddingTop="4px" display="inline">&nbsp;deg/sec</Typography>
            </Grid>

            <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Acceleration:</Typography></Grid>
            <Grid item xs={4}>
              <DebouncedPositiveInput
                name="xy_accel"
                style={{ width: '40%' }}
                onSave={e => { handleParamChange(e) }}
                value={thisMC.xy_accel}
              /><Typography variant="body2" paddingTop="4px" display="inline">&nbsp;mm/sec^2</Typography>
            </Grid>
            <Grid item xs={4}>
              <DebouncedPositiveInput
                name="pol_accel"
                style={{ width: '40%' }}
                onSave={e => { handleParamChange(e) }}
                value={thisMC.pol_accel}
              /><Typography variant="body2" paddingTop="4px" display="inline">&nbsp;deg/sec^2</Typography>
            </Grid>

            <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Deceleration:</Typography></Grid>
            <Grid item xs={4}>
              <DebouncedPositiveInput
                name="xy_decel"
                style={{ width: '40%' }}
                onSave={e => { handleParamChange(e) }}
                value={thisMC.xy_decel}
              /><Typography variant="body2" paddingTop="4px" display="inline">&nbsp;mm/sec^2</Typography>
            </Grid>
            <Grid item xs={4}>
              <DebouncedPositiveInput
                name="pol_decel"
                style={{ width: '40%' }}
                onSave={e => { handleParamChange(e) }}
                value={thisMC.pol_decel}
              /><Typography variant="body2" paddingTop="4px" display="inline">&nbsp;deg/sec^2</Typography>
            </Grid>
            
            <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Home:</Typography></Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                size="small"
                onClick={e => handleHome('x')}
                style={{
                  paddingTop: "0%", 
                  paddingBottom: "0%",
                  minWidth: '55%',
                  maxWidth: '55%'
                }}
              >
                X
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                size="small"
                onClick={e => handleHome('y')}
                style={{
                  paddingTop: "0%", 
                  paddingBottom: "0%",
                  minWidth: '55%',
                  maxWidth: '55%'
                }}
              >
                Y
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                size="small"
                onClick={e => handleHome('pol')}
                style={{
                  paddingTop: "0%", 
                  paddingBottom: "0%",
                  minWidth: '55%',
                  maxWidth: '55%'
                }}
              >
                Pol
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                size="small"
                onClick={e => handleHome('xy')}
                style={{
                  paddingTop: "0%", 
                  paddingBottom: "0%",
                  minWidth: '55%',
                  maxWidth: '55%'
                }}
              >
                XY
              </Button>
            </Grid>

            <Grid item xs={3}><Typography variant="body2" paddingTop="4px">Set Zero:</Typography></Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                size="small"
                onClick={e => handleSetZero('x')}
                style={{
                  paddingTop: "0%", 
                  paddingBottom: "0%",
                  minWidth: '55%',
                  maxWidth: '55%'
                }}
              >
                X
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                size="small"
                onClick={e => handleSetZero('y')}
                style={{
                  paddingTop: "0%", 
                  paddingBottom: "0%",
                  minWidth: '55%',
                  maxWidth: '55%'
                }}
              >
                Y
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                size="small"
                onClick={e => handleSetZero('pol')}
                style={{
                  paddingTop: "0%", 
                  paddingBottom: "0%",
                  minWidth: '55%',
                  maxWidth: '55%'
                }}
              >
                Pol
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                size="small"
                onClick={e => handleSetZero('xy')}
                style={{
                  paddingTop: "0%", 
                  paddingBottom: "0%",
                  minWidth: '55%',
                  maxWidth: '55%'
                }}
              >
                XY
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="body2" paddingTop="4px">Troubleshooting:</Typography>
            </Grid>
            <Grid item xs={2}>
              <Tooltip title={<Typography fontSize={13}>Servo Here: For use after motor power loss.<br/>Follow by homing the affected motor.</Typography>}>
                <Button
                  variant="contained"
                  size="small"                
                  onClick={() => setAlertOpen(true)}
                  style={{
                    paddingTop: "0%", 
                    paddingBottom: "0%",
                    minWidth: '55%',
                    maxWidth: '55%'
                  }}
                  >
                  SH
                </Button>
              </Tooltip>
              <AlertDialog
                open={alertOpen}
                title="Confirm SERVO HERE?"
                onClose={(confirm) => {setAlertOpen(false); if (confirm) handleServoHere()}}
              >
                For use after any motor power failure.<br/>You must next <b>Home</b> all affected axes.
              </AlertDialog>
            </Grid>
            <Grid item xs={2}>
              <Tooltip title={<Typography fontSize={13}>Setup: Reinitialize the motor controller<br/>Follow by homing all axes.</Typography>}>
                <Button
                  variant="contained"
                  size="small"                
                  onClick={() => setAlertOpen(true)}
                  style={{
                    paddingTop: "0%", 
                    paddingBottom: "0%",
                    minWidth: '55%',
                    maxWidth: '55%'
                  }}
                >
                SETUP
              </Button>
            </Tooltip>
              <AlertDialog
                open={alertOpen}
                title="Confirm SETUP?"
                onClose={(confirm) => {setAlertOpen(false); if (confirm) handleSetup()}}
              >
                Reinitialize the motor controller.<br/>You must next <b>Home</b> all axes.
              </AlertDialog>
            </Grid>
            <Grid item xs={2}>
              <Tooltip title={<Typography fontSize={13}>Get the latest error code from the motor controller.</Typography>}>
                <Button
                  variant="contained"
                  size="small"                
                  onClick={() => handleGetErrorCode()}
                  style={{
                    paddingTop: "0%", 
                    paddingBottom: "0%",
                    minWidth: '55%',
                    maxWidth: '55%'
                  }}
                  >
                  TC1
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
