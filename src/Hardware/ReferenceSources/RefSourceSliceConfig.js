// The LO and RF Reference Source slices of the Redux store have identical configuration and behavior.
// RefSourceSliceConfig is to be included in and used by LORefSlice and RFRefSlice

// LOSlice and RFSlice have one object for each LO subsystem
export const RefSourceSliceConfig = {
  initialState: {
    inputFreq: "",
    freqGHz: "",
    inputAmp: "",
    ampDBm: "",
    enable: false
  },
  reducers: {
    setInputFreq(state, action) {
      state.inputFreq = action.payload
    },
    setFreqGHz(state, action) {
      state.freqGHz = action.payload;
    },
    setInputAmp(state, action) {
      state.inputAmp = action.payload;
    },
    setAmpDBm(state, action) {
      state.ampDBm = action.payload;
    },
    setEnable(state, action) {
      state.enable = action.payload;
    },
    setStatus(state, action) {
      state.freqGHz = action.payload.freqGHz;
      state.ampDBm = action.payload.ampDBm;
      state.enable = action.payload.enable;
    }
  }
};
