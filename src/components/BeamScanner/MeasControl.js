import '../components.css'
import React from "react";
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

const axios = require('axios').default

class MeasControl extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClickStart() {
    this.props.startScan(true);
    axios.put("/beamscan/start")
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  handleClickStop() {
    this.props.startScan(false);
    axios.put("/beamscan/stop")
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    return (
      <Grid container>
        <Grid item xs={12} className="component-header">Controls</Grid>
        <Grid item>
          <Button
            className="custom-lock-btn"
            variant="contained"
            size="small"
            disabled={this.props.scanning}
            onClick={e => this.handleClickStart()}
          >
            Start
          </Button>
        </Grid>
        <Grid item>
          <Button
            className="custom-lock-btn"
            variant="contained"
            size="small"
            disabled={!this.props.scanning}
            onClick={e => this.handleClickStop()}
          >
            Stop
          </Button>
        </Grid>
      </Grid>      
    )
  }
}
export default MeasControl