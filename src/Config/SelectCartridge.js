// React and Redux
import React from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Autocomplete, CircularProgress, Grid, TextField, Tooltip, Typography } from '@mui/material';
import '../components.css'

// HTTP and store
import axios from "axios";
import { 
  setCartConfigId, 
  setCartSerialNum, 
  setCartConfigOptions, 
  setRefresh, 
  setConfigKeys, 
  reset 
} from './CartBiasSlice';

export default function MeasControl(props) {
  // Dropdown state
  const [open, setOpen] = React.useState(false);

  // Redux store interfaces
  const measActive = useSelector((state) => state.Measure.active);
  const cartConfigId = useSelector((state) => state.CartBias.cartConfigId);
  const cartSerialNum = useSelector((state) => state.CartBias.cartSerialNum);
  const cartConfigOptions = useSelector((state) => state.CartBias.cartConfigOptions);
  const dispatch = useDispatch();

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
          let options = [];
          for (const config of res.data.items) {
            options.push({
              serialNum: config.serialNum,
              id: config.id
            })
          }
          if (active) 
            dispatch(setCartConfigOptions(options));
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
      dispatch(setCartConfigId(newValue.id));
      axios.get("/database/config/keys/", {params: {configId: newValue.id, pol: 0}})
      .then(res => {
        dispatch(setConfigKeys({...res.data, pol: 0}));
      })
      .catch(error => {
        console.log(error);
      })
      axios.get("/database/config/keys/", {params: {configId: newValue.id, pol: 1}})
      .then(res => {
        dispatch(setConfigKeys({...res.data, pol: 1}));
        dispatch(setRefresh());
      })
      .catch(error => {
        console.log(error);
      })      
    } else {
      dispatch(reset())
      dispatch(setCartConfigId(null));
      dispatch(setRefresh());
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}><Typography variant="body2"><b>Cartridge</b></Typography></Grid>
      <Grid item xs={12}>
        <Tooltip placement="top" title={<Typography fontSize={13}>Select cartridge serial number. Required</Typography>}>
          <Autocomplete
            value={cartConfigId ? {id: cartConfigId, serialNum: cartSerialNum} : null}
            onChange={(e, newValue) => onCartSelect(newValue)}
            inputValue={cartSerialNum}
            onInputChange={(event, newValue) => { 
              dispatch(setCartSerialNum(newValue));
            }}
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
        <Typography variant="body2" color="Highlight">config:{cartConfigId ?? '--'}</Typography>
      </Grid>
    </Grid>
  );
}
