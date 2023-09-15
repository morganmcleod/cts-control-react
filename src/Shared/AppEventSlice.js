import { createSlice } from '@reduxjs/toolkit';

export const AppEventSlice = createSlice({
  name: 'AppEvent',
  initialState: {
    sisCurrent: [],
    rfPower: []
  },
  reducers: {
    startSequence(state, action) {
      state[action.payload] = []
    },
    addToSequence(state, action) {
      state[action.payload.type].push(action.payload);
    }
  }
});

// this is for dispatch:
export const { 
  startSequence,
  addToSequence
 } = AppEventSlice.actions

// this is for configureStore:
export default AppEventSlice.reducer
