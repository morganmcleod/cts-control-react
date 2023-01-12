//This is the store where most application state is kept by Redux

import { configureStore, createListenerMiddleware} from '@reduxjs/toolkit';
import LOSliceReducer from './Hardware/LO/LOSlice';
import RFSliceReducer from './Hardware/LO/RFSlice';
import LORefSourceReducer from './Hardware/ReferenceSources/LORefSlice';
import RFRefSourceReducer from './Hardware/ReferenceSources/RFRefSlice';
import CartridgeReducer from './Hardware/Cartridge/CartridgeSlice';
import MotorControlReducer from './Hardware/BeamScanner/MotorControlSlice';
import MeasureReducer from './Measure/Shared/MeasureSlice';
import BeamScannerReducer from './Measure/BeamScanner/BeamScannerSlice';
import CartBiasSlice from './Config/CartBiasSlice';

const listenerMiddleware = createListenerMiddleware();

//configureStore takes a list of 'reducers'.   
//A reducer is like a state-machine transition: given the current store state and an action, return the new state.
export default configureStore({
  reducer: {
    LO: LOSliceReducer,
    RF: RFSliceReducer,
    LORef: LORefSourceReducer,
    RFRef: RFRefSourceReducer,
    Cartridge: CartridgeReducer,
    MotorControl: MotorControlReducer,
    Measure: MeasureReducer,
    BeamScanner: BeamScannerReducer,
    CartBias: CartBiasSlice
  },
  // Add the listener middleware to the store.
  // NOTE: Since this can receive actions with functions inside,
  // it should go before the serializability check middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),  
});

export {listenerMiddleware};
