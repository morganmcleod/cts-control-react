import { createSlice } from '@reduxjs/toolkit';

export const XYPlotSlice = createSlice({
  name: 'XYPlot',
  initialState: {

    plot: {x: [], y: []}
  },
  reducers: {
    resetPlot(state, action) {
      state.plot = {x: [], y: []}
    },
    addPoint(state, action) {
      state.plot.x.push(action.payload.x);
      state.plot.y.push(action.payload.y)
    }
  }
});

// these are for dispatch:
export const { 
  resetPlot,
  addPoint
} = XYPlotSlice.actions;

// this is for configureStore:
export default XYPlotSlice.reducer
