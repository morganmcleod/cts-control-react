//This is the 'slice' of the Redux store related to the Motor Controller
import { createSlice } from '@reduxjs/toolkit';

export const MotorControlSlice = createSlice({
  name: 'MotorControl',
  initialState: {
    position: {x: 0, y:0, pol:0},
    gotoPosition: null,
    xy_speed: 0,
    pol_speed: 0,
    xy_accel: 15,
    pol_accel: 10,
    xy_decel: 15,
    pol_decel: 10,
    trigger_interval: 0.5,
    motor_status: {  
      xPower: false,
      yPower: false,
      polPower: false,
      xMotion: false,
      yMotion: false,
      polMotion: false,
      polTorque: 0
    },
    isConnected: false
  },
  reducers: {
    setXYSpeed(state, action) {
      state.xy_speed = action.payload;
    },
    setPolSpeed(state, action) {
      state.pol_speed = action.payload;
    },
    setIsConnected(state, action) {
      state.isConnected = action.payload;
    },
    setMotorStatus(state, action) {
      state.motor_status = action.payload;
    },
    setPosition(state, action) {
      state.position = action.payload;
    },
    setGotoPosition(state, action) {
      state.gotoPosition = action.payload;
    },
    setNamedParam(state, action) {
      state[action.payload.name] = action.payload.data;
    }
  }
});

// this is for dispatch:
export const { 
  setXYSpeed,
  setPolSpeed,
  setIsConnected,
  setMotorStatus,
  setPosition,
  setGotoPosition,
  setNamedParam
 } = MotorControlSlice.actions

// this is for configureStore:
export default MotorControlSlice.reducer
