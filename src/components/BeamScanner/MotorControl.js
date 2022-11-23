import '../components.css'
import React from "react";
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ForwardIcon from '@mui/icons-material/Forward';
import PauseIcon from '@mui/icons-material/Pause';
import eventBus from '../EventBus';

const axios = require('axios').default

class MotorController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: {x: 0, y:0, pol:0},
      goto: {x: 0, y:0, pol:0},
      gotoValid: false,
      xy_speed: 0,
      pol_speed: 0,
      xy_accel: 15,
      pol_accel: 10,
      xy_decel: 15,
      pol_decel: 10,
      trigger_interval: 0.5,
      motor_status: {  
        xPower: false,
        yPower: false,
        polPower: false,
        xMotion: false,
        yMotion: false,
        polMotion: false
      },
      isConnected: false
    };
    this.interval = props.interval ?? 5000;
    this.timer = 0;
    this.handleTimer = this.handleTimer.bind(this);
  }

  componentDidMount() {
    axios.get('/beamscan/mc/xy_speed')
    .then(res => {
      this.setState({xy_speed: res.data.value});
    })
    .catch(error => {
      console.log(error);
    })
    
    axios.get(`/beamscan/mc/pol_speed`)
    .then(res => {
      this.setState({pol_speed: res.data.value})
    })
    .catch(error => {
      console.log(error);
    })

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
    axios.get('/beamscan/mc/isconnected')
      .then(res => {
        this.setState({isConnected: res.data.value});
      })
      .catch(error => {
        console.log(error);
      })
      
    axios.get('beamscan/mc/status')
      .then(res => {
        const motor_status = res.data;
        this.setState({motor_status: motor_status});
        if (motor_status.xMotion || 
            motor_status.yMotion || 
            motor_status.polMotion) 
        {
          this.setState({gotoValid: false});
        }
      })
      .catch(error => {
        console.log(error);
      })

    axios.get('/beamscan/mc/position')
      .then(res => {
        this.setState({position: res.data});
        eventBus.dispatch("/beamscan/mc/position", res.data)
      })
      .catch(error => {
        console.log(error);
      })
  }

  handleHome(axis) {
    axios.put("/beamscan/mc/home/" + axis)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  handleSetZero(axis) {
    axios.put("/beamscan/mc/set_zero/" + axis)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  handleParamChange(e) {
    let state = {}
    state[e.target.name] = e.target.value;
    this.setState(state);
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

  handleGotoChange(e) {
    let goto = this.state.gotoValid ? {...this.state.goto} : {...this.state.position};
    goto[e.target.name] = e.target.value;
    this.setState({goto: goto, gotoValid: true});
  }

  handleGoto() {
    if (this.state.gotoValid && this.state.goto.x >= 0 && this.state.goto.y >= 0 && this.state.goto.pol >= 0) {
      axios.put("/beamscan/mc/next_pos", this.state.goto)
      .then(res => {
        console.log(res.data);
        this.setState({goto: this.state.position, gotoValid: false});
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
  
  render() {
    return (
      <Grid container spacing={0} className="component-data">
        <Grid item xs={12} className="component-header">Motor Controller</Grid>

        <Grid item xs={3}>
          <Chip 
            label={(this.state.isConnected) ? "CONNECTED" : "ERROR"}
            color={this.state.isConnected ? "success" : "error"}
            size="small"
          />
        </Grid>
        <Grid item xs={2} className="component-title">X [mm]</Grid>
        <Grid item xs={2} className="component-title">Y [mm]</Grid>
        <Grid item xs={5} className="component-title">Pol [deg]</Grid>

        <Grid item xs={3} className="component-title">Position:</Grid>
        <Grid item xs={2}>{this.state.position.x}</Grid>
        <Grid item xs={2}>{this.state.position.y}</Grid>
        <Grid item xs={5}>{this.state.position.pol}</Grid>
        
        <Grid item xs={3} className="component-title">Go To:</Grid>
        <Grid item xs={2} className="input-grid">
          <OutlinedInput
            name="x"
            size="small"
            margin="none"
            className="component-input"
            style={{width: '80%'}}
            onChange={e => {this.handleGotoChange(e)}}
            value = {this.state.gotoValid ? this.state.goto.x : this.state.position.x}
          />
        </Grid>
        <Grid item xs={2} className="input-grid">
          <OutlinedInput
            name="y"
            size="small"
            margin="none"
            className="component-input"
            style={{width: '80%'}}
            onChange={e => {this.handleGotoChange(e)}}
            value = {this.state.gotoValid ? this.state.goto.y : this.state.position.y}
          />
        </Grid>
        <Grid item xs={2} className="input-grid">
          <OutlinedInput
            name="pol"
            size="small"
            margin="none"
            className="component-input"
            style={{width: '80%'}}
            onChange={e => {this.handleGotoChange(e)}}
            value = {this.state.gotoValid ? this.state.goto.pol : this.state.position.pol}
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
            onClick={e => this.handleGoto()}
          >
            GO
          </Button>
        </Grid>
        
        <Grid item xs={3} className="component-title">In Motion:</Grid>
        <Grid item xs={2}>{this.state.motor_status.xMotion ? <ForwardIcon color="success"/> : <PauseIcon/>}</Grid>
        <Grid item xs={2}>{this.state.motor_status.yMotion ? <ForwardIcon color="success"/> : <PauseIcon/>}</Grid>
        <Grid item xs={5}>{this.state.motor_status.polMotion ? <ForwardIcon color="success"/> : <PauseIcon/>}</Grid>

        <Grid item xs={3} className="component-title">Power:</Grid>
        <Grid item xs={2}>{this.state.motor_status.xPower ? <CheckCircleIcon color="success"/> : <ErrorIcon color="error"/>}</Grid>
        <Grid item xs={2}>{this.state.motor_status.yPower ? <CheckCircleIcon color="success"/> : <ErrorIcon color="error"/>}</Grid>
        <Grid item xs={5}>{this.state.motor_status.polPower ? <CheckCircleIcon color="success"/> : <ErrorIcon color="error"/>}</Grid>

        <Grid item xs={3} className="component-title">Speed:</Grid>
        <Grid item xs={4} className="input-grid">
          <OutlinedInput
            name="xy_speed"
            size="small"
            margin="none"
            className="component-input"
            style={{width: '40%'}}
            onChange={e => {this.handleParamChange(e)}}
            value = {this.state.xy_speed}
          />&nbsp;mm/sec
        </Grid>
        <Grid item xs={4} className="input-grid">
          <OutlinedInput
            name="pol_speed"
            size="small"
            margin="none"
            className="component-input"
            style={{width: '40%'}}
            onChange={e => {this.handleParamChange(e)}}
            value = {this.state.pol_speed}
          />&nbsp;deg/sec
        </Grid>
        <Grid item xs={1}/>
        
        <Grid item xs={3} className="component-title">Acceleration:</Grid>
        <Grid item xs={4} className="input-grid">
          <OutlinedInput
            name="xy_accel"
            size="small"
            margin="none"
            className="component-input"
            style={{width: '40%'}}
            onChange={e => {this.handleParamChange(e)}}
            value = {this.state.xy_accel}
          />&nbsp;mm/sec^2
        </Grid>
        <Grid item xs={4} className="input-grid">
          <OutlinedInput
            name="pol_accel"
            size="small"
            margin="none"
            className="component-input"
            style={{width: '40%'}}
            onChange={e => {this.handleParamChange(e)}}
            value = {this.state.pol_accel}
          />&nbsp;deg/sec^2
        </Grid>
        <Grid item xs={1}/>

        <Grid item xs={3} className="component-title">Deceleration:</Grid>
        <Grid item xs={4} className="input-grid">
          <OutlinedInput
            name="xy_decel"
            size="small"
            margin="none"
            className="component-input"
            style={{width: '40%'}}
            onChange={e => {this.handleParamChange(e)}}
            value = {this.state.xy_decel}
          />&nbsp;mm/sec^2
        </Grid>
        <Grid item xs={4} className="input-grid">
          <OutlinedInput
            name="pol_decel"
            size="small"
            margin="none"
            className="component-input"
            style={{width: '40%'}}
            onChange={e => {this.handleParamChange(e)}}
            value = {this.state.pol_decel}
          />&nbsp;deg/sec^2
        </Grid>
        <Grid item xs={1}/>

        <Grid item xs={3} className="component-title">Trigger Interval:</Grid>
        <Grid item xs={4} className="input-grid">
          <OutlinedInput
            name="trigger_interval"
            size="small"
            margin="none"
            className="component-input"
            style={{width: '40%'}}
            onChange={e => {this.handleParamChange(e)}}
            value = {this.state.trigger_interval}
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
            onClick={e => this.handleHome('x')}
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
            onClick={e => this.handleHome('y')}
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
            onClick={e => this.handleHome('pol')}
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
            onClick={e => this.handleHome('xy')}
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
            onClick={e => this.handleSetZero('x')}
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
            onClick={e => this.handleSetZero('y')}
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
            onClick={e => this.handleSetZero('pol')}
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
            onClick={e => this.handleSetZero('xy')}
          >
            XY
          </Button>
        </Grid>
        <Grid item xs={1}/>
      </Grid>
    );
  }
}

export default MotorController;
