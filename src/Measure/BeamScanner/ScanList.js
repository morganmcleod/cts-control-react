// React and Redux
import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import {
  Grid,
  Checkbox,
  Typography
} from '@mui/material';
import ScanListItem from './ScanListItem';
import Disabled from '../../Shared/Disabled';
import '../../components.css';

// HTTP and store
import axios from "axios";
import { setScanList } from './BeamScannerSlice';

export default function ScanList(props) {
  // Redux store interfaces
  const scanList = useSelector((state) => state.BeamScanner.scanList);
  const disabled = useSelector((state) => state.BeamScanner.scanStatus.activeScan) !== null;
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get('/beamscan/scan_list')
    .then(res => {
      dispatch(setScanList(res.data.items));
    })
    .catch(error => {
      console.log(error);
    });
  }, [dispatch]);

  // Fetch first time only
  useEffect(() => {
    fetch();
  }, [fetch]);

  const checkedChildren = () => {
    return scanList.reduce((x, cv) => { 
      return {
        all: x.all && cv.enable, 
        some: x.some || cv.enable
      }
    }, {
      all: true,
      some: false
    });
  }

  const subScanChildren = () => {
    return scanList.reduce((x, cv) => { 
      return {
        copol0: {
          all:  x.copol0.all  && cv.subScansOption.copol0,
          some: x.copol0.some || cv.subScansOption.copol0,
        },  
        xpol0: {
          all:  x.xpol0.all  && cv.subScansOption.xpol0,
          some: x.xpol0.some || cv.subScansOption.xpol0,
        },  
        copol1: {
          all:  x.copol1.all  && cv.subScansOption.copol1,
          some: x.copol1.some || cv.subScansOption.copol1,
        },  
        xpol1: {
          all:  x.xpol1.all  && cv.subScansOption.xpol1,
          some: x.xpol1.some || cv.subScansOption.xpol1,
        },  
        copol180: {
          all:  x.copol180.all  && cv.subScansOption.copol180,
          some: x.copol180.some || cv.subScansOption.copol180,
        },  
      }
    }, {
      copol0: {
        all: true,
        some: false
      },
      xpol0: {
        all: true,
        some: false
      },
      copol1: {
        all: true,
        some: false
      },
      xpol1: {
        all: true,
        some: false
      },
      copol180: {
        all: true,
        some: false
      }
    });
  }

  function onParentChange(checked) {
    axios.post('/beamscan/scan_list/enable/all', null, { params: { enable: checked }})
      .then(res => {
        console.log(res.data);
        const newList = scanList.map(obj => {
          return {...obj, enable: checked};
        });
        dispatch(setScanList(newList));
      })
      .catch(error => {
        console.log(error);
      });
  }

  function onParentSubScansChange(what) {
    axios.post('/beamscan/scan_list/subscans/all', what)
    .then(res => {
      console.log(res.data);
      const newList = scanList.map(obj => {
        return {...obj, subScansOption: {...obj.subScansOption, ...what}}

      });
      dispatch(setScanList(newList));
    })
    .catch(error => {
      console.log(error);
    });
  }

  function parentEnableCheckbox() {
    const kids = checkedChildren();
    return (
      <Checkbox
        color="success"
        size="small"
        disableRipple
        checked={kids.all}
        indeterminate={!kids.all && kids.some}
        style={{"paddingTop": "4px"}}
        onChange={(e) => onParentChange(!kids.some)}
      />
    );
  }

  function parentSubScansCheckbox() {
    const kids = subScanChildren();
    return (
      <>
        <Grid item xs={1.5}>
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "4px"}}
            checked={kids.copol0.all}
            indeterminate={!kids.copol0.all && kids.copol0.some}
            onChange={(e) => onParentSubScansChange({copol0: !kids.copol0.some})}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "4px"}}
            checked={kids.xpol0.all}
            indeterminate={!kids.xpol0.all && kids.xpol0.some}
            onChange={(e) => onParentSubScansChange({xpol0: !kids.xpol0.some})}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "4px"}}
            checked={kids.copol1.all}
            indeterminate={!kids.copol1.all && kids.copol1.some}
            onChange={(e) => onParentSubScansChange({copol1: !kids.copol1.some})}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "4px"}}
            checked={kids.xpol1.all}
            indeterminate={!kids.xpol1.all && kids.xpol1.some}
            onChange={(e) => onParentSubScansChange({xpol1: !kids.xpol1.some})}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Checkbox
            color="primary"
            size="small"
            disableRipple
            style={{"paddingTop": "4px"}}
            checked={kids.copol180.all}
            indeterminate={!kids.copol180.all && kids.copol180.some}
            onChange={(e) => onParentSubScansChange({copol180: !kids.copol180.some})}
          />
        </Grid>
      </>
    );
  }

  return (
    <>
      <Grid container textAlign="center">
        <Grid item xs={12} textAlign="left">
          <Typography variant="h6" paddingLeft="8px">Scan List</Typography>
        </Grid>

        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">Enable</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">RF</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">SB</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">Co_0</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">X_0</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">Co_1</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">X_1</Typography></Grid>
        <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">180</Typography></Grid>
      </Grid>
      <Disabled disabled={disabled}>
        <Grid container textAlign="center">
          <Grid item xs={1.5}>{ parentEnableCheckbox() }</Grid>
          <Grid item xs={1.5}><Typography variant="body2" paddingTop="4px">[ GHz ]</Typography></Grid>
          <Grid item xs={1.5}/>{ parentSubScansCheckbox() }
        </Grid>
      </Disabled>
      <Grid container textAlign="center" sx={{borderTop:1}}>
        {scanList.map((item, index) => (
          <ScanListItem
            key = {item.index}
            index = {item.index}
            disabled = {disabled}
          ></ScanListItem>
        ))}
      </Grid>  
    </>
  );
}
