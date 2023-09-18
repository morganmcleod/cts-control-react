import { createSlice } from '@reduxjs/toolkit';

const initState = {
  iter: [],
  x: [],
  y: [],
  complete: false
}

export const AppEventSlice = createSlice({
  name: 'AppEvent',
  initialState: {
    sisCurrent: initState,
    rfPower: initState
  },
  reducers: {
    resetSequence(state, action) {
      state[action.payload] = initState;
    },
    addToSequence(state, action) {
      if (action.payload.iter === "complete") {
        state[action.payload.type].complete = true;
      } else {
        state[action.payload.type].iter.push(action.payload.iter);
        state[action.payload.type].x.push(action.payload.x);
        state[action.payload.type].y.push(action.payload.y);
      }
    }
  }
});

// this is for dispatch:
export const { 
  resetSequence,
  addToSequence
 } = AppEventSlice.actions

// this is for configureStore:
export default AppEventSlice.reducer
