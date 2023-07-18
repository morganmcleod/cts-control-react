// React and Redux
import React from "react";
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
  reset 
} from './CartBiasSlice';

export default function MeasControl(props) {
  // Redux store interfaces
  const measActive = useSelector((state) => state.Measure.active);
  const cartConfig = useSelector((state) => state.CartBias.cartConfig);
  const cartConfigOptions = useSelector((state) => state.CartBias.cartConfigOptions);
  const dispatch = useDispatch();

  // Dropdown state
  const [open, setOpen] = React.useState(false);
  const [serialNum, setSerialNum] = React.useState(cartConfig ? cartConfig.serialNum : '')
  
  // CartTest state
  const loading = open && cartConfigOptions.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      axios.get("/database/config/")
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

  const onCartSelect = (newValue) => {
    if (newValue) {
      let configId = newValue.id
      axios.put("/database/config/" + configId, true)
      .then(res => {
        console.log(res.data);
      })

      dispatch(setCartConfig(newValue));
      axios.get("/database/config/keys/", {params: {configId: configId, pol: 0}})
      .then(res => {
        dispatch(setConfigKeys({...res.data, pol: 0}));
      })
      .catch(error => {
        console.log(error);
      })
      axios.get("/database/config/keys/", {params: {configId: configId, pol: 1}})
      .then(res => {
        dispatch(setConfigKeys({...res.data, pol: 1}));
        dispatch(setRefresh());
      })
      .catch(error => {
        console.log(error);
      })      
    } else {
      dispatch(reset())
      dispatch(setCartConfig(null));
      dispatch(setRefresh());
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
              getOptionLabel={(option) => option.serialNum}
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
