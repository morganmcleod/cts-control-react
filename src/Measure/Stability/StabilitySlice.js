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

export const StabilitySlice = createSlice({
  name: 'Stability',
  initialState: {
    stabilitySettings: {
      sampleRate: 0,
      sensorAmbient: 0,
      attenuateIF: 0,
      targetLevel: 0,
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
    selectedTimeSeriesId: null,
    timeSeriesList: [],
    refreshTimeSeriesList: 0,
    mode: 'amplitude',
    displayTab: "0"
  },
  reducers: {
    setStabilitySettings(state, action) {
      state.stabilitySettings = action.payload;
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
    refreshTimeSeriesList(state, action) {
      state.refreshTimeSeriesList += 1;
    },
    selectTimeSeriesId(state, action) {
      state.selectedTimeSeriesId = action.payload;
    },
    setMode(state, action) {
      state.mode = action.payload;
    },
    setDisplayTab(state, action) {
      state.displayTab = action.payload;
    }
  }
});

// these are for dispatch:
export const { 
  setStabilitySettings,
  resetTimeSeries,
  addTimeSeries,
  setTimeSeriesList,
  refreshTimeSeriesList,
  selectTimeSeriesId,
  setMode,
  setDisplayTab
} = StabilitySlice.actions

// this is for configureStore:
export default StabilitySlice.reducer
