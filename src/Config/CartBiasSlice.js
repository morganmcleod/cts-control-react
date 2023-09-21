import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  cartConfig: null,
  cartConfigOptions: [],
  refresh: 0,
  saveConfig: 0,
  configKeys: [null, null],
  mixerParams: [
    {
      // pol0
      sis1: [],   // array of {FreqLo, VD, ID, IMAG}
      sis2: [],
      configChanged1: false,
      configChanged2: false
    },{
      // pol1
      sis1: [],
      sis2: [],
      configChanged1: false,
      configChanged2: false
    }
  ],      
  preampParams: [
    {
      // pol0
      lna1: [], // array of {FreqLO, VD1, VD2, VD3, ID1, ID2, ID3}
      lna2: [],
      configChanged1: false,
      configChanged2: false
    },{
      // pol1
      lna1: [],
      lna2: [],
      configChanged1: false,
      configChanged2: false
    }
  ]
}

export const CartBiasSlice = createSlice({
  name: 'CartBias',
  initialState: defaultState,
  reducers: { 
    setCartConfig(state, action) {
      state.cartConfig = action.payload;
    },
    setCartConfigOptions(state, action) {
      state.cartConfigOptions = action.payload;
    },
    setRefresh(state, action) {
      state.refresh += 1;
    },
    setSaveConfig(state, action) {
      state.saveConfig += 1;
    },
    setMixerParams(state, action) {
      if (action.payload.sis === 1 || action.payload.sis === 2) {
        const sis = 'sis' + action.payload.sis;
        const configChanged = 'configChanged' + action.payload.sis;
        state.mixerParams[action.payload.pol][sis] = action.payload.data;
        state.mixerParams[action.payload.pol][configChanged] = false;
      }
    },
    setMixerParam(state, action) {
      if (action.payload.sis === 1 || action.payload.sis === 2) {
        const sis = 'sis' + action.payload.sis;
        const configChanged = 'configChanged' + action.payload.sis;
        state.mixerParams[action.payload.pol][sis][action.payload.index][action.payload.item] = action.payload.data;
        state.mixerParams[action.payload.pol][configChanged] = true;
      }
    },
    setPreampParams(state, action) {
      if (action.payload.lna === 1 || action.payload.lna === 2) {
        const lna = 'lna' + action.payload.lna;
        const configChanged = 'configChanged' + action.payload.lna;
        state.preampParams[action.payload.pol][lna] = action.payload.data;
        state.preampParams[action.payload.pol][configChanged] = false;
      }
    },
    setPreampParam(state, action) {
      if (action.payload.lna === 1 || action.payload.lna === 2) {
        const lna = 'lna' + action.payload.lna;
        const configChanged = 'configChanged' + action.payload.lna;
        state.preampParams[action.payload.pol][lna][action.payload.index][action.payload.item] = action.payload.data;
        state.preampParams[action.payload.pol][configChanged] = true;
      }
    },
    setConfigKeys(state, action) {
      state.configKeys[action.payload.pol] = action.payload;
    },
    resetConfig(state, action) {
      state.cartConfig = null;
      state.configKeys = [null, null];
      state.mixerParams = defaultState.mixerParams;
      state.preampParams = defaultState.preampParams;
    }
  }
});

// these are for dispatch:
export const { 
  setCartConfig,
  setCartConfigOptions,
  setRefresh,
  setSaveConfig,
  setMixerParams,
  setMixerParam,
  setPreampParams,
  setPreampParam,
  setConfigKeys,
  resetConfig
} = CartBiasSlice.actions

// this is for configureStore:
export default CartBiasSlice.reducer
