import './components.css'
import React from "react";
import Grid from '@mui/material/Grid'
import { Button } from "react-bootstrap";
const axios = require('axios').default

class PA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      VDp0: 0.0,
      VDp1: 0.0,
      IDp0: 0.0,
      IDp1: 0.0,
      VGp0: 0.0,
      VGp1: 0.0,
      supply3V: 0.0, 
      supply5V: 0.0,
      inputVDp0: "",
      inputVDp1: "",
      inputVGp0: "",
      inputVGp1: ""
    };
    this.interval = props.interval ?? 5000;
    this.timer = 0;
    this.handleTimer = this.handleTimer.bind(this);
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
    axios.get("/lo/pa")
      .then(res => {
        const pa = res.data;
        this.setState({
          VDp0: pa.VDp0,
          VDp1: pa.VDp1,
          IDp0: pa.IDp0,
          IDp1: pa.IDp1,
          VGp0: pa.VGp0,
          VGp1: pa.VGp1,
          supply3V: pa.supply3V, 
          supply5V: pa.supply5V
        })
        if (this.state.inputVGp0 === "") {
          this.setState({
            inputVGp0: pa.VGp0,
            inputVGp1: pa.VGp1
          })
        }
      })
  }
  setPAHandler(pol) {
    const params = {
      pol: pol,
      VDControl: Number((pol === 0) ? this.state.inputVDp0 : this.state.inputVDp1),
      VG: Number((pol === 0) ? this.state.inputVGp0 : this.state.inputVGp1)
    }
    axios.put("/lo/pa/bias", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch();
      })
  }
  render() {
    let setP0Props = {
      size: 'sm',
      onClick: event => this.setPAHandler(0)
    }
    let setP1Props = {
      size: 'sm',
      onClick: event => this.setPAHandler(1)
    }
    return (
      <Grid container spacing = {0.4} className="component-data">
        <Grid item xs={12} className="component-header">Power Amp</Grid>        

        <Grid container spacing = {0.4} className="component-title">
          <Grid item xs={3}></Grid>
          <Grid item xs={3}>VD</Grid>
          <Grid item xs={3}>VG</Grid>
          <Grid item xs={3}>ID [mA]</Grid>
        </Grid>

        <Grid item xs={3} className="component-title">Pol0:</Grid>
        <Grid item xs={3}>{this.state.VDp0}</Grid>
        <Grid item xs={3}>{this.state.VGp0}</Grid>
        <Grid item xs={3}>{this.state.IDp0}</Grid>

        <Grid item xs={3} className="component-title">Pol1:</Grid>
        <Grid item xs={3}>{this.state.VDp1}</Grid>
        <Grid item xs={3}>{this.state.VGp1}</Grid>
        <Grid item xs={3}>{this.state.IDp1}</Grid>
      
        <Grid item xs={3} className="component-title">Pol0:</Grid>
        <Grid item xs={3}><
          input type="text" 
          name="set_VDp0" 
          className="component-input"
          onChange={event => {this.setState({inputVDp0: event.target.value})}}
          value={this.state.inputVDp0}
          />
        </Grid>
        <Grid item xs={3}><
          input type="text" 
          name="set_VGp0" 
          className="component-input"
          onChange={event => {this.setState({inputVGp0: event.target.value})}}
          value={this.state.inputVGp0}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            className="custom-btn"
            {...setP0Props}
          >SET</Button>
        </Grid>          


        <Grid item xs={3} className="component-title">Pol1:</Grid>
        <Grid item xs={3}>
          <input type="text" 
            name="set_VDp1" 
            className="component-input"
            onChange={event => {this.setState({inputVDp1: event.target.value})}}
            value={this.state.inputVDp1}
          />
        </Grid>
        <Grid item xs={3}>
          <input type="text" 
            name="set_VGp1" 
            className="component-input"
            onChange={event => {this.setState({inputVGp1: event.target.value})}}
            value={this.state.inputVGp1}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            className="custom-btn"
            {...setP1Props}
          >SET</Button>
        </Grid>

        <Grid item xs={3} className="component-title">3V&nbsp;supply:</Grid>
        <Grid item xs={9}>{this.state.supply3V}</Grid>
        
        <Grid item xs={3} className="component-title">5V&nbsp;supply:</Grid>
        <Grid item xs={9}>{this.state.supply5V}</Grid>

      </Grid>
    );
  }
}
export default PA;