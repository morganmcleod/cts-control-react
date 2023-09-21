//This is the 'slice' of the Redux store related to the warm IF plate
//A slice defines the reducer and selectors releated to a portion of the store.
//Reducers are state transitions on a part of the store:  given the current state and an action, return the new state.
//Selectors are how components get items out of the store.
import { createSlice } from '@reduxjs/toolkit';

export const WarmIFPlateSlice = createSlice({
  name: 'WarmIFPlate',
  initialState: {
    inputSwitch: "",
    yigFilter: 0.0, 
    attenuation: 0
  },
  reducers: {
    setInputSwitch(state, action) {
      state.inputSwitch = action.payload;
    },
    setYIGFilter(state, action) {
      state.yigFilter = action.payload;
    },
    setAttenuation(state, action) {
      state.attenuation = action.payload;
    }
  }
});
// this is for dispatch:
export const { 
  setInputSwitch,
  setYIGFilter,
  setAttenuation
} = WarmIFPlateSlice.actions

// this is for configureStore:
export default WarmIFPlateSlice.reducer
