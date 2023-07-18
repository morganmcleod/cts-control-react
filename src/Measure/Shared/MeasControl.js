// React and Redux
import React from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { 
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Tooltip
} from '@mui/material';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { 
  setMeasureActive, 
  setMeasureDescription,
  setMeasureOperator,
  setMeasureNotes
} from './MeasureSlice';

export default function MeasControl(props) {
  // Redux store interfaces
  const measActive = useSelector((state) => state.Measure.active);
  const measNotes =  useSelector((state) => state.Measure.notes);
  const measOperator =  useSelector((state) => state.Measure.operator);
  const cartConfig = useSelector((state) => state.CartBias.cartConfig);
  const cartConfigId = cartConfig ? cartConfig.id : null;
  const cartSerialNum = cartConfig ? cartConfig.serialNum : null;
  const dispatch = useDispatch();

  const handleClickStart = () => {
    const params = {
      serialNum: cartSerialNum,
      configId: cartConfigId,
      operator: measOperator,
      description: measNotes
    };
    dispatch(setMeasureActive(true));
    axios.put(props.startUrl, params)
      .then(res => {
        console.log(res.data);
        if (res.data.success) {
          // dispatch(setMeasureActive(true));
          dispatch(setMeasureDescription(props.description));
        } else {
          dispatch(setMeasureDescription(res.data.message));
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleClickStop = () => {
    axios.put(props.stopUrl)
      .then(res => {
        console.log(res.data);
        dispatch(setMeasureActive(false));
        dispatch(setMeasureDescription(null));
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    // disable HTML5 validation:
    <Box component="form" noValidate>
      
      <Grid container>
        <Grid item xs={12}><Typography variant="body2"><b>Measurement</b></Typography></Grid>
        
        <Grid item xs={5.5}>
          <Grid container>
            <Grid item xs={12}>
              <Tooltip placement="top" title={<Typography fontSize={13}>Operator name or initials. Required</Typography>}>            
                <TextField
                  value={measOperator ?? ""}
                  id="operator"
                  label="Operator"
                  size="small"
                  variant="outlined"
                  margin="none"
                  disabled={measActive}
                  required
                  fullWidth
                  height="37px"
                  onChange={(e) => dispatch(setMeasureOperator(e.target.value))}
                /> 
              </Tooltip>         
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                disabled={measActive || !cartConfigId || !measOperator || !measNotes}
                onClick={e => handleClickStart()}
              >
                Start
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                disabled={!measActive}
                onClick={e => handleClickStop()}
              >
                Stop
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6.5}>
          <Grid container>
            <Grid item xs={11}>
              <Tooltip 
                placement="top" 
                title={<Typography fontSize={13}>Notes about this measurement. Required</Typography>}
              >            
                <TextField
                  value={measNotes ?? ""}
                  id="notes"
                  label="Notes"
                  variant="outlined"
                  margin="none"
                  disabled={measActive}
                  required
                  multiline
                  fullWidth
                  rows={2}
                  onChange={(e) => dispatch(setMeasureNotes(e.target.value))}
                /> 
              </Tooltip>         
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
