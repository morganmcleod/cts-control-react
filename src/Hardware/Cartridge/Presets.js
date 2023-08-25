// React and Redux
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Button, Grid, OutlinedInput, Typography} from '@mui/material';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { 
  setInputVd, 
  setInputId, 
  setInputVj, 
  setInputImag,
  setApplySIS, 
  setApplyLNA
} from "./CartridgeSlice";

export default function Presets(props) {
  // State for user input prior to clicking a SAVE button
  const [inputD1, setInputD1] = useState("");
  const [inputD2, setInputD2] = useState("");
  const [inputD3, setInputD3] = useState("");
  
  // Redux store interfaces
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.Cartridge.inputs);

  useEffect(() => {
    axios.get("/cca/preset/1")
      .then(res => {
        setInputD1(res.data.description)
      })
      .catch(error => {
        console.log(error);
      })
      axios.get("/cca/preset/2")
      .then(res => {
        setInputD2(res.data.description)
      })
      .catch(error => {
        console.log(error);
      })
      axios.get("/cca/preset/3")
      .then(res => {
        setInputD3(res.data.description)
      })
      .catch(error => {
        console.log(error);
      })
  }, [])

  const handleLoad = (e) => {
    axios.get("/cca/preset/" + e.target.name[4])
      .then(res => {
        switch(e.target.name) {
          case "load1":
            setInputD1(res.data.description);
            break;
          case "load2":
            setInputD2(res.data.description);
            break;
          case "load3":
            setInputD3(res.data.description);
            break;
          default:
            return;
        }
        dispatch(setInputVj({pol: 0, sis: 1, data: res.data.SIS01.Vj}));
        dispatch(setInputVj({pol: 0, sis: 2, data: res.data.SIS02.Vj}));
        dispatch(setInputVj({pol: 1, sis: 1, data: res.data.SIS11.Vj}));
        dispatch(setInputVj({pol: 1, sis: 2, data: res.data.SIS12.Vj}));
        
        dispatch(setInputImag({pol: 0, sis: 1, data: res.data.SIS01.Imag}));
        dispatch(setInputImag({pol: 0, sis: 2, data: res.data.SIS02.Imag}));
        dispatch(setInputImag({pol: 1, sis: 1, data: res.data.SIS11.Imag}));
        dispatch(setInputImag({pol: 1, sis: 2, data: res.data.SIS12.Imag}));

        dispatch(setApplySIS({pol: 0, sis: 1}));
        dispatch(setApplySIS({pol: 0, sis: 2}));
        dispatch(setApplySIS({pol: 1, sis: 1}));
        dispatch(setApplySIS({pol: 1, sis: 2}));
        
        dispatch(setInputVd({pol: 0, lna: 1, stage: 1, data: res.data.LNA01.VD1}));
        dispatch(setInputVd({pol: 0, lna: 1, stage: 2, data: res.data.LNA01.VD2}));
        dispatch(setInputVd({pol: 0, lna: 1, stage: 3, data: res.data.LNA01.VD3}));
        dispatch(setInputVd({pol: 0, lna: 2, stage: 1, data: res.data.LNA02.VD1}));
        dispatch(setInputVd({pol: 0, lna: 2, stage: 2, data: res.data.LNA02.VD2}));
        dispatch(setInputVd({pol: 0, lna: 2, stage: 3, data: res.data.LNA02.VD3}));

        dispatch(setInputVd({pol: 1, lna: 1, stage: 1, data: res.data.LNA11.VD1}));
        dispatch(setInputVd({pol: 1, lna: 1, stage: 2, data: res.data.LNA11.VD2}));
        dispatch(setInputVd({pol: 1, lna: 1, stage: 3, data: res.data.LNA11.VD3}));
        dispatch(setInputVd({pol: 1, lna: 2, stage: 1, data: res.data.LNA12.VD1}));
        dispatch(setInputVd({pol: 1, lna: 2, stage: 2, data: res.data.LNA12.VD2}));
        dispatch(setInputVd({pol: 1, lna: 2, stage: 3, data: res.data.LNA12.VD3}));        
        
        dispatch(setInputId({pol: 0, lna: 1, stage: 1, data: res.data.LNA01.ID1}));
        dispatch(setInputId({pol: 0, lna: 1, stage: 2, data: res.data.LNA01.ID2}));
        dispatch(setInputId({pol: 0, lna: 1, stage: 3, data: res.data.LNA01.ID3}));
        dispatch(setInputId({pol: 0, lna: 2, stage: 1, data: res.data.LNA02.ID1}));
        dispatch(setInputId({pol: 0, lna: 2, stage: 2, data: res.data.LNA02.ID2}));
        dispatch(setInputId({pol: 0, lna: 2, stage: 3, data: res.data.LNA02.ID3}));

        dispatch(setInputId({pol: 1, lna: 1, stage: 1, data: res.data.LNA11.ID1}));
        dispatch(setInputId({pol: 1, lna: 1, stage: 2, data: res.data.LNA11.ID2}));
        dispatch(setInputId({pol: 1, lna: 1, stage: 3, data: res.data.LNA11.ID3}));
        dispatch(setInputId({pol: 1, lna: 2, stage: 1, data: res.data.LNA12.ID1}));
        dispatch(setInputId({pol: 1, lna: 2, stage: 2, data: res.data.LNA12.ID2}));
        dispatch(setInputId({pol: 1, lna: 2, stage: 3, data: res.data.LNA12.ID3}));

        dispatch(setApplyLNA({pol: 0, lna: 1}));
        dispatch(setApplyLNA({pol: 0, lna: 2}));
        dispatch(setApplyLNA({pol: 1, lna: 1}));
        dispatch(setApplyLNA({pol: 1, lna: 2}));        
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleSave = (e) => {
    let description = '';
    switch(e.target.name) {
      case "save1":
        description = inputD1;
        break;
      case "save2":
        description = inputD2;
        break;
      case "save3":
        description = inputD3;
        break;
      default:
        return;
    }

    const params = {
      description: description,
      LNA01: {
        pol: 0,
        lna: 1,
        VD1: inputs.LNA[0][0].VD1,
        VD2: inputs.LNA[0][0].VD2,
        VD3: inputs.LNA[0][0].VD3,
        ID1: inputs.LNA[0][0].ID1,
        ID2: inputs.LNA[0][0].ID2,
        ID3: inputs.LNA[0][0].ID3
      },
      LNA02: {
        pol: 0,
        lna: 2,
        VD1: inputs.LNA[0][1].VD1,
        VD2: inputs.LNA[0][1].VD2,
        VD3: inputs.LNA[0][1].VD3,
        ID1: inputs.LNA[0][1].ID1,
        ID2: inputs.LNA[0][1].ID2,
        ID3: inputs.LNA[0][1].ID3
      },
      LNA11: {
        pol: 1,
        lna: 1,
        VD1: inputs.LNA[1][0].VD1,
        VD2: inputs.LNA[1][0].VD2,
        VD3: inputs.LNA[1][0].VD3,
        ID1: inputs.LNA[1][0].ID1,
        ID2: inputs.LNA[1][0].ID2,
        ID3: inputs.LNA[1][0].ID3
      },
      LNA12: {
        pol: 1,
        lna: 2,
        VD1: inputs.LNA[1][1].VD1,
        VD2: inputs.LNA[1][1].VD2,
        VD3: inputs.LNA[1][1].VD3,
        ID1: inputs.LNA[1][1].ID1,
        ID2: inputs.LNA[1][1].ID2,
        ID3: inputs.LNA[1][1].ID3
      },
      SIS01: {
        pol: 0,
        sis: 1,
        Vj: inputs.SIS[0][0].Vj,
        Imag: inputs.SIS[0][0].Imag
      },
      SIS02: {
        pol: 0,
        sis: 2,
        Vj: inputs.SIS[0][1].Vj,
        Imag: inputs.SIS[0][1].Imag
      },
      SIS11: {
        pol: 1,
        sis: 1,
        Vj: inputs.SIS[1][0].Vj,
        Imag: inputs.SIS[1][0].Imag
      },
      SIS12: {
        pol: 1,
        sis: 2,
        Vj: inputs.SIS[1][1].Vj,
        Imag: inputs.SIS[1][1].Imag
      }
    }
    axios.put("/cca/preset/" + e.target.name[4], params)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const setInputDescription = (e) => {
    switch (e.target.name) {
      case "description1":
        setInputD1(e.target.value);
        break;
      case "description2":
        setInputD2(e.target.value);
        break;
      case "description3":
        setInputD3(e.target.value);
        break;
      default:
        break;
    }
  }

  return (
    <Grid container paddingLeft="5px" paddingBottom="15px" border={1} borderTop={0}>
      <Grid item xs={3}>
        <Typography variant="body1" fontWeight="bold">Presets</Typography>
      </Grid>
      <Grid item container xs={9} direction="column" sx={{display: "flex", justifyContent: "flex-end"}}>
        <Typography variant="body2"><b>Description</b></Typography>
      </Grid>
      <Grid item xs={1.5}>
        <Button
          name="load1"
          className="custom-btn-sm"
          variant="contained"
          onClick={e => handleLoad(e)}
        >
          LOAD 1
        </Button>
      </Grid>
      <Grid item xs={1.5}>
        <Button
          name="save1"
          className="custom-btn-sm"
          variant="contained"
          onClick={e => handleSave(e)}
        >
          SAVE 1
        </Button>
      </Grid>
      <Grid item xs={9}>
        <OutlinedInput
          name="description1"
          size="small"
          margin="none"                
          style={{width: "95%"}}
          onChange={e => setInputDescription(e)}
          value={inputD1}
          className="smallinput"
          />
      </Grid>
      
      <Grid item xs={1.5}>
        <Button
          name="load2"
          className="custom-btn-sm"
          variant="contained"
          onClick={e => handleLoad(e)}
        >
          LOAD 2
        </Button>
      </Grid>
      <Grid item xs={1.5}>
        <Button
          name="save2"
          className="custom-btn-sm"
          variant="contained"
          onClick={e => handleSave(e)}
        >
          SAVE 2
        </Button>
      </Grid>
      <Grid item xs={9}>
        <OutlinedInput
          name="description2"
          size="small"
          margin="none"                
          style={{width: "95%"}}
          onChange={e => setInputDescription(e)}
          value={inputD2}
          className="smallinput"
        />
      </Grid>

      <Grid item xs={1.5}>
        <Button
          name="load3"
          className="custom-btn-sm"
          variant="contained"
          onClick={e => handleLoad(e)}
        >
          LOAD 3
        </Button>
      </Grid>
      <Grid item xs={1.5}>
        <Button
          name="save3"
          className="custom-btn-sm"
          variant="contained"
          onClick={e => handleSave(e)}
        >
          SAVE 3
        </Button>
      </Grid>
      <Grid item xs={9}>
        <OutlinedInput
          name="description3"
          size="small"
          margin="none"                
          style={{width: "95%"}}
          onChange={e => setInputDescription(e)}
          value={inputD3}
          className="smallinput"
        />
      </Grid>
    </Grid>
  );
}