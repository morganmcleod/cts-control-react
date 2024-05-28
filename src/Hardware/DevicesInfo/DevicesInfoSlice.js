import { createSlice } from '@reduxjs/toolkit';

export const DevicesInfoSlice = createSlice({
  name: 'DevicesInfo',
  initialState: {
    mc: {resource_name: '', is_connected: false},
    pna: {resource_name: '', is_connected: false},
    cca: {resource_name: '', is_connected: false},
    chopper: {resource_name: '', is_connected: false},
    femc: {resource_name: '', is_connected: false},
    lo: {resource_name: '', is_connected: false},
    rfsource: {resource_name: '', is_connected: false},
    loref: {resource_name: '', is_connected: false},
    rfref: {resource_name: '', is_connected: false},
    inputswitch: {resource_name: '', is_connected: false},
    yigfilter: {resource_name: '', is_connected: false},
    outputswitch: {resource_name: '', is_connected: false},
    noisesource: {resource_name: '', is_connected: false},
    tempmonitor: {resource_name: '', is_connected: false},
    coldload: {resource_name: '', is_connected: false},
    specanalyzer: {resource_name: '', is_connected: false},
    powermeter: {resource_name: '', is_connected: false}
  },
  reducers: {
    setDeviceInfo(state, action) {
      state[action.payload.name] = {
        resource_name: action.payload.resource_name,
        is_connected: action.payload.is_connected
      }
    }
  }
});

// this is for dispatch:
export const { 
  setDeviceInfo
} = DevicesInfoSlice.actions

// this is for configureStore:
export default DevicesInfoSlice.reducer
