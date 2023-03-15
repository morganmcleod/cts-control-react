//This is the 'slice' of the Redux store related to the LO
//A slice defines the reducer and selectors releated to a portion of the store.
//Reducers are state transitions on a part of the store:  given the current state and an action, return the new state.
//Selectors are how components get items out of the store.
import { createSlice } from '@reduxjs/toolkit';
import { LOSliceConfig } from './LOSliceConfig'

export const LOSlice = createSlice({
  ...LOSliceConfig,
  name: 'LO'
});

// these are for dispatch:
export const loSetAMC = LOSlice.actions.setAMC;
export const loSetPA = LOSlice.actions.setPA;
export const loSetPLL = LOSlice.actions.setPLL;
export const setInputLO = LOSlice.actions.setInputLOFreq;
export const loSetPLLConfig = LOSlice.actions.setPLLConfig;
export const loSetYTO = LOSlice.actions.setYTO;
export const loSetYTOCourseTune = LOSlice.actions.setYTOCourseTune;

// this is for configureStore:
export default LOSlice.reducer

