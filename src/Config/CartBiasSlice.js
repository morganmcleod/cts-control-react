import { createSlice } from '@reduxjs/toolkit';

export const CartBiasSlice = createSlice({
  name: 'CartBias',
  initialState: {
    cartConfigId: null,
    cartSerialNum: "",
    cartConfigOptions: [],
    refresh: 0,
    configKeys: [
      {
        // pol0
        keyMixerAssy: null,
        keyChip1: null,
        keyChip2: null,
        keyPreamp1: null,
        keyPreamp2: null
      }, {
        // pol1
        keyMixerAssy: null,
        keyChip1: null,
        keyChip2: null,
        keyPreamp1: null,
        keyPreamp2: null
      }
    ],
    mixerParams: [
      {
        // pol0
        sis1: [],   // array of {FreqLo, VD, ID, IMAG}
        sis2: [],
        configChanged: false
      },{
        // pol1
        sis1: [],
        sis2: [],
        configChanged: false
      }
    ],      
    preampParams: [
      {
        // pol0
        lna1: [], // array of {FreqLO, VD1, VD2, VD3, ID1, ID2, ID3}
        lna2: [],
        configChanged: false
      },{
        // pol1
        lna1: [],
        lna2: [],
        configChanged: false
      }
    ]
  },
  reducers: { 
    setCartConfigId(state, action) {
      state.cartConfigId = action.payload;
    },
    setCartSerialNum(state, action) {
      state.cartSerialNum = action.payload;
    },
    setCartConfigOptions(state, action) {
      state.cartConfigOptions = action.payload;
    },
    setRefresh(state, action) {
      state.refresh += 1;
    },    
    setMixerParams(state, action) {
      if (action.payload.sis === 1 || action.payload.sis === 2) {
        const sis = 'sis' + action.payload.sis;
        state.mixerParams[action.payload.pol][sis] = action.payload.data;
        state.mixerParams[action.payload.pol].configChanged = false;
      }
    },
    setMixerParam(state, action) {
      if (action.payload.sis === 1 || action.payload.sis === 2) {
        const sis = 'sis' + action.payload.sis;
        state.mixerParams[action.payload.pol][sis][action.payload.index][action.payload.item] = action.payload.data;
        state.mixerParams[action.payload.pol].configChanged = true;
      }
    },
    setPreampParams(state, action) {
      if (action.payload.lna === 1 || action.payload.lna === 2) {
        const lna = 'lna' + action.payload.lna;
        state.preampParams[action.payload.pol][lna] = action.payload.data;
        state.preampParams[action.payload.pol].configChanged = false;
      }
    },
    setPreampParam(state, action) {
      if (action.payload.lna === 1 || action.payload.lna === 2) {
        const lna = 'lna' + action.payload.lna;
        state.preampParams[action.payload.pol][lna][action.payload.index][action.payload.item] = action.payload.data;
        state.preampParams[action.payload.pol].configChanged = false;
      }
    },
    setConfigKeys(state, action) {
      state.configKeys[action.payload.pol].keyMixerAssy = action.payload.keyMixer;
      state.configKeys[action.payload.pol].keyChip1 = action.payload.keyChip1;
      state.configKeys[action.payload.pol].keyChip2 = action.payload.keyChip2;
      state.configKeys[action.payload.pol].keyPreamp1 = action.payload.keyPreamp1;
      state.configKeys[action.payload.pol].keyPreamp2 = action.payload.keyPreamp2;
    },
    reset(state, action) {
      state.cartConfigId = null;
      state.cartSerialNum = "";
      state.configKeys = [
        {
          // pol0
          keyMixerAssy: null,
          keyChip1: null,
          keyChip2: null,
          keyPreamp1: null,
          keyPreamp2: null
        }, {
          // pol1
          keyMixerAssy: null,
          keyChip1: null,
          keyChip2: null,
          keyPreamp1: null,
          keyPreamp2: null
        }
      ];
      state.mixerParams = [
        {
          // pol0
          sis1: [],   // array of {FreqLo, VD, ID, IMAG}
          sis2: [],
          configChanged: false
        },{
          // pol1
          sis1: [],
          sis2: [],
          configChanged: false
        }
      ];
      state.preampParams = [
        {
          // pol0
          lna1: [], // array of {FreqLO, VD1, VD2, VD3, ID1, ID2, ID3}
          lna2: [],
          configChanged: false
        },{
          // pol1
          lna1: [],
          lna2: [],
          configChanged: false
        }
      ];
    }
  }
});

// these are for dispatch:
export const { 
  setCartConfigId,
  setCartSerialNum,
  setCartConfigOptions,
  setRefresh,
  setMixerParams,
  setMixerParam,
  setPreampParams,
  setPreampParam,
  setConfigKeys,
  reset
} = CartBiasSlice.actions

// this is for configureStore:
export default CartBiasSlice.reducer
