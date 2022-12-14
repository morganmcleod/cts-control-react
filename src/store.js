//This is the store where most application state is kept by Redux

import { configureStore } from '@reduxjs/toolkit';
import LOSliceReducer from './Hardware/LO/LOSlice';
import RFSliceReducer from './Hardware/LO/RFSlice';
import CartridgeReducer from './Hardware/Cartridge/CartridgeSlice';
import MotorControlReducer from './Hardware/BeamScanner/MotorControlSlice';
import MeasureReducer from './Measure/Shared/MeasureSlice';
import BeamScannerReducer from './Measure/BeamScanner/BeamScannerSlice';

//configureStore takes a list of 'reducers'.   
//A reducer is like a state-machine transition: given the current store state and an action, return the new state.
export default configureStore({
  reducer: {
    LO: LOSliceReducer,
    RF: RFSliceReducer,
    Cartridge: CartridgeReducer,
    MotorControl: MotorControlReducer,
    Measure: MeasureReducer,
    BeamScanner: BeamScannerReducer
  }
});
