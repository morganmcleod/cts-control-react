// The LO and RF Source slices of the Redux store have identical configuration and behavior.
// loSliceConfig is to be included in and used by LOSlice and RFSlice

const calculateYTOFreq = (lowGHz, highGHz, courseTune) => {
  // helper function used in reducers below
  if (lowGHz > 0 && highGHz > lowGHz) {
    return lowGHz + ((courseTune / 4095) * (highGHz - lowGHz));        
  }
  return 0.0;
}

// LOSlice and RFSlice have one object for each LO subsystem
export const LOSliceConfig = {
  initialState: {
    AMC: {
      VDA: null,
      IDA: null,
      VGA: null,
      VDB: null,
      IDB: null,
      VGB: null,
      VDE: null,
      IDE: null,
      VGE: null,
      multDCounts: null,
      multDCurrent: null,
      supply5V: null
    },
    PA: {
      VDp0: 0.0,
      VDp1: 0.0,
      IDp0: 0.0,
      IDp1: 0.0,
      VGp0: 0.0,
      VGp1: 0.0,
      supply3V: 0.0, 
      supply5V: 0.0
    },
    inputLOFreq: "",
    PLL: {
      lockDetectBit: false,
      unlockDetected: false,
      refTP: 0.0,
      IFTP: 0.0,
      isLocked: false,
      loFreqGHz: 0.0,
      courseTune: 0,
      corrV: 0.0, 
      temperature: 0,
      nullPLL: false
    },
    PLLConfig: {
      loopBW: null,
      lockSB: null,
      warmMult: null,
      coldMult: null
    },
    YTO: {
      lowGHz: 0.0,
      highGHz: 0.0,
      courseTune: 0,
      ytoFreqGHz: 0.0
    },
    LO: {}
  },
  reducers: {
    // Most reducers here just set the whole subsystem object, as retured from a REST API call:
    setAMC(state, action) {
      state.AMC = action.payload;
    },
    setPA(state, action) {
      state.PA = action.payload;
    },
    setInputLOFreq(state, action) {
      state.inputLOFreq = action.payload;
    },
    setPLL(state, action) {
      state.PLL = action.payload;
      // Also update the YTO course tuning and frequency:
      state.YTO.courseTune = action.payload.courseTune;
      const yto = state.YTO;
      let freq = calculateYTOFreq(yto.lowGHz, yto.highGHz, yto.courseTune);
      state.YTO = { ...state.YTO, ytoFreqGHz: freq }
    },
    setLockInfo(state, action) {
      state.PLL = {...state.PLL, ...action.payload }
    },
    setPLLConfig(state, action) {
      state.PLLConfig = action.payload;
    },
    setYTO(state, action) {
      state.YTO = action.payload;
    },
    setYTOCourseTune(state, action) {
      state.YTO.courseTune = action.payload;
      const yto = state.YTO;
      let freq = calculateYTOFreq(yto.lowGHz, yto.highGHz, yto.courseTune);
      state.YTO = { ...state.YTO, ytoFreqGHz: freq }
    }  
  }
};
