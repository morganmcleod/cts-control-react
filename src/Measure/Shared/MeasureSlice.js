//This is the 'slice' of the Redux store related to the Motor Controller
import { createSlice } from '@reduxjs/toolkit';

export const MeasureSlice = createSlice({
  name: 'Measure',
  initialState: {
    active: false,
    description: "",
    operator: "",
    notes: "",
    measurementStatus: {
      cartTest: null,
      childKey: 0,
      timeStamp: null,
      stepComplete: true,
      allComplete: true,
      message: "",
      error: false
    }
  },
  reducers: {
    setMeasureActive(state, action) {
      state.active = action.payload;
    },
    setMeasureDescription(state, action) {
      state.description = action.payload ?? "None";
    },
    setMeasureOperator(state, action) {
      state.operator = action.payload;
    },
    setMeasureNotes(state, action) {
      state.notes = action.payload;
    },
    setMeasurementStatus(state, action) {
      state.measurementStatus = action.payload;
    }
  }
});

// these are for dispatch:
export const { 
  setMeasureActive,
  setMeasureDescription,
  setMeasureOperator,
  setMeasureNotes,
  setMeasurementStatus
} = MeasureSlice.actions

// this is for configureStore:
export default MeasureSlice.reducer
