// React and Redux
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Autocomplete, Box, CircularProgress, Grid, TextField, Tooltip, Typography } from '@mui/material';
import '../components.css'

// HTTP and store
import axios from "axios";
import { 
  setWCAs,
  setRFSources,
  setSelectedWCA,
  setSelectedRFSource,
  requestWCA, 
  requestRFSource
} from './WCASlice';

import { loSetYTO, loSetYTOLowInput, loSetYTOHighInput, loSetYTOSendNow, loSetPAInputs, loSetPAInputsSendNow } from '../Hardware/LO/LOSlice';
import { rfSetYTO, rfSetYTOLowInput, rfSetYTOHighInput, rfSetYTOSendNow, rfSetPAInputs, rfSetPAInputsSendNow } from "../Hardware/LO/RFSlice";

import AppController from "../Shared/AppController";

export default function SelectWCA(props) {
  // Redux store interfaces
  const WCAs = useSelector((state) => state.WCAs);
  const options = props.isRfSource ? WCAs.RFSources : WCAs.WCAs;
  const selectedItem = props.isRfSource ? WCAs.selectedRFSource : WCAs.selectedWCA;
  const measActive = useSelector((state) => state.Measure.active);
  const loYTO = useSelector((state) => state.LO.YTO);
  const rfYTO = useSelector((state) => state.RF.YTO);
  const YTO =  props.isRfSource ? rfYTO : loYTO;
  const setYTO = props.isRfSource ? rfSetYTO : loSetYTO;
  const setYTOLowInput = props.isRfSource ? rfSetYTOLowInput : loSetYTOLowInput;
  const setYTOHighInput = props.isRfSource ? rfSetYTOHighInput : loSetYTOHighInput;
  const onSelectChange = props.isRfSource ? AppController.onRfSourceChange : AppController.onWCAChange;
  const requestedConfigId = props.isRfSource ? WCAs.requestedRFSource : WCAs.requestedWCA;
  const dispatch = useDispatch();

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [serialNum, setSerialNum] = useState(selectedItem ? selectedItem.serialNum : '')
  
  // Loading state
  const loading = open && options && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      axios.get("/database/config/wcas", {params: {prefix: props.isRfSource ? "BEAST" : "WCA"}})
        .then(res => {
          if (res.data.success) {
            if (active) 
              dispatch(props.isRfSource ? setRFSources(res.data.items) : setWCAs(res.data.items));
          }
        })
        .catch(error => {
          console.log(error);
        })
    })();

    return () => {
      active = false;
    };
  }, [loading, dispatch, props.isRfSource]);

  const onSelect = useCallback((newValue) => {
    if (!newValue) {
      newValue = null;
    }
    console.log(newValue);
    dispatch(props.isRfSource ? setSelectedRFSource(newValue) : setSelectedWCA(newValue));
    if (newValue) {
      dispatch(setYTO({...YTO, lowGHz: newValue.ytoLowGHz, highGHz: newValue.ytoHighGHz}));
      dispatch(setYTOLowInput(newValue.ytoLowGHz));
      dispatch(setYTOHighInput(newValue.ytoHighGHz));
      dispatch(props.isRfSource ? rfSetYTOSendNow(true) : loSetYTOSendNow(true));
      dispatch(props.isRfSource ? rfSetPAInputs(newValue) : loSetPAInputs(newValue));
      dispatch(props.isRfSource ? rfSetPAInputsSendNow(true) : loSetPAInputsSendNow(true));
      onSelectChange(newValue.key);
    } else {
      onSelectChange(null);
    }
  }, [YTO, dispatch, props.isRfSource, setYTO, setYTOHighInput, setYTOLowInput, onSelectChange]);

  useEffect(() => {     
    if (requestedConfigId && options.length) {
      const config = options.find((x) => x.key === requestedConfigId);
      if (config)
        onSelect(config);      
      dispatch(props.isRfSource ? requestRFSource(null) : requestWCA(null));
    }
  }, [requestedConfigId, options, onSelect, props.isRfSource, dispatch]);

  return (
    // disable HTML5 validation:
    <Box component="form" noValidate id={'box-' + props.id}>
      <Grid container id={'cont-' + props.id}>
        <Grid item xs={12}>
          <Tooltip placement="top" title={<Typography fontSize={13}>Select serial number.</Typography>}>
            <Autocomplete
              value={selectedItem ? {
                id: selectedItem.id, 
                serialNum: selectedItem.serialNum, 
                lowGHz:selectedItem.ytoLowGhz,
                highGHz:selectedItem.ytoHighGHz              
              } : null}
              onChange={(e, newValue) => onSelect(newValue)}
              inputValue={serialNum}
              onInputChange={(e, newValue) => setSerialNum(newValue)}
              id={'autocomplete-' + props.id}
              size="small"
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              autoHighlight
              disabled={measActive}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option && option.serialNum ? option.serialNum : ""}
              options={options ?? []}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id={'textfield-' + props.id}
                  label={props.isRfSource ? "RF Source SN" : "WCA SN"}
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" color="Highlight">
            config:&nbsp;&nbsp;{selectedItem ? selectedItem.key : '--'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}