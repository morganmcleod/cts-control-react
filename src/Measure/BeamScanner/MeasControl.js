// React and Redux
import React from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setActive, setDescription } from '../Shared/MeasureSlice';

export default function MeasControl(props) {
  // Redux store interfaces
  const measActive = useSelector((state) => state.Measure.active);
  const dispatch = useDispatch();

  const handleClickStart = () => {
    axios.put("/beamscan/start")
      .then(res => {
        console.log(res.data);
        dispatch(setActive(true));
        dispatch(setDescription("Beam patterns"));
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleClickStop = () => {
    axios.put("/beamscan/stop")
      .then(res => {
        console.log(res.data);
        dispatch(setActive(false));
        dispatch(setDescription(null));
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} className="component-header">Controls</Grid>
        <Grid item>
          <Button
            className="custom-lock-btn"
            variant="contained"
            size="small"
            disabled={measActive}
            onClick={e => handleClickStart()}
          >
            Start
          </Button>
        </Grid>
        <Grid item>
          <Button
            className="custom-lock-btn"
            variant="contained"
            size="small"
            disabled={!measActive}
            onClick={e => handleClickStop()}
          >
            Stop
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
