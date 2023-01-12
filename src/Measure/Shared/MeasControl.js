// React and Redux
import React from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ToolTip from '@mui/material/Tooltip';
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
  const cartConfigId = useSelector((state) => state.CartBias.cartConfigId);
  const cartSerialNum = useSelector((state) => state.CartBias.cartSerialNum);
  const dispatch = useDispatch();

  const handleClickStart = () => {
    const params = {
      serialNum: cartSerialNum,
      configId: cartConfigId,
      operator: measOperator,
      description: measNotes
    };
    axios.put(props.startUrl, params)
      .then(res => {
        console.log(res.data);
        if (res.data.success) {
          dispatch(setMeasureActive(true));
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
    <Grid container>
      <Grid item xs={12}><Typography variant="body2"><b>Measurement</b></Typography></Grid>
      
      <Grid item xs={5.5}>
        <Grid container>
          <Grid item xs={12}>
            <ToolTip placement="top" title={<Typography fontSize={13}>Operator name or initials. Required</Typography>}>            
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
            </ToolTip>         
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            disabled={measActive || !cartConfigId || !measOperator || !measNotes}
            onClick={e => handleClickStart()}
          >
            Start
          </Button>
          &nbsp;
          <Button
            variant="contained"
            disabled={!measActive}
            onClick={e => handleClickStop()}
          >
            Stop
          </Button>
        </Grid>
      </Grid>

      <Grid item xs={6.5}>
        <Grid container>
          <Grid item xs={11}>
            <ToolTip 
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
            </ToolTip>         
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
