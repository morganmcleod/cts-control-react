import axios from 'axios';
import store from '../store';
import { refreshTimeSeriesList, setDisplayTab } from '../Measure/Stability/StabilitySlice';

import { setCartConfig } from '../Config/CartBiasSlice'
import { requestWCA, requestRFSource } from '../Config/WCASlice';
import { setMeasureActive, setMeasureControlsDisable, setMeasureDescription } from '../Measure/Shared/MeasureSlice';
let global_AppVersion = null;
let global_APIVersion = null;
const cartConfigStorageKey = 'Band6-CTS-CartConfig';
const selectWCAStorageKey = 'Band6-CTS-WCA';
const selectRFSourceStorageKey = 'Band6-CTS-RFSource';

const AppController = {
  setupInitialState: (appVersion) => {
    global_AppVersion = appVersion;
    console.log('App version: ' + global_AppVersion);

    axios.get('/version')
    .then(res => {
      if (res.data.success) {
        global_APIVersion = res.data.gitBranch + ':' + res.data.gitCommit.slice(0, 7);
        console.log('API version: ' + global_APIVersion);
      }
    })
    .catch(error => {
      console.log(error);
    })

    const cartConfig = localStorage.getItem(cartConfigStorageKey);
    if (cartConfig)
      store.dispatch(setCartConfig(Number(cartConfig)));

    const wcaConfig = localStorage.getItem(selectWCAStorageKey);
    if (wcaConfig)
      store.dispatch(requestWCA(Number(wcaConfig)));

    const rfSourceConfig = localStorage.getItem(selectRFSourceStorageKey);
    if (rfSourceConfig)
      store.dispatch(requestRFSource(Number(rfSourceConfig)));

    const connect = () => {
      // connect for API startup event:
      const baseURL = axios.defaults.baseURL.replace('http', 'ws');
      const startup_ws = new WebSocket(baseURL + '/startup_ws');
            
      startup_ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log('startup_ws', msg);
        window.location.reload(false);
      };
      
      startup_ws.onclose = (event) => {
        console.log("startup_ws closed:", event);
        setTimeout(function() {
          connect();
        }, 1000);
      };
      
      startup_ws.onerror = (event) => {
        console.log("startup_ws error: ", event);
        startup_ws.close();
      };
    }
    connect();
  },

  onCartConfigChange: (cartConfig) => {
    if (cartConfig)
      localStorage.setItem(cartConfigStorageKey, cartConfig);
    else
      localStorage.removeItem(cartConfigStorageKey);
  },

  onWCAChange: (wcaConfig) => {
    if (wcaConfig)
      localStorage.setItem(selectWCAStorageKey, wcaConfig);
    else
      localStorage.removeItem(selectWCAStorageKey);
  },

  onRfSourceChange: (rfSourceConfig) => {
    if (rfSourceConfig)
      localStorage.setItem(selectRFSourceStorageKey, rfSourceConfig);
    else
      localStorage.removeItem(selectRFSourceStorageKey);
  },

  getAppVersion: () => {
    return global_AppVersion;
  },

  getAPIVersion: () => {
    return global_APIVersion;
  },

  onMeasureStart: () => {
    store.dispatch(setDisplayTab("0"));
  },

  onTimeSeriesDone: () => {
    store.dispatch(refreshTimeSeriesList());
  },

  onMeasurement: (start, description) => {
    store.dispatch(setMeasureActive(start));
    store.dispatch(setMeasureDescription(description))
    store.dispatch(setMeasureControlsDisable(start));
  }
}
export default AppController;
