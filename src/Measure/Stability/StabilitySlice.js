//This is the 'slice' of the Redux store related to the Motor Controller
import { createSlice } from '@reduxjs/toolkit';

const defaultTimeSeries = {
  tsId: 0,
  dataSeries: [],
  temperatures1: [],
  timeStamps: [],
  tau0Seconds: null,
  startTime: null
};

export const AmpStabilitySlice = createSlice({
  name: 'Stability',
  initialState: {
    ampStabilitySettings: {
      sampleRate: 0,
      sensorAmbient: 0,
      delayAfterLock: 0,
      measureDuration: 0,
      measurePol0: false,
      measurePol1: false,
      measureUSB: false,
      measureLSB: false,
      loStart: 0,
      loStop: 0,
      loStep: 0
    },
    timeSeries: {...defaultTimeSeries},
    timeSeriesList: [],
    selectedTimeSeries: null,
    stabilityPlot: null
  },
  reducers: {
    setAmpStabilitySettings(state, action) {
      state.ampStabilitySettings = action.payload;
    },
    resetTimeSeries(state, action) {
      state.timeSeries = {...defaultTimeSeries};
    },
    addTimeSeries(state, action) {
      if (action.payload.tsId)
        state.timeSeries.tsId = action.payload.tsId;
      state.timeSeries.dataSeries = state.timeSeries.dataSeries.concat(action.payload.dataSeries);
      if (action.payload.temperatures1) {
        state.timeSeries.temperatures1 = state.timeSeries.temperatures1.concat(action.payload.temperatures1);
      }
      if (action.payload.timeStamps) {
        state.timeSeries.timeStamps = state.timeSeries.timeStamps.concat(action.payload.timeStamps);
      }
    },
    setTimeSeriesList(state, action) {
      state.timeSeriesList = action.payload;
    },
    selectTimeSeries(state, action) {
      state.selectedTimeSeries = action.payload;
    },
    setStabilityPlot(state, action) {
      state.stabilityPlot = action.payload;
    }
  }
});

// these are for dispatch:
export const { 
  setAmpStabilitySettings,
  resetTimeSeries,
  addTimeSeries,
  setTimeSeriesList,
  selectTimeSeries,
  setStabilityPlot
} = AmpStabilitySlice.actions

// this is for configureStore:
export default AmpStabilitySlice.reducer
