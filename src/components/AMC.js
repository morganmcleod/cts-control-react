import './components.css'
import React from "react";
import Grid from '@mui/material/Grid'
const axios = require('axios').default

class AMC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    axios.get(`/lo/amc`)
      .then(res => {
        const amc = res.data;
        this.setState(amc);
      })
  }
  render() {
    return (
      <Grid container spacing={0} className="component-data">
        <Grid item xs={12} className="component-header">AMC</Grid>
        
        <Grid item xs={4}></Grid>
        <Grid item className="component-title" xs={3}>VD [V]</Grid>
        <Grid item className="component-title" xs={3}>ID [mA]</Grid>
        <Grid item className="component-title" xs={2}>VG [V]</Grid>
        
        <Grid item xs={4} className="component-title">stage A:</Grid>
        <Grid item xs={3}>{this.state.VDA}</Grid>
        <Grid item xs={3}>{this.state.IDA}</Grid>
        <Grid item xs={2}>{this.state.VGA}</Grid>

        <Grid item xs={4} className="component-title">stage B:</Grid>
        <Grid item xs={3}>{this.state.VDB}</Grid>
        <Grid item xs={3}>{this.state.IDB}</Grid>
        <Grid item xs={2}>{this.state.VGB}</Grid>

        <Grid item xs={4} className="component-title">stage E:</Grid>
        <Grid item xs={3}>{this.state.VDE}</Grid>
        <Grid item xs={3}>{this.state.IDE}</Grid>
        <Grid item xs={2}>{this.state.VGE}</Grid>

        <Grid item xs={4}></Grid>
        <Grid item xs={3} className="component-title">counts</Grid>
        <Grid item xs={5} className="component-title">current [mA]</Grid>

        <Grid item xs={4} className="component-title">mult D:</Grid>
        <Grid item xs={3}>{this.state.multDCounts}</Grid>
        <Grid item xs={5}>{this.state.multDCurrent}</Grid>          

        <Grid item xs={4} className="component-title">5V supply:</Grid>
        <Grid item xs={8}>{this.state.supply5V}</Grid>
        
      </Grid>
    );
  }
}
export default AMC;
