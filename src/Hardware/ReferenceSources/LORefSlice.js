//This is the 'slice' of the Redux store related to the LO Reference
//A slice defines the reducer and selectors releated to a portion of the store.
//Reducers are state transitions on a part of the store:  given the current state and an action, return the new state.
//Selectors are how components get items out of the store.
import { createSlice } from '@reduxjs/toolkit';
import { RefSourceSliceConfig } from './RefSourceSliceConfig'

export const LORefSlice = createSlice({
  ...RefSourceSliceConfig,
  name: 'LORef'
});

// these are for dispatch:
export const loRefSetFreqGHz = LORefSlice.actions.setFreqGHz;
export const loRefSetAmpDBm = LORefSlice.actions.setAmpDBm;
export const loRefSetEnable = LORefSlice.actions.setEnable;
export const loRefSetStatus = LORefSlice.actions.setStatus;

// this is for configureStore:
export default LORefSlice.reducer
