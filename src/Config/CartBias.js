import React from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Button, Grid } from '@mui/material';
import MixerBias from './MixerBias';
import PreampBias from './PreampBias';
import '../components.css';

// HTTP and store
import { setRefresh } from './CartBiasSlice';

export default function CartBias() {
  const mixerConfigChanged0 = useSelector((state) => state.CartBias.mixerParams[0].configChanged);
  const mixerConfigChanged1 = useSelector((state) => state.CartBias.mixerParams[1].configChanged);
  const preampConfigChanged0 = useSelector((state) => state.CartBias.preampParams[0].configChanged);
  const preampConfigChanged1 = useSelector((state) => state.CartBias.preampParams[1].configChanged);
  const dispatch = useDispatch();

  const onSaveConfig = () => {

  }
  const onCancelConfig = () => {
    dispatch(setRefresh());
  }

  const enableSave = mixerConfigChanged0 || mixerConfigChanged1 || preampConfigChanged0 || preampConfigChanged1;

  return (
    <Grid container>
      <Grid item xs={3.6}></Grid>
      <Grid item xs={2.4}/>
      <Grid item xs={3.6}></Grid>
      <Grid item xs={2.8}>
        <MixerBias pol={0}/>
      </Grid>
      <Grid item xs={0.2}/>
      <Grid item xs={2.8}>
        <MixerBias pol={1}/>
      </Grid>
      <Grid item xs={0.2}/>
      <Grid item xs={2.8}>
        <PreampBias pol={0} lna={1}/>
        <PreampBias pol={0} lna={2}/>
      </Grid>
      <Grid item xs={0.2}/>
      <Grid item xs={2.8}>
        <PreampBias pol={1} lna={1}/>
        <PreampBias pol={1} lna={2}/>
      </Grid>
      <Grid item xs={5.2}/>
      <Grid item xs={6.8}>
        <Button
            variant="contained"
            size="small"
            disabled={!enableSave}
            onClick={() => onSaveConfig()}
          >
            Save
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button
            variant="contained"
            size="small"
            disabled={!enableSave}
            onClick={() => onCancelConfig()}
          >
            Cancel
        </Button>        
      </Grid>
    </Grid>
  );
}