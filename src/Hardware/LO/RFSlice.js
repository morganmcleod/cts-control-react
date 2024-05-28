//This is the 'slice' of the Redux store related to the LO
//A slice defines the reducer and selectors releated to a portion of the store.
//Reducers are state transitions on a part of the store:  given the current state and an action, return the new state.
//Selectors are how components get items out of the store.
import { createSlice } from '@reduxjs/toolkit';
import { LOSliceInitialState, LOSliceReducers } from './LOSliceConfig'


export const RFSlice = createSlice({
  name: 'RF',
  initialState: {
    ...LOSliceInitialState,
    rfPowerGraph: {
      x: [],
      y: []
    }  
  },
  reducers: {
    ...LOSliceReducers,
    resetRfPowerGraph(state, action) {
      state.rfPowerGraph = {x: [], y: [], updated: null};
    },
    appendRfPowerGraph(state, action) {
      const len = state.rfPowerGraph.x.length;
      const iter = (len > 0 ? state.rfPowerGraph.x[len - 1] : 0) + 1;
      state.rfPowerGraph.x.push(iter);
      state.rfPowerGraph.y.push(action.payload);
    }
  }
});

// these are for dispatch:
export const rfSetAMC = RFSlice.actions.setAMC;
export const rfSetPA = RFSlice.actions.setPA;
export const rfSetPAInputs = RFSlice.actions.setPAInputs;
export const rfSetPAInputsSendNow = RFSlice.actions.setPAInputsSendNow;
export const setInputRF = RFSlice.actions.setInputLOFreq;
export const rfSetYTOLowInput = RFSlice.actions.setYTOLowInput
export const rfSetYTOHighInput = RFSlice.actions.setYTOHighInput
export const rfSetYTOSendNow = RFSlice.actions.setYTOSendNow
export const rfSetPLL = RFSlice.actions.setPLL;
export const rfSetLockInfo = RFSlice.actions.setLockInfo
export const rfSetPLLConfig = RFSlice.actions.setPLLConfig;
export const rfSetYTO = RFSlice.actions.setYTO;
export const rfSetYTOCourseTune = RFSlice.actions.setYTOCourseTune;
export const resetRfPowerGraph = RFSlice.actions.resetRfPowerGraph;
export const appendRfPowerGraph = RFSlice.actions.appendRfPowerGraph;

// this is for configureStore:
export default RFSlice.reducer
