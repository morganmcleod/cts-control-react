// React and Redux
import React from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material';
import InlineEdit from '../Shared/InlineEdit';
import '../components.css'

// HTTP and store
import { setPreampParam } from './CartBiasSlice';

export default function PreampParam(props) {
  // Redux store interfaces
  const lna = 'lna' + props.lna
  const params = useSelector((state) => state.CartBias.preampParams[props.pol][lna]); 
  const row = params ? params[props.index] : null;
  const value = row ? row[props.item] : null;
  const dispatch = useDispatch();

  const setValue = (value) => {
    dispatch(setPreampParam({
      pol: props.pol,
      lna: props.lna,
      stage: props.stage,
      index: props.index,
      item: props.item,
      data: Number(value)
    }))
  }

  return (
    <>
      {props.item === 'FreqLO' && (
        <Grid item xs={props.xsWidth} paddingTop="4px"><Typography variant="body2">
          {value ?? ""}
        </Typography></Grid>
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
