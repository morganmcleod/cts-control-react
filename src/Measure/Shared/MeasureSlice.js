//This is the 'slice' of the Redux store related to the Motor Controller
import { createSlice } from '@reduxjs/toolkit';

export const MeasureSlice = createSlice({
  name: 'Measure',
  initialState: {
    active: false,
    description: "",
    operator: "",
    notes: "",
    testTypeId: null,   // allows the Stability tab to select either amlitude or phase
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
    setTestTypeId(state, action) {
      state.testTypeId = action.payload;
    },
    setMeasurementStatus(state, action) {
      state.measurementStatus = action.payload;
    }
  }
});

export const detectChange = (status, newStatus) => {
  if (status.cartTest !== newStatus.cartTest)
    return true;
  if (status.timeStamp !== newStatus.timeStamp)
    return true;
  if (status.stepComplete !== newStatus.stepComplete)
    return true;
  if (status.allComplete !== newStatus.allComplete)
    return true;
  if (status.message !== newStatus.message)
    return true;
  if (status.error !== newStatus.error)
    return true;
  return false;
}

// these are for dispatch:
export const { 
  setMeasureActive,
  setMeasureDescription,
  setMeasureOperator,
  setMeasureNotes,
  setTestTypeId,
  setMeasurementStatus
} = MeasureSlice.actions

// this is for configureStore:
export default MeasureSlice.reducer
