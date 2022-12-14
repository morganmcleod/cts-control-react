//This is the 'slice' of the Redux store related to the Motor Controller
import { createSlice } from '@reduxjs/toolkit';

export const MeasureSlice = createSlice({
  name: 'Measure',
  initialState: {
    active: false,
    description: ""
  },
  reducers: {
    setActive(state, action) {
      state.active = action.payload;
    },
    setDescription(state, action) {
      state.description = action.payload ?? "none";
    }
  }
});

// these are for dispatch:
export const { 
  setActive,
  setDescription
} = MeasureSlice.actions

// this is for configureStore:
export default MeasureSlice.reducer
