//This is the 'slice' of the Redux store related to the Motor Controller
import { createSlice } from '@reduxjs/toolkit';

export const NoiseTempSlice = createSlice({
  name: 'NoiseTemp',
  initialState: {
    testSteps: {
      zeroPM: false,
      warmIF: false,
      noiseTemp: false,
      imageReject: false,
      loWGIntegrity: false
    },
    commonSettings: {
      chopperMode: "SPIN",
      backEndMode: "IF_PLATE",
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
      polarization: 'BOTH',
      sideband: 'BOTH'
    },
    loWgSettings: {
      loStart: 0,
      loStop: 0,
      loStep: 0,
      ifStart: 0,
      ifStop: 0,
      ifStep: 0,
      polarization: 'BOTH',
      sideband: 'BOTH'
    },
    yFactorState: {
      atten: 22,
      yigFilter: 6.0,
      input: 0,
      started: false
    },
    coldLoad: {
      fillMode: 0,
      fillState: 0,
      fillModeText: "",
      fillStateText: "",
      level: 0
    },
    chopper: {
      state: -1
    },
    warmIFPlot: {
      x: [], 
      pHot: [],
      pCold: []
    },
    yFactorPlot: {
      x: [],
      y: [],
      TRx: []
    },
    chopperPowerInput: null,
    chopperPowerPlot: {
      x: [],
      chopperState: [],
      power: []
    },
    rawDataRecords: null
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
    },
    resetYFactorPlot(state, action) {
      state.yFactorPlot = {
        x: [],
        y: [],
        TRx: []
      };
    },
    addYFactorData(state, action) {
      state.yFactorPlot.x.push(state.yFactorPlot.x.length);
      state.yFactorPlot.y.push(action.payload.Y);
      state.yFactorPlot.TRx.push(action.payload.TRx);      
    },
    resetChopperPowerPlot(state, action) {
      state.chopperPowerPlot = {
        x: [],
        chopperState: [],
        power: []
      };
    },
    addChopperPowerRecords(state, action) {
      for (const rec of action.payload) {
        state.chopperPowerInput = rec.input;
        state.chopperPowerPlot.x.push(state.chopperPowerPlot.x.length);
        state.chopperPowerPlot.chopperState.push(2 - rec.chopperState);
        state.chopperPowerPlot.power.push(10 * Math.log10(rec.power * 1000));
      }
    },
    setYFactorAtten(state, action) {
      state.yFactorState.atten = action.payload;
    },
    setYFactorYIGFilter(state, action) {
      state.yFactorState.yigFilter = action.payload;
    },
    setYFactorInput(state, action) {
      state.yFactorState.input = action.payload;    
    },
    setYFactorStarted(state, action) {
      state.yFactorState.started = action.payload;
    },
    setColdLoadState(state, action) {
      state.coldLoad = action.payload;
      if (state.coldLoad.level > 100)
        state.coldLoad.level = '> 100'
      else if (state.coldLoad.level < 0)
        state.coldLoad.level = '< 0'
      else
        state.coldLoad.level = state.coldLoad.level.toFixed(1);
    },
    setChopperState(state, action) {
      state.chopper.state = action.payload
    },
    setRawDataRecords(state, action) {
      state.rawDataRecords = action.payload;
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
  addWarmIFData,
  resetYFactorPlot,
  addYFactorData,
  resetChopperPowerPlot,
  addChopperPowerRecords,
  setYFactorAtten,
  setYFactorYIGFilter,
  setYFactorInput,
  setYFactorStarted,
  setColdLoadState, 
  setChopperState,
  setRawDataRecords
} = NoiseTempSlice.actions

// this is for configureStore:
export default NoiseTempSlice.reducer
