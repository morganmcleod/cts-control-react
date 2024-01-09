//This is the store where most application state is kept by Redux

import { configureStore } from '@reduxjs/toolkit';
import LOSliceReducer from './Hardware/LO/LOSlice';
import RFSliceReducer from './Hardware/LO/RFSlice';
import LORefSourceReducer from './Hardware/ReferenceSources/LORefSlice';
import RFRefSourceReducer from './Hardware/ReferenceSources/RFRefSlice';
import CartridgeReducer from './Hardware/Cartridge/CartridgeSlice';
import MotorControlReducer, { positionListener } from './Hardware/BeamScanner/MotorControlSlice';
import MeasureReducer from './Measure/Shared/MeasureSlice';
import BeamScannerReducer from './Measure/BeamScanner/BeamScannerSlice';
import NoiseTempReducer from './Measure/NoiseTemp/NoiseTempSlice';
import StabilityReducer from './Measure/Stability/StabilitySlice';
import CartBiasReducer from './Config/CartBiasSlice';
import WarmIFPlateReducer from './Hardware/WarmIFPlate/WarmIFPlateSlice';
import FEMCReducer from './Hardware/FEMC/FEMCSlice';
import TemperaturesReducer from './Hardware/TemperatureMonitor/TemperaturesSlice';
import WCAReducer from './Config/WCASlice';

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
    NoiseTemp: NoiseTempReducer,
    Stability: StabilityReducer,
    CartBias: CartBiasReducer,
    WarmIFPlate: WarmIFPlateReducer,
    FEMC: FEMCReducer,
    Temperatures: TemperaturesReducer,
    WCAs: WCAReducer
  },

  // Add the positionListener middleware to the store.
  // NOTE: Since this can receive actions with functions inside, it should go before others.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).prepend(positionListener.middleware),
});
