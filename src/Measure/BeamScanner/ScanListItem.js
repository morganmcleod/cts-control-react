// React and Redux
import React from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import {
  Grid,
  Chip,
  Checkbox,
  Typography
} from '@mui/material';
import '../../components.css'

// HTTP and store
import { setScanListItem } from './BeamScannerSlice';

export default function ScanListItem(props) {
  // Redux store interfaces
  const data = useSelector((state) => state.BeamScanner.scanList[props.index]);
  const active = props.index === useSelector((state) => state.BeamScanner.scanStatus.activeScan);
  const message = useSelector((state) => state.BeamScanner.scanStatus.activeSubScan);
  const dispatch = useDispatch();

  function itemStatus() {
    if (active) {
      return (
        <Grid item xs={7.5}>
          <Chip
            label={message}
            color="success"
            size="small"
            style={{
              minWidth: '100%',
              maxWidth: '100%' 
            }}
          />
        </Grid>
      );
    } else {
      return (
        <React.Fragment>
          <Grid item xs={1.5}>
            <Checkbox
              color="success"
              size="small"
              disabled={props.disabled || !data.enable}
              disableRipple
              style={{"paddingTop": "0"}}
              checked={data.subScansOption.copol0}
              onChange={(e) => { onChange({ subScansOption: {...data.subScansOption, copol0: e.target.checked}}); }}
            />
          </Grid>
          <Grid item xs={1.5}>
            <Checkbox
              color="success"
              size="small"
              disabled={props.disabled || !data.enable}
              disableRipple
              style={{"paddingTop": "0"}}
              checked={data.subScansOption.xpol0}
              onChange={(e) => { onChange({ subScansOption: {...data.subScansOption, xpol0: e.target.checked}}); }}
            />
          </Grid>
          <Grid item xs={1.5}>
            <Checkbox
              color="success"
              size="small"
              disabled={props.disabled || !data.enable}
              disableRipple
              style={{"paddingTop": "0"}}
              checked={data.subScansOption.copol1}
              onChange={(e) => { onChange({ subScansOption: {...data.subScansOption, copol1: e.target.checked}}); }}
            />
          </Grid>
          <Grid item xs={1.5}>
            <Checkbox
              color="success"
              size="small"
              disabled={props.disabled || !data.enable}
              disableRipple
              style={{"paddingTop": "0"}}
              checked={data.subScansOption.xpol1}
              onChange={(e) => { onChange({ subScansOption: {...data.subScansOption, xpol1: e.target.checked}}); }}
            />
          </Grid>
          <Grid item xs={1.5}>
            <Checkbox
              color="primary"
              size="small"
              disabled={props.disabled || !data.enable}
              disableRipple
              style={{"paddingTop": "0"}}
              checked={data.subScansOption.copol180}
              onChange={(e) => { onChange({ subScansOption: {...data.subScansOption, copol180: e.target.checked}}); }}
            />
          </Grid>
        </React.Fragment>
      );
    }
  }

  function onChange(what) {
    if ('enable' in what) {
      dispatch(setScanListItem({
        index: props.index,  
        data: {...data, enable: what.enable}
      }));
    
    } else if ('subScansOption' in what) {
      dispatch(setScanListItem({
        index: props.index,  
        data: {...data, subScansOption: what.subScansOption}
      }));
    }
  };

  return (
    <>
      <Grid item xs={1.5}>
        <Checkbox
          color="success"
          size="small"
          disabled={props.disabled}
          disableRipple
          style={{"paddingTop": "0"}}
          checked={data.enable}
          onChange={(e) => { onChange({ enable: e.target.checked}); }}
        ></Checkbox>
      </Grid>
      <Grid item xs={1.5}>
        <Typography variant="body2" fontWeight="bold" paddingTop="2px">{data.RF}</Typography>
      </Grid>
      <Grid item xs={1.5}>
        <Typography variant="body2" fontWeight="bold" paddingTop="2px">{data.LO < data.RF ? "USB" : "LSB"}</Typography>
      </Grid>
      {itemStatus()}
    </>
  );
}

