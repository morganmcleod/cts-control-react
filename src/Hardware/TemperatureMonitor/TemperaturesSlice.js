//This is the 'slice' of the Redux store related to the cold Cartridge
//A slice defines the reducer and selectors releated to a portion of the store.
//Reducers are state transitions on a part of the store:  given the current state and an action, return the new state.
//Selectors are how components get items out of the store.
import { createSlice } from '@reduxjs/toolkit';

// CartridgeSlice has one object for each LO subsystem
export const TemperaturesSlice = createSlice({
  name: 'Temperatures',
  initialState: {
    tempSensors: {
      temps: [0, 0, 0, 0, 0, 0, 0, 0],
      errors: [0, 0, 0, 0, 0, 0, 0, 0],
      descriptions: ['', '', '', '', '', '', '', '']
    }
  }, 
  reducers: {
    setTempSensors(state, action) {
      state.tempSensors = action.payload;
    }
  }
});
// this is for dispatch:
export const { 
  setTempSensors,  
} = TemperaturesSlice.actions

// this is for configureStore:
export default TemperaturesSlice.reducer