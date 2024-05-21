// React and Redux
import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material'
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setDeviceInfo } from './DevicesInfoSlice';

const urls = [
  {name: "mc", caption: "Motor controller", url: "/beamscan/mc/device_info"},
  {name: "pna", caption: "PNA", url: "/beamscan/pna/device_info"},
  {name: "cartassy", caption: "Cartridge assembly", url: "/cartassy/device_info"},
  {name: "cca", caption: "CCA", url: "/cca/device_info"},
  {name: "chopper", caption: "Chopper", url: "/chopper/device_info"},
  {name: "femc", caption: "FEMC", url: "/femc/device_info"},
  {name: "lo", caption: "LO", url: "/lo/device_info"},
  {name: "rfsource", caption: "RF source", url: "/rfsource/device_info"},
  {name: "loref", caption: "LO ref. synth", url: "/loref/device_info"},
  {name: "rfref", caption: "RF ref. synth", url: "/rfref/device_info"},
  {name: "inputswitch", caption: "Input switch", url: "/warmif/inputswitch/device_info"},
  {name: "yigfilter", caption: "YIG filter", url: "/warmif/yigfilter/device_info"},
  {name: "attenuation", caption: "Attenuator", url: "/warmif/attenuation/device_info"},
  {name: "outputswitch", caption: "Output switch", url: "/warmif/outputswitch/device_info"},
  {name: "noisesource", caption: "Noise source PSU", url: "/warmif/noisesource/device_info"},
  {name: "tempmonitor", caption: "Temperature monitor", url: "/tempmonitor/device_info"},
  {name: "coldload", caption: "LN2 fill", url: "/coldload/device_info"},
  {name: "specanalyzer", caption: "Spectrum analyzer", url: "/specanalyzer/device_info"},
  {name: "powermeter", caption: "Power meter", url: "/powermeter/device_info"}
]

export default function DevicesInfo(props) {
  const devicesInfo = useSelector((state) => state.DevicesInfo);
  const dispatch = useDispatch();
  const urlIndex = useRef(0);
  const timer = useRef(0);

  // Only fetch data when mounted
  const isMounted = useRef(false);

  // Load data from REST API
  const fetch = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = 0;
    }
    if (isMounted.current) {
      axios.get(urls[urlIndex.current].url)
        .then(res => {
          dispatch(setDeviceInfo({name: urls[urlIndex.current].name, info: res.data}));
          timer.current = setTimeout(() => {fetch()}, props.interval ?? 500);
          urlIndex.current += 1;
          if (urlIndex.current >= urls.length)
            urlIndex.current = 0;
        })
        .catch(error => {
          console.log(error);
        })
      }
  }, [dispatch, props.interval]);

  // Fetch on first render:
  useEffect(() => {
    isMounted.current = true;
    fetch();
    return () => { isMounted.current = false; };
  }, [fetch]);

  const row = (name, caption, index) => {
    const resource_name = devicesInfo[name] ? devicesInfo[name].resource_name : "--"
    const connected = devicesInfo[name] ? (devicesInfo[name].is_connected ? "OK" : "ERROR") : "--";
    return (
      <React.Fragment key={"devicesInfo" + index}>
        <Grid item xs={2}><Typography variant="body2" paddingTop="4px">{caption}:</Typography></Grid>
        <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{resource_name}</Typography></Grid>
        <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{connected}</Typography></Grid>
        <Grid item xs={4}/>
      </React.Fragment>
    )
  }

  return (
    <Grid container paddingLeft="8px" paddingTop="8px">
      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">Device</Typography></Grid>
      <Grid item xs={3}><Typography variant="body2" paddingTop="2px">Resource</Typography></Grid>
      <Grid item xs={3}><Typography variant="body2" paddingTop="2px">Status</Typography></Grid>
      <Grid item xs={4}/>
      { urls.map((item, index) => row(item.name, item.caption, index)) }
    </Grid>
  )
}