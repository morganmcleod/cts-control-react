import './components.css'
import React from "react";
import Grid from '@mui/material/Grid'
import EnableButton from './EnableButton';

const axios = require('axios').default

class Heater extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enable: false,
      current: 0.0
    }
  }
  componentDidMount() {
    this.fetch();
  }
  componentWillUnmount() {
  }
  fetch() {
    axios.get(`/cca/sis/heater`)
      .then(res => {
        const current = res.data.value;
        this.setState({ 
          current: current
         });
      })
      .catch(error => {
        console.log(error);
      })
  }
  onClickEnable(e) {
    const enable = e.currentTarget.value !== 'true';
    console.log('onClickEnable ' + enable);
    this.setState({enable: enable});
    const params = {
      enable: enable
    }
    axios.put("/cca/sis/heater", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        if (result.success) {
            this.fetch();
        }
      })
      .catch(error => {
        console.log(error);
      })
  }
  render() {
    return (
      <Grid container className="component-data">
        <Grid item xs={12} className="component-header">SIS HEATER</Grid>
        <Grid item xs={12}>
          <EnableButton
            enableColor="red"
            enable={this.state.enable}
            onClick={(e) => this.onClickEnable(e)}
          ></EnableButton>
        </Grid>
        <Grid item xs={3} className="component-title">current:</Grid>
        <Grid item xs={9}>{this.state.current} mA</Grid>
      </Grid>
    )
  }
}
export default Heater;
