import { createSlice } from '@reduxjs/toolkit';

export const WCASlice = createSlice({
  name: 'WCAs',
  initialState: {
    WCAs: [],
    RFSources: [],
    selectedWCA: null,
    selectedRFSource: null,
    requestedWCA: null,
    requestedRFSource: null
  },
  reducers: { 
    setWCAs(state, action) {
      state.WCAs = action.payload;
    },
    setRFSources(state, action) {
      state.RFSources = action.payload;
    },
    setSelectedWCA(state, action) {
      state.selectedWCA = action.payload;
    },
    setSelectedRFSource(state, action) {
      state.selectedRFSource = action.payload;
    },
    requestWCA(state, action) {
      state.requestedWCA = action.payload;
    },
    requestRFSource(state, action) {
      state.requestedRFSource = action.payload;
    }
  }
});

// these are for dispatch:
export const {
  setWCAs,
  setRFSources,
  setSelectedWCA,
  setSelectedRFSource,
  requestWCA, 
  requestRFSource
} = WCASlice.actions

// this is for configureStore:
export default WCASlice.reducer
