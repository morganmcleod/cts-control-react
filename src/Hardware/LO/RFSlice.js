//This is the 'slice' of the Redux store related to the LO
//A slice defines the reducer and selectors releated to a portion of the store.
//Reducers are state transitions on a part of the store:  given the current state and an action, return the new state.
//Selectors are how components get items out of the store.
import { createSlice } from '@reduxjs/toolkit';
import { LOSliceConfig } from './LOSliceConfig'

export const RFSlice = createSlice({
  ...LOSliceConfig,
  name: 'RF'
});

// these are for dispatch:
export const rfSetAMC = RFSlice.actions.setAMC;
export const rfSetPA = RFSlice.actions.setPA;
export const setInputRF = RFSlice.actions.setInputLOFreq;
export const rfSetPLL = RFSlice.actions.setPLL;
export const rfSetPLLConfig = RFSlice.actions.setPLLConfig;
export const rfSetYTO = RFSlice.actions.setYTO;
export const rfSetYTOCourseTune = RFSlice.actions.setYTOCourseTune;

// this is for configureStore:
export default RFSlice.reducer
