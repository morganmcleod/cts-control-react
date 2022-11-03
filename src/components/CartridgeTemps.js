import './components.css'
import React from "react";
import Grid from '@mui/material/Grid'
const axios = require('axios').default

class CartridgeTemps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp0: 0,
      temp1: 0,
      temp2: 0,
      temp3: 0,
      temp4: 0,
      temp5: 0
    }
    this.interval = props.interval ? props.interval : 5000;
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
    axios.get(`/cca/tempsensors`)
      .then(res => {
        const temps = res.data;
        this.setState({ 
          temp0: temps.temp0,
          temp1: temps.temp1,
          temp2: temps.temp2,
          temp3: temps.temp3,
          temp4: temps.temp4,
          temp5: temps.temp5
         });
      })
      .catch(error => {
        console.log(error);
      })
  }
  render() {
    return (
      <Grid container className="component-data">
        <Grid item xs={12} className="component-header">Temperatures</Grid>
        
        <Grid item xs={3} className="component-title">mixer pol0:</Grid>
        <Grid item xs={2}>{this.state.temp2.toFixed(2)} K</Grid>
        <Grid item xs={1}/>
        <Grid item xs={2} className="component-title">pol1:</Grid>
        <Grid item xs={4}>{this.state.temp5.toFixed(2)} K</Grid>
        
        <Grid item xs={3} className="component-title" >4K:</Grid>
        <Grid item xs={2}>{this.state.temp0.toFixed(2)} K</Grid>
        <Grid item xs={1}/>
        <Grid item xs={2} className="component-title">15K:</Grid>
        <Grid item xs={4}>{this.state.temp4.toFixed(2)} K</Grid>
        
        <Grid item xs={3} className="component-title">110K:</Grid>
        <Grid item xs={9}>{this.state.temp1.toFixed(2)} K</Grid>
      </Grid>
    );
  }
}
export default CartridgeTemps;
