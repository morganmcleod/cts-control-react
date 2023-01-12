// React and Redux
import React from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material';
import InlineEdit from '../Shared/InlineEdit';
import '../components.css'

// HTTP and store
import { setMixerParam } from './CartBiasSlice';

export default function MixerParam(props) {
  // Redux store interfaces
  const sis = 'sis' + props.sis
  const params = useSelector((state) => state.CartBias.mixerParams[props.pol][sis]); 
  const row = params ? params[props.index] : null;
  const value = row ? row[props.item] : null;
  const dispatch = useDispatch();

  const setValue = (value) => {
    dispatch(setMixerParam({
      pol: props.pol,
      sis: props.sis,
      index: props.index,
      item: props.item,
      data: Number(value)
    }))
  }

  return (
    <>
      {props.item === 'FreqLO' && (
        <Grid item xs={props.xsWidth} paddingTop="4px">
          <Typography variant="body2">{value ?? ""}</Typography>
        </Grid>
      )}
      {props.item !== 'FreqLO' && (
        <Grid item xs={props.xsWidth}>
          <InlineEdit 
            value = {value ?? ""}
            setValue = {setValue}
            numeric
          ></InlineEdit>
        </Grid>
      )}
    </>
  );
}
