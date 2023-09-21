//This is the 'slice' of the Redux store related to the cold Cartridge
//A slice defines the reducer and selectors releated to a portion of the store.
//Reducers are state transitions on a part of the store:  given the current state and an action, return the new state.
//Selectors are how components get items out of the store.
import { createSlice } from '@reduxjs/toolkit';

export const FEMCSlice = createSlice({
  name: 'FEMC',
  initialState: {
    femcVersion: "",
    ambsiVersion: "",
    esnList: [],
  },
  reducers: {
    setFemcVersion(state, action) {
      state.femcVersion = action.payload;
    },
    setAmbsiVersion(state, action) {
      state.ambsiVersion = action.payload;
    },
    setEsnList(state, action) {
      state.esnList = action.payload;
    }
  }
});

// this is for dispatch:
export const { 
  setFemcVersion,
  setAmbsiVersion,
  setEsnList
} = FEMCSlice.actions

// this is for configureStore:
export default FEMCSlice.reducer
