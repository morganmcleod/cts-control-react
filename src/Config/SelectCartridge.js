// React and Redux
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Autocomplete, Box, CircularProgress, Grid, TextField, Tooltip, Typography } from '@mui/material';
import '../components.css'

// HTTP and store
import axios from "axios";
import { 
  setCartConfig,
  setCartConfigOptions, 
  setRefresh, 
  setConfigKeys, 
  resetConfig 
} from './CartBiasSlice';

import AppController from "../Shared/AppController";

export default function SelectCartridge(props) {
  // Redux store interfaces
  const measActive = useSelector((state) => state.Measure.active);
  const cartConfig = useSelector((state) => state.CartBias.cartConfig);
  const cartConfigOptions = useSelector((state) => state.CartBias.cartConfigOptions);
  const dispatch = useDispatch();

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [serialNum, setSerialNum] = useState(cartConfig ? cartConfig.serialNum : '')
  
  // Loading state
  const loading = open && cartConfigOptions.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      axios.get("/database/config")
      .then(res => {
        if (res.data.success) {
          if (active) 
            dispatch(setCartConfigOptions(res.data.items));
        }
      })
      .catch(error => {
        console.log(error);
      })
    })();

    return () => {
      active = false;
    };
  }, [loading, dispatch]);

  const getConfigKeys = useCallback((configId) => {
    axios.get("/database/config/keys", {params: {configId: configId, pol: 0}})
    .then(res => {
      if (res.data) {
        dispatch(setConfigKeys({...res.data, pol: 0}));
        dispatch(setRefresh());
      } else {
        console.log("Error getting cartrdge config for pol 0");
      }
    })
    .catch(error => {
      console.log(error);
    })
    axios.get("/database/config/keys", {params: {configId: configId, pol: 1}})
    .then(res => {
      if (res.data) {
        dispatch(setConfigKeys({...res.data, pol: 1}));
        dispatch(setRefresh());
      } else {
        console.log("Error getting cartrdge config for pol 1");
      }
    })
    .catch(error => {
      console.log(error);
    })
  }, [dispatch]);

  useEffect(() => {
    axios.get("/database/config/current")
      .then(res => {
        dispatch(setCartConfig(res.data))
        if (res.data)
          getConfigKeys(res.data.id);
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, getConfigKeys]);

  const onCartSelect = (newValue) => {
    if (newValue) {
      axios.put("/database/config/" + newValue.id, true)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
      dispatch(setCartConfig(newValue));
      getConfigKeys(newValue.id);

      AppController.onCartConfigChange(newValue.id);
     
    } else {
      axios.put("/database/config/0", true)
        .then(res => {
          console.log(res.data);
          dispatch(resetConfig())
          dispatch(setRefresh());
        })
        .catch(error => {
          console.log(error);
        })

      AppController.onCartConfigChange(null);
    }
  }

  return (
    // disable HTML5 validation:
    <Box component="form" noValidate>
      <Grid container>
        <Grid item xs={12}><Typography variant="body2"><b>Cartridge</b></Typography></Grid>
        <Grid item xs={12}>
          <Tooltip placement="top" title={<Typography fontSize={13}>Select cartridge serial number. Required</Typography>}>
            <Autocomplete
              value={cartConfig ? {id: cartConfig.id, serialNum: cartConfig.serialNum} : null}
              onChange={(e, newValue) => onCartSelect(newValue)}
              inputValue={serialNum}
              onInputChange={(e, newValue) => setSerialNum(newValue)}
              id="cartridge-sn"
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
              options={cartConfigOptions}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cartridge SN"
                  variant="outlined"
                  required
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
            config:&nbsp;&nbsp;{cartConfig ? cartConfig.id : '--'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
