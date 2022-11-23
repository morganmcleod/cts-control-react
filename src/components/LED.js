import './components.css'
import React from "react";
import Grid from '@mui/material/Grid'
import EnableButton from './EnableButton';
const axios = require('axios').default

class LED extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enable: false,
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
          enable: led.value
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
      pol: this.pol,
      enable: enable
    }
    axios.put("/cca/lna/led", params)
      .then(res => {
        const result = res.data;
        console.log(result);
        this.fetch()
      })
      .catch(error => {
        console.log(error);
      })
  }
  render() {
    return (
      <Grid container className="component-data">
        <Grid item xs={12} className="component-header">LED pol {this.pol}</Grid>
        <Grid item xs={12}>
          <EnableButton
            enableColor="green"
            enable={this.state.enable}
            onClick={(e) => this.onClickEnable(e)}
          ></EnableButton>
        </Grid>
      </Grid>
    );
  }
}
export default LED;
