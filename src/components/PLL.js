import './components.css'
import React from "react";
import eventBus from './EventBus';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput';

import EnableButton from './EnableButton';
import LockButton from './LockButton';
import { Chip } from '@mui/material';

const axios = require('axios').default

class PLL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputLOFreq: "",
      isLocked: false,
      isLocking: false,
      lockFailed: false
    }
    this.interval = props.interval ?? 5000;
    this.timer = 0;
    this.handleTimer = this.handleTimer.bind(this);
    this.lockTimer = 0;
    this.handleLockTimer = this.handleLockTimer.bind(this);
  }
  componentDidMount() {
    this.fetch();
    if (this.timer === 0) {
      this.timer = setInterval(this.handleTimer, this.interval);
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = 0;
  }
  handleTimer() {
    this.fetch();
  }
  fetch() {
    axios.get('/lo/pll')
      .then(res => {
        const pll = res.data;
        this.setState(pll);
        eventBus.dispatch("YTO courseTune", { courseTune: pll.courseTune });
      })
      .catch(error => {
        console.log(error);
      })
      
    axios.get('/lo/pll/config')
      .then(res => {
        const config = res.data;
        this.setState(config);
      })
      .catch(error => {
        console.log(error);
      })
  }
  lockHandler() {
    if (this.state.isLocking)
      return;
    this.setState({
      isLocked: false,
      isLocking: true,
      lockFailed: false
    });
    const params = {
      freqLOGHz: Number(this.state.inputLOFreq)
    }
    eventBus.dispatch("locking", params);

    axios.put("/lo/pll/lock", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch();
        if (result.success) {
          this.setState({
            isLocked: true,
            isLocking: false
          });
        } else {
          this.setState({
            isLocked: false,
            isLocking: false,
            lockFailed: true
          });
        }
        eventBus.dispatch("locked", {locked: this.state.isLocked});
        this.lockTimer = setInterval(this.handleLockTimer, 1500);
      })
      .catch(error => {
        console.log(error);
      })
  }
  handleLockTimer() {
    clearInterval(this.lockTimer);
    this.lockTimer = 0;
    this.setState({
      isLocking: false,
      lockFailed: false
    });
  }
  clearUnlockHandler() {
    axios.put("/lo/pll/clearunlock")
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch();
      })
      .catch(error => {
        console.log(error);
      })
  }
  pllAdjustHandler() {
    const params = {
      targetCV: 0.0
    }
    axios.put("/lo/pll/adjust", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch();
      })
      .catch(error => {
        console.log(error);
      })
  }
  setNullHandler(checked) {
    const params = {
      value: checked
    }
    axios.put("/lo/pll/nullintegrator", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.setState({nullPLL: params.enable})
        this.fetch();
      })
      .catch(error => {
        console.log(error);
      })
  }
  setLoopBWHandler(checked) {
    const params = {
      loopBW: checked ? 1 : 0
    }
    axios.put("/lo/pll/config", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.setState({loopBW: params.loopBW})
      })
      .catch(error => {
        console.log(error);
      })
  }
  setLockSBHandler(checked) {
    const params = {
      lockSB: checked ? 1 : 0
    }
    axios.put("/lo/pll/config", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.setState({lockSB: params.lockSB})
      })
      .catch(error => {
        console.log(error);
      })
  }
  render() {
    let unlockDetect = !this.state.isLocked || this.state.unlockDetected;
    return (
      <Grid container spacing={0} className="component-data">
        <Grid item xs={12} className="component-header">PLL</Grid>        

        <Grid item xs={3}>
          <Chip 
            label={(this.state.isLocked) ? "LOCK" : "UNLOCK"}
            color={this.state.isLocked ? "success" : "error"}
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
            onChange={e => {this.setState({inputLOFreq: e.target.value})}}
            value = {this.state.inputLOFreq}
          />
          &nbsp;GHz
        </Grid>
        <Grid item xs={3}>
          <LockButton
            isLocked={this.state.isLocked}
            isLocking={this.state.isLocking}
            lockFailed={this.state.lockFailed}
            className="custom-lock-btn"
            onClick={event => this.lockHandler()}            
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
            onClick={e => this.clearUnlockHandler()}
          >
            CLEAR
          </Button>
        </Grid>
        <Grid item xs={1}/>

        <Grid item xs={3} className="component-title">Correction:</Grid>
        <Grid item xs={5}>{this.state.corrV}&nbsp;V</Grid>
        <Grid item xs={3}>
          <Button
            className="custom-lock-btn"
            variant="contained"
            size="small"
            style={{
              minWidth: '100%',
              maxWidth: '100%' 
            }}
            onClick={e => this.pllAdjustHandler()}
          >
            ADJUST
          </Button>
        </Grid>
        <Grid item xs={1}/>

        <Grid item xs={3} className="component-title">Ref Tot Pwr:</Grid>
        <Grid item xs={3}>{this.state.refTP}&nbsp;V</Grid>
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
            enable={this.state.nullPLL}
            onClick={(e) => {this.setNullHandler(!this.state.nullPLL)}}>
          </EnableButton>
        </Grid>
        <Grid item xs={1}/>

        <Grid item xs={3} className="component-title">IF Tot Pwr:</Grid>
        <Grid item xs={9}>{this.state.IFTP}&nbsp;V</Grid>

        <Grid item xs={3} className="component-title">Temperature:</Grid>
        <Grid item xs={9}>{this.state.temperature}&nbsp;C</Grid>

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
            enable={this.state.loopBW}
            onClick={(e) => this.setLoopBWHandler(1 - this.state.loopBW)}>
          </EnableButton>
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
            enable={this.state.lockSB}
            onClick={(e) => this.setLockSBHandler(1 - this.state.lockSB)}>
          </EnableButton>          
        </Grid>
        <Grid item xs={7}>
          &nbsp;Reference
        </Grid>
      </Grid>
    );
  }
};
export default PLL;
