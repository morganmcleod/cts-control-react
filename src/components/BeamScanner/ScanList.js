import '../components.css';
import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import ScanListItem from './ScanListItem';
import Disabled from '../Disabled';

const axios = require('axios').default

export default function ScanList(props) {
  const [scanList, setScanList] = useState([]);

  const fetchScanList = () => {
    axios.get('/beamscan/scan_list')
    .then(res => {
      setScanList(res.data.items);
    })
    .catch(error => {
      console.log(error);
    });
  }

  useEffect(() => {
    fetchScanList();
  }, []);

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

  function onChildChange(childIndex, what) {
    if ('enable' in what) {
      axios.post('/beamscan/scan_list/enable/' + childIndex, null, { params: { enable: what.enable }})
        .then(res => {
          console.log(res.data);
          const newList = scanList.map(obj => {
            if (obj.index === childIndex) {
              return {...obj, enable: what.enable};
            }
            return obj;
          });
          setScanList(newList);
        })
        .catch(error => {
          console.log(error);
        });
    } else if ('subScansOption' in what) {
      console.log(what.subScansOption);
      axios.post('/beamscan/scan_list/subscans/' + childIndex, what.subScansOption)
        .then(res => {
          console.log(res.data);
          const newList = scanList.map(obj => {
            if (obj.index === childIndex) {
              return {...obj, subScansOption: what.subScansOption};
            }
            return obj;
          });
          setScanList(newList);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  function onParentChange(checked) {
    axios.post('/beamscan/scan_list/enable/all', null, { params: { enable: checked }})
      .then(res => {
        console.log(res.data);
        const newList = scanList.map(obj => {
          return {...obj, enable: checked};
        });
        setScanList(newList);
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
      setScanList(newList);
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
        style={{"paddingTop": "0"}}
        onChange={(e) => onParentChange(!kids.some)}
      />
    );
  }

  function parentSubScansCheckbox() {
    const kids = subScanChildren();
    return (
      <>
        <Grid item xs={1.5} className="table-title">
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "0"}}
            checked={kids.copol0.all}
            indeterminate={!kids.copol0.all && kids.copol0.some}
            onChange={(e) => onParentSubScansChange({copol0: !kids.copol0.some})}
          />
        </Grid>
        <Grid item xs={1.5} className="table-title">
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "0"}}
            checked={kids.xpol0.all}
            indeterminate={!kids.xpol0.all && kids.xpol0.some}
            onChange={(e) => onParentSubScansChange({xpol0: !kids.xpol0.some})}
          />
        </Grid>
        <Grid item xs={1.5} className="table-title">
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "0"}}
            checked={kids.copol1.all}
            indeterminate={!kids.copol1.all && kids.copol1.some}
            onChange={(e) => onParentSubScansChange({copol1: !kids.copol1.some})}
          />
        </Grid>
        <Grid item xs={1.5} className="table-title">
          <Checkbox
            color="success"
            size="small"
            disableRipple
            style={{"paddingTop": "0"}}
            checked={kids.xpol1.all}
            indeterminate={!kids.xpol1.all && kids.xpol1.some}
            onChange={(e) => onParentSubScansChange({xpol1: !kids.xpol1.some})}
          />
        </Grid>
        <Grid item xs={1.5} className="table-title">
          <Checkbox
            color="primary"
            size="small"
            disableRipple
            style={{"paddingTop": "0"}}
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
      <Grid container spacing={0} className="table-data">
        <Grid item xs={12} className="component-header">Scan List</Grid>

        <Grid item xs={1.5} className="table-title">Enable</Grid>
        <Grid item xs={1.5} className="table-title">RF</Grid>
        <Grid item xs={1.5} className="table-title">LO</Grid>
        <Grid item xs={1.5} className="table-title">Co_0</Grid>
        <Grid item xs={1.5} className="table-title">X_0</Grid>
        <Grid item xs={1.5} className="table-title">Co_1</Grid>
        <Grid item xs={1.5} className="table-title">X_1</Grid>
        <Grid item xs={1.5} className="table-title">180</Grid>
      </Grid>
      <Disabled disabled={props.disabled}>
        <Grid container spacing={0} className="table-data">
          <Grid item xs={1.5} className="table-title">
            { parentEnableCheckbox() }
          </Grid>
          <Grid item xs={3} className="table-title">[ GHz ]</Grid>
          { parentSubScansCheckbox() }
        </Grid>
      </Disabled>
      <Grid container spacing={0} className="table-data" sx={{borderTop:1}}>
        {scanList.map((item, index) => (
          <ScanListItem
            key = {item.index}
            // disabled = {props.disabled}
            childIndex = {index}
            enable = {item.enable}
            active = {{active: index === props.activeScan,
                      message: props.activeDescription}}
            RF = {item.RF}
            LO = {item.LO}
            subScansOption = {item.subScansOption}
            subScansText = {item.subScansText}
            onChildChange = {onChildChange}
          ></ScanListItem>
        ))}
      </Grid>  
    </>
  );
}
