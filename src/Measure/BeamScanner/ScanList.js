// React and Redux
import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import {
  Grid,
  Checkbox,
  Typography,
  FormGroup,
  FormControlLabel,
  OutlinedInput,
  Button
} from '@mui/material';

import ScanListItem from './ScanListItem';
import Disabled from '../../Shared/Disabled';
import '../../components.css';

// HTTP and store
import axios from "axios";
import { 
  setScanList,   
  setStartStopStepEnable,
  setStartStopStepIsUSB,
  setStartStopStepSubScans,
  setStartStopStep 
} from './BeamScannerSlice';

export default function ScanList(props) {
  // Redux store interfaces
  const scanList = useSelector((state) => state.BeamScanner.scanList);
  const disabled = useSelector((state) => state.BeamScanner.scanStatus.activeScan) !== null;
  const startStopStep = useSelector((state) => state.BeamScanner.startStopStep);
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback((defaults) => {
    axios.get('/beamscan/scan_list', null, {params: {defaults: defaults}})
    .then(res => {
      dispatch(setScanList(res.data.items));
    })
    .catch(error => {
      console.log(error);
    });
  }, [dispatch]);

  // Fetch first time only
  useEffect(() => {
    fetch(false);
  }, [fetch]);

  useEffect(() => {
    if (scanList && scanList.length) {
      axios.put('/beamscan/scan_list', {items: scanList})
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.log(error);
        });
      }
  }, [scanList]);

  const checkedChildren = () => {
    return scanList.reduce((x, cv) => { 
      return {
        all: x.all && cv.enable, 
        some: x.some || cv.enable
      }
    }, {
      all: true,
      some: false
    });
  }

  const subScanChildren = () => {
    return scanList.reduce((x, cv) => { 
      return {
        copol0: {
          all:  x.copol0.all  && cv.subScansOption.copol0,
          some: x.copol0.some || cv.subScansOption.copol0,
        },  
        xpol0: {
          all:  x.xpol0.all  && cv.subScansOption.xpol0,
          some: x.xpol0.some || cv.subScansOption.xpol0,
        },  
        copol1: {
          all:  x.copol1.all  && cv.subScansOption.copol1,
          some: x.copol1.some || cv.subScansOption.copol1,
        },  
        xpol1: {
          all:  x.xpol1.all  && cv.subScansOption.xpol1,
          some: x.xpol1.some || cv.subScansOption.xpol1,
        },  
        copol180: {
          all:  x.copol180.all  && cv.subScansOption.copol180,
          some: x.copol180.some || cv.subScansOption.copol180,
        },  
      }
    }, {
      copol0: {
        all: true,
        some: false
      },
      xpol0: {
        all: true,
        some: false
      },
      copol1: {
        all: true,
        some: false
      },
      xpol1: {
        all: true,
        some: false
      },
      copol180: {
        all: true,
        some: false
      }
    });
  }

  function onParentChange(checked) {
    const newList = scanList.map(obj => {
      return {...obj, enable: checked};
    });
    dispatch(setScanList(newList));
  }

  function onParentSubScansChange(what) {
    const newList = scanList.map(obj => {
      return {...obj, subScansOption: {...obj.subScansOption, ...what}}
    });
    dispatch(setScanList(newList));
    const o = {...startStopStep.subScansOption, ...what};
    dispatch(setStartStopStepSubScans(o));
  }

  function parentEnableCheckbox() {
    const kids = checkedChildren();
    return (
      <Checkbox
        color="success"
        size="small"
        disableRipple
        checked={kids.all}
        indeterminate={!kids.all && kids.some}
        style={{"paddingTop": "4px"}}
        onChange={(e) => onParentChange(!kids.some)}
        disabled={startStopStep.enable}
      />
    );
  }

  function onChangeStartStopStep(e) {
    switch(e.target.name) {
      case "rf_start":
        dispatch(setStartStopStep({ ...startStopStep, start: e.target.value }));
        break;
      case "rf_stop":
        dispatch(setStartStopStep({ ...startStopStep, stop: e.target.value }));
        break;
      case "rf_step":
        dispatch(setStartStopStep({ ...startStopStep, step: e.target.value }));
        break;
      case "rf_usb":
        dispatch(setStartStopStepIsUSB(e.target.checked));
        break;
      default:
        return;        
    }    
  }

  function onChangeEnableStartStopStep(value) {
    dispatch(setStartStopStepEnable(value));
    let newList = [];
    const o = validateStartStopStep();
    if (o.startValid && o.stopValid && o.stepValid) {
      for (let index = 0; index < o.numSteps; index++) {
        let rf = o.rfStart + (index * o.rfStep);
        let lo = startStopStep.isUSB ? rf - 10.0 : rf + 10.0;
        newList.push({
          index: index,
          enable: true,
          RF: rf,
          LO: lo,
          subScansOption: startStopStep.subScansOption
        });
      }
    }
    dispatch(setScanList(newList));
  }

  function validateStartStopStep() {
    let o = {
      startValid:true, 
      stopValid:true, 
      stepValid:true, 
      numSteps:0,
      rfStart:0,
      rfStop:0,
      rfStep:0
    };
    o.rfStart = parseFloat(startStopStep.start);
    o.rfStop = parseFloat(startStopStep.stop);
    o.rfStep = parseFloat(startStopStep.step);
    if (o.rfStart <= 0 || isNaN(o.rfStart)) {
      o.startValid = false;
    }
    if (o.rfStop < o.rfStart || isNaN(o.rfStop)) {
      o.stopValid = false;
    }
    if (o.rfStep < 0 || isNaN(o.rfStep) || (o.rfStop !== o.rfStart && o.rfStep === 0)) {
      o.stepValid = false;
    }
    if (o.startValid && o.stopValid && o.stepValid) {
      o.numSteps = (o.rfStop > o.rfStart) ? ((o.rfStop - o.rfStart) / o.rfStep) + 1 : 1;
    }
    return o;
  }

  function parentSubScansCheckbox() {
    const kids = subScanChildren();
    return (
      <React.Fragment>
        <Grid item xs={1.5}>
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "4px"}}
            checked={kids.copol0.all}
            indeterminate={!kids.copol0.all && kids.copol0.some}
            onChange={(e) => onParentSubScansChange({copol0: !kids.copol0.some})}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "4px"}}
            checked={kids.xpol0.all}
            indeterminate={!kids.xpol0.all && kids.xpol0.some}
            onChange={(e) => onParentSubScansChange({xpol0: !kids.xpol0.some})}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "4px"}}
            checked={kids.copol1.all}
            indeterminate={!kids.copol1.all && kids.copol1.some}
            onChange={(e) => onParentSubScansChange({copol1: !kids.copol1.some})}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "4px"}}
            checked={kids.xpol1.all}
            indeterminate={!kids.xpol1.all && kids.xpol1.some}
            onChange={(e) => onParentSubScansChange({xpol1: !kids.xpol1.some})}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Checkbox
            color="primary"
            size="small"
            disableRipple
            style={{"paddingTop": "4px"}}
            checked={kids.copol180.all}
            indeterminate={!kids.copol180.all && kids.copol180.some}
            onChange={(e) => onParentSubScansChange({copol180: !kids.copol180.some})}
          />
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid container textAlign="center">
        <Grid item xs={4} textAlign="left">
          <Typography variant="h6" paddingLeft="8px">Scan List</Typography>
        </Grid>
        <Grid item xs={4}>
          <FormGroup>
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={startStopStep.enable}
                  onChange={e => onChangeEnableStartStopStep(e.target.checked)}
                  size="small"                
                />
              } 
              label={
                <Typography variant="subtitle2" fontWeight="bold">
                  Use start, stop, step
                </Typography>
              }
              labelPlacement="start"
              style={{marginLeft: "0px", marginRight: "0px"}}      
            />
          </FormGroup>
        </Grid>
        <Grid item xs={2} paddingTop="8px">
          <Typography variant="subtitle2" fontWeight="bold" align="right">
            Defaults:
          </Typography>
        </Grid>
        <Grid item xs={2} paddingTop="4px">
          <Button
            name="resetButton"
            disabled={disabled || startStopStep.enable} 
            className="custom-btn-sm"
            variant="contained"
            size="small"
            style={{
              minWidth: '55%',
              maxWidth: '55%' 
            }}
            onClick={e => fetch(true)}
          >
            RESET
          </Button>
        </Grid>
        
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">Enable</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">RF</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">{ startStopStep.enable? "USB" : "SB" }</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">Co_0</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">X_0</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">Co_1</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">X_1</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">180</Typography></Grid>
      </Grid>
      <Disabled disabled={disabled}>
        <Grid container textAlign="center">
          <Grid item xs={1.5}>{ parentEnableCheckbox() }</Grid>
          <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">[ GHz ]</Typography></Grid>
          <Grid item xs={1.5}/>{ parentSubScansCheckbox() }
        </Grid>
      </Disabled>

      {startStopStep.enable && 
        <Grid container textAlign="center" sx={{borderTop:1}}>
          <Grid item xs={1.6} paddingTop="8px" paddingLeft="8px">
            <Typography variant="body2" fontWeight="Bold">RF start:</Typography>
          </Grid>
          <Grid item xs={1.8} paddingTop="4px">
            <OutlinedInput            
              name="rf_start"
              disabled={disabled}
              error={!validateStartStopStep().startValid}
              size="small"
              margin="none"          
              style={{width: '95%'}}
              className="smallinput"   
              value = {startStopStep.start}
              onChange={e => onChangeStartStopStep(e)}
            />
          </Grid>
          <Grid item xs={1}>
            <Checkbox 
              name="rf_usb"
              checked={startStopStep.isUSB}
              onChange={e => onChangeStartStopStep(e)}
              size="small"
            />
          </Grid>
          <Grid item xs={1.1} paddingTop="8px" paddingLeft="8px">
            <Typography variant="body2" fontWeight="Bold">stop:</Typography>
          </Grid>
          <Grid item xs={1.8} paddingTop="4px">
            <OutlinedInput
              name="rf_stop"
              disabled={disabled}
              error={!validateStartStopStep().stopValid}
              size="small"
              margin="none"          
              style={{width: '95%'}}
              className="smallinput"
              value = {startStopStep.stop}
              onChange={e => onChangeStartStopStep(e)}
            />
          </Grid>
          <Grid item xs={1.1} paddingTop="8px" paddingLeft="8px">
            <Typography variant="body2" fontWeight="Bold">step:</Typography>
          </Grid>
          <Grid item xs={1.8} paddingTop="4px">
            <OutlinedInput
              name="rf_step"
              disabled={disabled}
              error={!validateStartStopStep().stepValid}
              size="small"
              margin="none"          
              style={{width: '95%'}}
              className="smallinput"
              value={startStopStep.step}
              onChange={e => onChangeStartStopStep(e)}
            />
          </Grid>
          <Grid item xs={12}>&nbsp;</Grid>
        </Grid>
      }

      {!startStopStep.enable &&
        <Grid container textAlign="center" sx={{borderTop:1}}>
          {scanList.map((item, index) => (
            <ScanListItem
              key = {item.index}
              index = {item.index}
              disabled = {disabled}
            ></ScanListItem>
          ))}
        </Grid>
      } 
    </React.Fragment>
  );
}
