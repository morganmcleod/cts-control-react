//This is the 'slice' of the Redux store related to the Motor Controller
import { createSlice } from '@reduxjs/toolkit';

export const BeamScannerSlice = createSlice({
  name: 'BeamScanner',
  initialState: {
    scanStatus: {
      key: 0,
      fkBeamPatterns: 0,
      fkCartTest: 0,
      amplitude: 0,
      phase: 0,
      timeStamp: "",
      scanComplete: false,
      measurementComplete: true,
      activeScan: null,
      activeSubScan: null,
      message: ""
    },
    measurementSpec: {
      beamCenter: {x:0, y:0},
      scanStart: {x:0, y:0},
      scanStop: {x:0, y:0},
      scanAngles: [0, 0],
      levelAngles: [0, 0],
      targetLevel: 0,
      resolution: 0,
      centersInterval: 0,
    },
    scanList: []
  },
  reducers: {
    setScanStatus(state, action) {
      state.scanStatus = action.payload;
    },
    setMeasurementSpec(state, action) {
      state.measurementSpec = action.payload;
    },
    setScanList(state, action) {
      state.scanList = action.payload;
    },
    setScanListItem(state, action) {
      const index = action.payload.index;
      if (index >= 0 && index < state.scanList.length) {
        state.scanList[index] = action.payload.data;
      }
    }
  }
});

// these are for dispatch:
export const { 
  setScanStatus,
  setMeasurementSpec,
  setScanList,
  setScanListItem
} = BeamScannerSlice.actions

// this is for configureStore:
export default BeamScannerSlice.reducer
