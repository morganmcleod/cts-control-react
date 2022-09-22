import './components.css'
import React from "react";
import Grid from '@mui/material/Grid'
import eventBus from './EventBus';
import { Button } from "react-bootstrap";
const axios = require('axios').default

class YTO extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lowGHz: 0.0,
      highGHz: 0.0,
      inputLowGHz: "",
      inputHighGHz: "",
      courseTune: 0,
    }
  }
  componentDidMount() {
    this.fetch();
    eventBus.on("YTO courseTune", (data) => 
      this.setCourseTune(data.courseTune));
    eventBus.on("PLL mults", (data) =>
      this.setState({
        coldMult: data.coldMult,
        warmMult: data.warmMult
      }));
  }
  componentWillUnmount() {
    eventBus.remove("YTO courseTune");
  }
  setCourseTune(courseTune) {
    let ytoFreq = 0;
    if (this.state.lowGHz > 0 && this.state.highGHz > this.state.lowGHz) {
<<<<<<< HEAD
      ytoFreq = (this.state.lowGHz + ((courseTune / 4095) * (this.state.highGHz - this.state.lowGHz))).toFixed(3);
=======
      ytoFreq = (this.state.lowGHz + (courseTune / 4095) / (this.state.highGHz - this.state.lowGHz)).toFixed(3);
>>>>>>> acfcf64... fix
    }
    this.setState({
      courseTune: courseTune,
      ytoFreq: ytoFreq
    });    
  }
  fetch() {
    axios.get(`/lo/yto`)
      .then(res => {
        const yto = res.data;
        this.setState({ 
          lowGHz: yto.lowGHz,
          highGHz: yto.highGHz,
        });
        this.setCourseTune(yto.courseTune);
        if (this.state.inputLowGHz === "") {
          this.setState({ 
            inputLowGHz: yto.lowGHz,
            inputHighGHz: yto.highGHz
          });
        }
      })
  }
  setLimitsHandler() {
    const params = {
      lowGHz:  Number(this.state.inputLowGHz),
      highGHz: Number(this.state.inputHighGHz)
    }
    axios.put("/lo/yto/limits", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch();
      })
  }
  tweakYTO(amount) {
    const params = {
      courseTune: this.state.courseTune + amount
    }
    axios.put("/lo/yto/coursetune", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch();
      })
  }
  render() {
    let setLimitsProps = {
      size: 'sm',
      onClick: event => this.setLimitsHandler()
    }
    let incYTOProps = {
      size: 'sm',
      onClick: event => this.tweakYTO(1)
    }
    let decYTOProps = {
      size: 'sm',
      onClick: event => this.tweakYTO(-1)
    }
    return (
      <Grid container spacing={0} className="component-data">
        <Grid item xs={12} className="component-header">YTO</Grid>        

        <Grid item xs={3} className="component-title">low [GHz]:</Grid>
        <Grid item xs={3}>{this.state.lowGHz}</Grid>
        <Grid item xs={6}>
          <input type="text"
            name="setLow" 
            className="component-input"
            onChange={event => {this.setState({inputLowGHz: event.target.value})}}
            value = {this.state.inputLowGHz}
          />
        </Grid>

        <Grid item xs={3} className="component-title">high [Ghz]:</Grid>
        <Grid item xs={3}>{this.state.highGHz}</Grid>
        <Grid item xs={3}>
          <input type="text" 
            name="setHigh" 
            className="component-input"
            onChange={event => {this.setState({inputHighGHz: event.target.value})}}
            value = {this.state.inputHighGHz}
          />
        </Grid>
        <Grid item xs={3}>
          <Button 
            className="custom-btn" 
            {...setLimitsProps}
          >SET</Button>
        </Grid>

        <Grid item xs={3} className="component-title">courseTune:</Grid>
        <Grid item xs={3}>{this.state.courseTune}</Grid>
        <Grid item xs={3}>
          <Button 
            className="custom-btn"
            style={{width: "39px"}}
            {...decYTOProps}
          >-1</Button>
        </Grid>
        <Grid item xs={3}>
          <Button 
            className="custom-btn" 
            style={{width: "39px"}}
            {...incYTOProps}
          >+1</Button>
        </Grid>

        <Grid item xs={3} className="component-title">frequency:</Grid>
        <Grid item xs={8}>{this.state.ytoFreq} GHz</Grid>
        
      </Grid>
    );
  }
};
export default YTO;