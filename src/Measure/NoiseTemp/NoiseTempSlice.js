//This is the 'slice' of the Redux store related to the Motor Controller
import { createSlice } from '@reduxjs/toolkit';

export const NoiseTempSlice = createSlice({
  name: 'NoiseTemp',
  initialState: {
    testSteps: {
      warmIF: false,
      noiseTemp: false,
      imageReject: false,
      loWGIntegrity: false
    },
    commonSettings: {
      targetPHot: 0,
      targetSidebandPower: 0,
      tColdEff: 0,
      chopperSpeed: 0,
      sampleRate: 0,
      sensorAmbient: 0,
      powerMeterConfig: {
        minS: 0,
        maxS: 0,
        stdErr: 0,
        timeout: 0
      },
    },
    warmIFSettings: {
      attenStart: 0,
      attenStop: 0,
      attenStep: 0,
      ifStart: 0,
      ifStop: 0,
      ifStep: 0,
      sensorIfHot: 0,
      sensorIfCold: 0,
      diodeVoltage: 0,
      diodeCurrentLimit: 0,
      diodeEnr: 0
    },
    noiseTempSettings: {
      loStart: 0,
      loStop: 0,
      loStep: 0,
      ifStart: 0,
      ifStop: 0,
      ifStep: 0,
    },
    loWgSettings: {
      loStart: 0,
      loStop: 0,
      loStep: 0,
      ifStart: 0,
      ifStop: 0,
      ifStep: 0,
    },
    warmIFPlot: {
      x: [], 
      pHot: [],
      pCold: []
    }
  },
  reducers: {
    setTestSteps(state, action) {
      state.testSteps = action.payload;
    },
    setCommonSettings(state, action) {
      state.commonSettings = action.payload;
    },
    setWarmIFSettings(state, action) {
      state.warmIFSettings = action.payload;
    },
    setNoiseTempSettings(state, action) {
      state.noiseTempSettings = action.payload;
    },
    setLoWgSettings(state, action) {
      state.loWgSettings = action.payload;
    },
    resetWarmIFPlot(state, action) {
      state.warmIFPlot = {
        x: [], 
        pHot: [],
        pCold: []
      };
    },
    addWarmIFData(state, action) {
      state.warmIFPlot.x.push(action.payload.freqYig);
      state.warmIFPlot.pHot.push(action.payload.pHot);
      state.warmIFPlot.pCold.push(action.payload.pCold);      
    }
  }
});

// these are for dispatch:
export const { 
  setTestSteps,
  setCommonSettings,
  setWarmIFSettings,
  setNoiseTempSettings,
  setLoWgSettings,
  resetWarmIFPlot,
  addWarmIFData
} = NoiseTempSlice.actions

// this is for configureStore:
export default NoiseTempSlice.reducer
