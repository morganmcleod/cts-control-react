import './components.css'
import React from "react";
import Grid from '@mui/material/Grid'
import { ToggleButton } from "react-bootstrap";
const axios = require('axios').default

class Heater extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enable: false,
      enableText: "DISABLED",
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
  }
  setEnableHandler(enable) {
    console.log('setEnableHandler ' + enable);
    const params = {
      enable: enable
    }
    axios.put("/cca/sis/heater", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        if (result.success) {
            this.setState({
              enable: enable,
              enableText: enable ? "ENABLED" : "DISABLED"
            })
            this.fetch();
        }
      })
  }
  render() {
    return (
      <Grid container className="component-data">
        <Grid item xs={12} className="component-header">SIS HEATER</Grid>
        <Grid item xs={12}>
          <ToggleButton
            className='custom-btn'
            id="HeaterEnabled"
            size="sm"
            type="checkbox"
            variant="info"
            checked={this.state.enable}
            onChange={(e) => this.setEnableHandler(e.currentTarget.checked)}
          >
          {this.state.enableText}
          </ToggleButton>
        </Grid>
        <Grid item xs={4} className="component-title">current:</Grid>
        <Grid item xs={8}>{this.state.current} mA</Grid>          
      </Grid>
    );
  }
}
export default Heater;
