import './components.css'
import React from "react";
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput';

import EnableButton from './EnableButton';
const axios = require('axios').default

class LNA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "",
      enable: false,
      VD1: 0.0,
      VD2: 0.0,
      VD3: 0.0,
      ID1: 0.0,
      ID2: 0.0,
      ID3: 0.0,
      VG1: 0.0,
      VG2: 0.0,
      VG3: 0.0,
    }
    this.pol = props.pol ?? 0;
    this.lna = props.lna ?? 1;
    this.interval = props.interval ?? 5000;
    this.timer = 0;
  }
  componentDidMount() {
    this.fetch();
    if (this.timer === 0) {
      this.timer = setInterval(() => this.handleTimer(), this.interval);
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
      lna: this.lna,
    }
    axios.get("/cca/lna", { params: params })
      .then(res => {
        const lna = res.data;
        this.setState({
          key: 'LNA' + this.pol.toString() + this.lna.toString(),
          enable: lna.enable,
          VD1: lna.VD1,
          VD2: lna.VD2,
          VD3: lna.VD3,
          ID1: lna.ID1,
          ID2: lna.ID2,
          ID3: lna.ID3,
          VG1: lna.VG1,
          VG2: lna.VG2,
          VG3: lna.VG3
        })
      })
      .catch(error => {
        console.log(error);
      })
  }
  onClickEnable(e) {
    const enable = e.currentTarget.value !== 'true';
    console.log('setEnableHandler ' + enable);
    this.setState({enable: enable})
    const params = {
      pol: this.pol,
      lna: this.lna,
      enable: enable
    }
    axios.put("/cca/lna/enable", params)
      .then(res => {
        const result = res.data;
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      })
  }
  setValueHandler(what) {
    let params = {
      pol: this.pol,
      lna: this.lna
    }
    params[what] =  document.getElementsByName("set" + what)[0].value
    if (params[what]) {
      axios.put("/cca/lna", params)
        .then(res => {
          const result = res.data;
          console.log(result);
        })
        .catch(error => {
          console.log(error);
        })
      }
  }
  setAllHandler() {
    this.setValueHandler('VD1');
    this.setValueHandler('VD2');
    this.setValueHandler('VD3');
    this.setValueHandler('ID1');
    this.setValueHandler('ID2');
    this.setValueHandler('ID3');
  }
  render() {
    return (
      <Grid container className="component-data">
        <Grid item xs={12} className="component-header">LNA {this.lna}</Grid>

        <Grid item xs={12}>
          <EnableButton
            enableColor="green"
            disableColor="red"
            enable={this.state.enable}
            onClick={(e) => this.onClickEnable(e)}/>
        </Grid>
        
        <Grid item xs={3} className="component-title">VD1 [V]:</Grid>
        <Grid item xs={2}>{this.state.VD1}</Grid>
        <Grid item xs={3}>
          <OutlinedInput
            name="setVD1"
            size="small"
            margin="none"
            className="component-input"
          />
        </Grid>
        <Grid item xs={0.5}/>
        <Grid item xs={3.5}>
          <Button 
            className="custom-btn"
            variant="contained"
            size="small"
            onClick={(e) => this.setAllHandler()}
          >
            SET
          </Button>
        </Grid>
        
        <Grid item xs={3} className="component-title">VD2 [V]:</Grid>
        <Grid item xs={2}>{this.state.VD2}</Grid>
        <Grid item xs={3}>
          <OutlinedInput
            name="setVD2"
            size="small"
            margin="none"
            className="component-input"
          />
        </Grid>
        <Grid item xs={4}/>

        <Grid item xs={3} className="component-title">VD3 [V]:</Grid>
        <Grid item xs={2}>{this.state.VD3}</Grid>
        <Grid item xs={3}>
          <OutlinedInput
            name="setVD3"
            size="small"
            margin="none"
            className="component-input"
          />
        </Grid>
        <Grid item xs={4}/>

        <Grid item xs={3} className="component-title">ID1 [mA]:</Grid>
        <Grid item xs={2}>{this.state.ID1}</Grid>
        <Grid item xs={3}>
          <OutlinedInput
            name="setID1"
            size="small"
            margin="none"
            className="component-input"
          />
        </Grid>
        <Grid item xs={4}/>
        
        <Grid item xs={3} className="component-title">ID2 [mA]:</Grid>
        <Grid item xs={2}>{this.state.ID2}</Grid>
        <Grid item xs={3}><OutlinedInput
            name="setID2"
            size="small"
            margin="none"
            className="component-input"
          />
        </Grid>
        <Grid item xs={4}/>
        
        <Grid item xs={3} className="component-title">ID3 [mA]:</Grid>
        <Grid item xs={2}>{this.state.ID3}</Grid>
        <Grid item xs={3}><OutlinedInput
            name="setID3"
            size="small"
            margin="none"
            className="component-input"
          />
        </Grid>
        <Grid item xs={4}/>

        <Grid item xs={3} className="component-title">VG1 [V]:</Grid>
        <Grid item xs={9}>{this.state.VG1}</Grid>

        <Grid item xs={3} className="component-title">VG2 [V]:</Grid>
        <Grid item xs={9}>{this.state.VG2}</Grid>

        <Grid item xs={3} className="component-title">VG3 [V]:</Grid>
        <Grid item xs={9}>{this.state.VG3}</Grid>
      </Grid>
    );
  }
}

export default LNA;
