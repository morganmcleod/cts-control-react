import './components.css'
import AMC from './AMC'
import YTO from './YTO'
import PLL from './PLL'
import PA from './PA'
import Grid from '@mui/material/Grid'
import React from "react";

class LO extends React.Component {
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