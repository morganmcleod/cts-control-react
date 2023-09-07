//This is the 'slice' of the Redux store related to the RF Reference
//A slice defines the reducer and selectors releated to a portion of the store.
//Reducers are state transitions on a part of the store:  given the current state and an action, return the new state.
//Selectors are how components get items out of the store.
import { createSlice } from '@reduxjs/toolkit';
import { RefSourceSliceConfig } from './RefSourceSliceConfig'

export const RFRefSlice = createSlice({
  ...RefSourceSliceConfig,
  name: 'RFRef'
});

// these are for dispatch:
export const rfSetInputFreq = RFRefSlice.actions.setInputFreq;
export const rfRefSetFreqGHz = RFRefSlice.actions.setFreqGHz;
export const rfRefSetInputAmp = RFRefSlice.actions.setInputAmp;
export const rfRefSetAmpDBm = RFRefSlice.actions.setAmpDBm;
export const rfRefSetEnable = RFRefSlice.actions.setEnable;
export const rfRefSetStatus = RFRefSlice.actions.setStatus;

// this is for configureStore:
export default RFRefSlice.reducer
