//This is the 'slice' of the Redux store related to the Motor Controller
import { createSlice } from '@reduxjs/toolkit';

const implResetPlots = (state) => {
  // clear plots at start of scan
  state.rastersInfo = {key: 0, startIndex: 0, lastIndex: 0};
  state.amplitudePlot = {x: [], y: [], amp: []};
  state.rasterPlot = {x: [], amp: [], phase: []};
}

const implAmplitudePlot = (state, raster) => {
  // Add the raster to the 3D amplitute plot.
  let xStart = raster.startPos.x;
  for (let i = 0; i < raster['amplitude'].length; i++) {
    state.amplitudePlot.x.push(xStart + i * raster.xStep);
    state.amplitudePlot.y.push(raster.startPos.y);
    state.amplitudePlot.amp.push(raster.amplitude[i]);
  }
}

const implRasterPlot = (state, raster) => {
  // Replace the 2D amplitude and phase plots with this raster.
  let xStart = raster.startPos.x;
  state.rasterPlot.x = [];
  for (let i = 0; i < raster['amplitude'].length; i++) {
    state.rasterPlot.x.push(xStart + i * raster.xStep);
  }
  state.rasterPlot.amp = raster.amplitude;
  state.rasterPlot.phase = raster.phase;
}

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
      targetLevel: 0,
      ifAttenuator: 0,
      resolution: 0,
      centersInterval: 0,
      scanBidirectional: false
    },
    scanList: [],
    startStopStep: {
      enable: false,
      isUSB: false,
      start: '',
      stop: '',
      step: '',
      subScansOption: {
        copol0: true,
        xpol0: true,
        copol1: true,
        xpol1: true,
        copol180: true
      }
    },
    rastersInfo: {key: 0, startIndex: 0, lastIndex: 0},
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
    setStartStopStepEnable(state, action) {
      state.startStopStep.enable = action.payload;
    },
    setStartStopStepIsUSB(state, action) {
      state.startStopStep.isUSB = action.payload;
    },
    setStartStopStepSubScans(state, action) {
      state.startStopStep.subScansOption = action.payload;
    },
    setStartStopStep(state, action) {
      state.startStopStep = {
        ...action.payload, 
        enable: state.startStopStep.enable
      }
    },
    resetRasters(state, action) {
      // clear the plots at start of scan
      implResetPlots(state);
    },
    addRaster(state, action) {
      // add a single, presumably latest measured raster
      const raster = action.payload;
      if (raster.key !== state.rastersInfo.key) {
        // if the key has changed, reset and save the new key and indices:
        implResetPlots(state);
        state.rastersInfo = {
          key: raster.key, 
          startIndex: raster.index, 
          lastIndex: raster.index
        };        
      }
      // add it to the 3D amplitude plot:
      implAmplitudePlot(state, raster);
      // replace the 2D amplitude and phase plots:
      implRasterPlot(state, raster);
    },
    addRasters(state, action) {
      // add a collection of rasters
      const rasters = action.payload;
      if (rasters.items.length) {
        //contents not empty...
        if (rasters.items[0].key !== state.rastersInfo.key) {
          // if thekey has changed, reset and ssave the new key and indices:
          implResetPlots(state);
          state.rastersInfo = {
            key: rasters.items[0].key, 
            startIndex: rasters.items[0].index, 
            lastIndex: rasters.items[rasters.items.length - 1].index
          };
        }
        // add them to the 3D amplitude plot.  Don't update the 2D amp/phase plots.
        for (const raster of rasters.items) {
          implAmplitudePlot(state, raster);
        }
      }
    }
  }
});

// these are for dispatch:
export const { 
  setScanStatus,
  setMeasurementSpec,
  setScanList,
  setScanListItem,
  setStartStopStepEnable,
  setStartStopStepIsUSB,
  setStartStopStepSubScans,
  setStartStopStep,
  resetRasters,
  addRaster,
  addRasters
} = BeamScannerSlice.actions

// this is for configureStore:
export default BeamScannerSlice.reducer
