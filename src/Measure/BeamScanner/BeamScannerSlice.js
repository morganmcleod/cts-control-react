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
      scanEnd: {x:0, y:0},
      scanAngles: [0, 0],
      levelAngles: [0, 0],
      targetLevel: 0,
      resolution: 0,
      centersInterval: 0,
    },
    scanList: [],
    rasters: [],
    amplitudePlot: {x: [], y: [], amp: []},
    rasterPlot: {x: [], amp: [], phase: []}
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
    },
    resetRasters(state, action) {
      state.rasters = [];
      state.amplitudePlot = {x: [], y: [], amp: []};
      state.rasterPlot = {x: [], amp: [], phase: []};      
    },
    addRaster(state, action) {
      state.rasters.push(action.payload)
      const raster = action.payload
      let xStart = raster['startPos']['x'];
      state.rasterPlot = {x: [], amp: [], phase: []};
      for (let i = 0; i < raster['amplitude'].length; i++) {
        state.amplitudePlot.x.push(xStart + i * raster.xStep);
        state.amplitudePlot.y.push(raster['startPos']['y']);
        state.amplitudePlot.amp.push(raster['amplitude'][i]);
        state.rasterPlot.x.push(xStart + i * raster.xStep);
      }
      state.rasterPlot.amp = raster['amplitude'];
      state.rasterPlot.phase = raster['phase'];
    }
  }
});

// these are for dispatch:
export const { 
  setScanStatus,
  setMeasurementSpec,
  setScanList,
  setScanListItem,
  resetRasters,
  addRaster
} = BeamScannerSlice.actions

// this is for configureStore:
export default BeamScannerSlice.reducer
