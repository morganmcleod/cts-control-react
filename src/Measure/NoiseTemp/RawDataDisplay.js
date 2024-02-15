import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { setRawDataRecords } from './NoiseTempSlice';
import axios from "axios";

// UI components and style
import { 
  Grid,
  Typography,
} from '@mui/material';
import '../../components.css'

export default function RawDataDisplay(props) {
  const [noiseTemp00, setNoiseTemp00] = useState(null);
  const [noiseTemp01, setNoiseTemp01] = useState(null);
  const [noiseTemp10, setNoiseTemp10] = useState(null);
  const [noiseTemp11, setNoiseTemp11] = useState(null);
  const rawDataRecords = useSelector((state) => state.NoiseTemp.rawDataRecords);
  const dispatch = useDispatch();
  
  const options = {
    retryOnError: true, 
    shouldReconnect: (closeEvent) => true,
    ignoreExtensions: true
  };
  const URL = axios.defaults.baseURL.replace('http', 'ws') + "/noisetemp/rawnoisetemp_ws";
  const { 
    readyState: ready,
    lastMessage: message 
  } = useWebSocket(URL, options);

  const calcNoiseTemp = (pHot, pCold, tAmb, tCold) => {
    if (pHot && pCold && tAmb && tCold) {
      const Y = 10 ** ((pHot - pCold) / 10);
      return ((tAmb - tCold * Y) / (Y - 1)).toFixed(2) + ' K';
    }
    return null;
  }

  useEffect(() => {
    // websocket handler for raw data message
    if (ready === ReadyState.OPEN) {
      if (message !== null) {
        try {
          const data = JSON.parse(message.data);
          dispatch(setRawDataRecords(data));
          setNoiseTemp00(calcNoiseTemp(data[0].Phot_USB, data[0].Pcold_USB, data[0].TRF_Hot, data[0].TColdLoad));
          setNoiseTemp01(calcNoiseTemp(data[0].Phot_LSB, data[0].Pcold_LSB, data[0].TRF_Hot, data[0].TColdLoad));
          setNoiseTemp10(calcNoiseTemp(data[1].Phot_USB, data[1].Pcold_USB, data[1].TRF_Hot, data[1].TColdLoad));
          setNoiseTemp11(calcNoiseTemp(data[1].Phot_LSB, data[1].Pcold_LSB, data[1].TRF_Hot, data[1].TColdLoad));
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [ready, message, dispatch]);

  const dataList = [
    'Phot_USB',
    'Pcold_USB',
    'Phot_LSB',
    'Pcold_LSB',
    'PwrUSB_SrcUSB',
    'PwrLSB_SrcUSB',
    'PwrUSB_SrcLSB',
    'PwrLSB_SrcLSB'
  ];

  const dataListRow = (item, index) => {
    let t0 = '';
    let t1 = '';
    if (rawDataRecords) {
      t0 = rawDataRecords[0][item];
      if (t0 === 0) {
        t0 = '';
      } else {
        t0 = t0.toFixed(2);
        t0 += ' dBm'
      }
      t1 = rawDataRecords[1][item];
      if (t1 === 0) {
        t1 = '';
      } else {
        t1 = t1.toFixed(2);
        t1 += ' dBm'
      }
      return (
        <React.Fragment key={item + index}>
          <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)"}}>
            <Typography variant="body2" paddingTop="2px">{item}:</Typography>
          </Grid>
          <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)" }}>
            <Typography variant="body2" fontWeight="bold" paddingTop="2px">{t0}</Typography>
          </Grid>
          <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)" }}>
            <Typography variant="body2" fontWeight="bold" paddingTop="2px">{t1}</Typography>
          </Grid>
          <Grid item xs={3}/>
        </React.Fragment>
      );
    }
  }

  const FreqLO = rawDataRecords ? rawDataRecords[0].FreqLO.toFixed(2) + ' GHz' : null;
  const CenterIF = rawDataRecords ? rawDataRecords[0].CenterIF.toFixed(2) + ' GHz' : null;
  const TColdLoad = rawDataRecords ? rawDataRecords[0].TColdLoad.toFixed(2) + ' K' : null;
  const TRF_Hot = rawDataRecords ? rawDataRecords[0].TRF_Hot.toFixed(2) + ' K' : null;
  const IF_Attn = rawDataRecords ? rawDataRecords[0].IF_Attn.toFixed(2) + ' dB' : null;

  return (
    <Grid container paddingTop="15px">
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)"}}>
        <Typography variant="body2" paddingTop="2px">FreqLO:</Typography>
      </Grid>
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)" }}>
        <Typography variant="body2" fontWeight="bold" paddingTop="2px">{FreqLO}</Typography>
      </Grid>
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)"}}>
        <Typography variant="body2" paddingTop="2px">FreqIF:</Typography>
      </Grid>
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)" }}>
        <Typography variant="body2" fontWeight="bold" paddingTop="2px">{CenterIF}</Typography>
      </Grid>
          
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)"}}>
        <Typography variant="body2" paddingTop="2px">TColdLoad:</Typography>
      </Grid>
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)" }}>
        <Typography variant="body2" fontWeight="bold" paddingTop="2px">{TColdLoad}</Typography>
      </Grid>
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)"}}>
        <Typography variant="body2" paddingTop="2px">Ambient:</Typography>
      </Grid>
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)" }}>
        <Typography variant="body2" fontWeight="bold" paddingTop="2px">{TRF_Hot}</Typography>
      </Grid>
      
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)"}}>
        <Typography variant="body2" paddingTop="2px">IF_Attn:</Typography>
      </Grid>
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)" }}>
        <Typography variant="body2" fontWeight="bold" paddingTop="2px">{IF_Attn}</Typography>
      </Grid>
      <Grid item xs={6} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)"}}/>

      <Grid item xs={3} sx={{ borderBottom:1, borderColor: 'secondary.main' }}/>
      <Grid item xs={3} paddingTop="10px" sx={{ borderBottom:1, borderColor: 'secondary.main' }}>
        <Typography variant="body2" fontWeight="bold" color="secondary">Polarization 0</Typography>
      </Grid>
      <Grid item xs={3} paddingTop="10px" sx={{ borderBottom:1, borderColor: 'secondary.main' }}>
        <Typography variant="body2" fontWeight="bold" color="secondary">Polarization 1</Typography>
      </Grid>
      <Grid item xs={3}/>

      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)"}}>
        <Typography variant="body2" paddingTop="2px">TRx USB:</Typography>
      </Grid>
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)" }}>
        <Typography variant="body2" fontWeight="bold" paddingTop="2px">{noiseTemp00}</Typography>
      </Grid>
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)" }}>
        <Typography variant="body2" fontWeight="bold" paddingTop="2px">{noiseTemp01}</Typography>
      </Grid>
      <Grid item xs={3}/>

      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)"}}>
        <Typography variant="body2" paddingTop="2px">TRx LSB:</Typography>
      </Grid>
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)" }}>
        <Typography variant="body2" fontWeight="bold" paddingTop="2px">{noiseTemp10}</Typography>
      </Grid>
      <Grid item xs={3} sx={{ borderBottom:1, borderColor: "rgba(0, 0, 255, 0.25)" }}>
        <Typography variant="body2" fontWeight="bold" paddingTop="2px">{noiseTemp11}</Typography>
      </Grid>
      <Grid item xs={3}/>

      { dataList.map((item, index) => dataListRow(item, index)) }      
    </Grid>
  );
}

