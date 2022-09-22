import './components.css'
import React from "react";
import Grid from '@mui/material/Grid'
import { Button } from "react-bootstrap";
const axios = require('axios').default

class SIS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "",
      Vj: 0.0,
      Ij: 0.0,
      Vmag: 0.0,
      Imag: 0.0,
      averaging: props.averaging ? props.averaging : 1
    };
    this.pol = props.pol ?? 0;
    this.sis = props.sis ?? 1;
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
    let params = {
      pol: this.pol,
      sis: this.sis,
      averaging: this.state.averaging
    }
    axios.get("/cca/sis", { params: params })
      .then(res => {
        const sis = res.data;
        this.setState({
          key: 'SIS' + this.pol.toString() + this.sis.toString(),
          Vj: sis.Vj,
          Ij: sis.Ij,
          Vmag: sis.Vmag,
          Imag: sis.Imag,
          averaging: sis.averaging
        })
      })
  }
  setVjHandler() {
    const params = {
      pol: this.pol,
      sis: this.sis,
      Vj: document.getElementsByName("setVj")[0].value
    }
    axios.put("/cca/sis", params)
      .then(res => {
        const result = res.data;
        console.log(result);
      })
  }
  setImagHandler() {
    const params = {
      pol: this.pol,
      sis: this.sis,
      Imag: document.getElementsByName("setImag")[0].value
    }
    axios.put("/cca/sis", params)
      .then(res => {
        const result = res.data;
        console.log(result);
      })
  }
  render() {
    let setVjProps = {
      size: 'sm',
      onClick: event => this.setVjHandler()
    }
    let setImagProps = {
      size: 'sm',
      onClick: event => this.setImagHandler()
    }
    return (
      <Grid container className="component-data">
       <Grid item xs={12}className="component-header">SIS {this.sis}</Grid>

       <Grid item xs={3} className="component-title">Vj [mV]:</Grid>
       <Grid item xs={3}>{this.state.Vj.toFixed(3)}</Grid>
       <Grid item xs={3}><input type="text" name="setVj" className="component-input"/></Grid>
       <Grid item xs={3}><Button className="custom-btn" size='sm' {...setVjProps}>SET</Button></Grid>

       <Grid item xs={3} className="component-title">Ij [mA]:</Grid>
       <Grid item xs={9}>{this.state.Ij.toFixed(3)}</Grid>

       <Grid item xs={12} className="component-header">Magnet {this.sis}</Grid>

       <Grid item xs={3} className="component-title">Imag [mA]:</Grid>
       <Grid item xs={3}>{this.state.Imag.toFixed(2)}</Grid>
       <Grid item xs={3}><input type="text" name="setImag" className="component-input"/></Grid>
       <Grid item xs={3}><Button className="custom-btn" size='sm' {...setImagProps}>SET</Button></Grid>

       <Grid item xs={3} className="component-title">Vmag [mV]:</Grid>
       <Grid item xs={9}>{this.state.Vmag.toFixed(2)}</Grid>
      </Grid>
    );
  }
}

export default SIS;
