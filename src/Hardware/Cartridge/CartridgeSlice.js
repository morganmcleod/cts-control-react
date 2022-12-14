//This is the 'slice' of the Redux store related to the cold Cartridge
//A slice defines the reducer and selectors releated to a portion of the store.
//Reducers are state transitions on a part of the store:  given the current state and an action, return the new state.
//Selectors are how components get items out of the store.
import { createSlice } from '@reduxjs/toolkit';

// CartridgeSlice has one object for each LO subsystem
export const CartridgeSlice = createSlice({
  name: 'Cartridge',
  initialState: {
    Temperatures: {
      temp0: 0.0,
      temp1: 0.0,
      temp2: 0.0,
      temp3: 0.0,
      temp4: 0.0,
      temp5: 0.0
    },
    Heater: [
      { // pol0
        enable: false,
        current: 0.0
      },
      { // pol1
        enable: false,
        current: 0.0
      }
    ],
    LED: [
      { // pol0
        enable: false
      },
      { // pol1
        enable: false
      }
    ],
    LNA: [
      [ // pol0, lna1
        {
          key: "LNA01",
          enable: false,
          VD1: 0.0,
          VD2: 0.0,
          VD3: 0.0,
          ID1: 0.0,
          ID2: 0.0,
          ID3: 0.0,
          VG1: 0.0,
          VG2: 0.0,
          VG3: 0.0,
        },
        { // pol0, lna2
          key: "LNA02",
          enable: false,
          VD1: 0.0,
          VD2: 0.0,
          VD3: 0.0,
          ID1: 0.0,
          ID2: 0.0,
          ID3: 0.0,
          VG1: 0.0,
          VG2: 0.0,
          VG3: 0.0,
        }
      ],
      [
        { // pol1, lna1
          key: "LNA11",
          enable: false,
          VD1: 0.0,
          VD2: 0.0,
          VD3: 0.0,
          ID1: 0.0,
          ID2: 0.0,
          ID3: 0.0,
          VG1: 0.0,
          VG2: 0.0,
          VG3: 0.0,
        },
        { // pol1, ln12
          key: "LNA12",
          enable: false,
          VD1: 0.0,
          VD2: 0.0,
          VD3: 0.0,
          ID1: 0.0,
          ID2: 0.0,
          ID3: 0.0,
          VG1: 0.0,
          VG2: 0.0,
          VG3: 0.0,
        }
      ]
    ],
    SIS: [
      [
        { // pol0, sis1
          key: "SIS01",
          Vj: 0.0,
          Ij: 0.0,
          Vmag: 0.0,
          Imag: 0.0,
          averaging: 1
        },        
        { // pol0, sis2
          key: "SIS02",
          Vj: 0.0,
          Ij: 0.0,
          Vmag: 0.0,
          Imag: 0.0,
          averaging: 1
        },
      ],
      [
        { // pol1, sis1
          key: "SIS11",
          Vj: 0.0,
          Ij: 0.0,
          Vmag: 0.0,
          Imag: 0.0,
          averaging: 1
        },
        { // pol1, sis2
          key: "SIS12",
          Vj: 0.0,
          Ij: 0.0,
          Vmag: 0.0,
          Imag: 0.0,
          averaging: 1
        },
      ]
    ]
  },

  // Most reducers here just set the whole subsystem object, as retured from a REST API call:
  reducers: {
    setTemperatures(state, action) {
      state.Temperatures = action.payload;
    },
    setHeaterEnable(state, action) {
      state.Heater[action.payload.pol].enable = action.payload.data;
    },
    setHeaterCurrent(state, action) {
      state.Heater[action.payload.pol].current = action.payload.data;
    },
    setLED(state, action) {
      state.LED[action.payload.pol] = action.payload.data;
    },
    setLNA(state, action) {
      state.LNA[action.payload.pol][action.payload.lna - 1] = action.payload.data;
    },
    setLNAEnable(state, action) {
      state.LNA[action.payload.pol][action.payload.lna - 1].enable = action.payload.data;
    },
    setSIS(state, action) {
      state.SIS[action.payload.pol][action.payload.sis - 1] = action.payload.data;
    }
  }
});
// this is for dispatch:
export const { setTemperatures, setHeaterEnable, setHeaterCurrent, setLED, setLNA, setLNAEnable, setSIS } = CartridgeSlice.actions

// this is for configureStore:
export default CartridgeSlice.reducer
