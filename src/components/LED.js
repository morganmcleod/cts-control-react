import './components.css'
import React from "react";
import Grid from '@mui/material/Grid'
import { ToggleButton } from "react-bootstrap";
const axios = require('axios').default

class LED extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enable: false,
      enableText: ""
    }
    this.pol = props.pol ?? 0;
  }
  componentDidMount() {
    this.fetch();
  }
  componentWillUnmount() {
  }
  fetch() {
    let params = {
      pol: this.pol
    };
    axios.get(`/cca/lna/led`, { params: params })
      .then(res => {
        const led = res.data;
        this.setState({ 
          enable: led.enable,
          enableText: led.enable ? "ENABLED" : "DISABLED"
         });
      })
  }
  setEnableHandler(enable) {
    console.log('setEnableHandler ' + enable);
    const params = {
      pol: this.pol,
      enable: enable
    }
    axios.put("/cca/lna/led", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch()
      })
  }
  render() {
    let buttonId = "LEDenabled" + this.pol;
    return (
      <Grid container className="component-data">
        <Grid item xs={12} className="component-header">LED pol {this.pol}</Grid>
        <Grid item xs={12}>
          <ToggleButton
            className='custom-btn'
            id={buttonId}
            size="sm"
            type="checkbox"
            variant="info"
            checked={this.state.enable}
            onChange={(e) => this.setEnableHandler(e.currentTarget.checked)}
          >
          {this.state.enableText}
          </ToggleButton>
        </Grid>
      </Grid>
    );
  }
}
export default LED;
