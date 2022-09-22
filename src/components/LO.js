import './components.css'
import AMC from './AMC'
import YTO from './YTO'
import PLL from './PLL'
import PA from './PA'
import Grid from '@mui/material/Grid'
import React from "react";

class LO extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      freqLOGHz: "",
      locked: ""
    }
  }
  componentDidMount() {
    eventBus.on("locking", (data) => 
        this.setState({freqLOGHz: data.freqLOGHz + " GHz : "}));
    eventBus.on("locked", (data) => 
        this.setState({locked: data.locked ? "LOCKED" : "UNLOCKED"}));
  }
  componentWillUnmount() {
    eventBus.remove("locking");
  }
  render() {
    return (
      <Grid container> 
        <Grid item xs={3}><AMC/></Grid>
        <Grid item xs={3}><YTO/></Grid>
        <Grid item xs={3}><PA/></Grid>          
        <Grid item xs={3}><PLL/></Grid>
      </Grid>
    )
  }
}
export default LO;