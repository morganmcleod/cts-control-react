import '../components.css'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'; 
import Checkbox from '@mui/material/Checkbox';

export default function ScanListItem(props) {
  
  function itemStatus() {
    if (props.active.active) {
      return (
        <Grid item xs={7.5}>
          <Chip
            label={props.active.message}
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
        <>
          <Grid item xs={1.5} style={{"textAlign" : "center"}}>
            <Checkbox
              color="success"
              size="small"
              disabled={!props.enable || props.disabled}
              disableRipple
              style={{"paddingTop": "0"}}
              checked={props.subScansOption.copol0}
              onChange={(e) => { props.onChildChange(props.childIndex, { subScansOption: {...props.subScansOption, copol0: e.target.checked}}); }}
            />
          </Grid>
          <Grid item xs={1.5}>
            <Checkbox
              color="success"
              size="small"
              disabled={!props.enable || props.disabled}
              disableRipple
              style={{"paddingTop": "0"}}
              checked={props.subScansOption.xpol0}
              onChange={(e) => { props.onChildChange(props.childIndex, { subScansOption: {...props.subScansOption, xpol0: e.target.checked}}); }}
            />
          </Grid>
          <Grid item xs={1.5}>
            <Checkbox
              color="success"
              size="small"
              disabled={!props.enable || props.disabled}
              disableRipple
              style={{"paddingTop": "0"}}
              checked={props.subScansOption.copol1}
              onChange={(e) => { props.onChildChange(props.childIndex, { subScansOption: {...props.subScansOption, copol1: e.target.checked}}); }}
            />
          </Grid>
          <Grid item xs={1.5}>
            <Checkbox
              color="success"
              size="small"
              disabled={!props.enable || props.disabled}
              disableRipple
              style={{"paddingTop": "0"}}
              checked={props.subScansOption.xpol1}
              onChange={(e) => { props.onChildChange(props.childIndex, { subScansOption: {...props.subScansOption, xpol1: e.target.checked}}); }}
            />
          </Grid>
          <Grid item xs={1.5}>
            <Checkbox
              color="primary"
              size="small"
              disabled={!props.enable || props.disabled}
              disableRipple
              style={{"paddingTop": "0"}}
              checked={props.subScansOption.copol180}
              onChange={(e) => { props.onChildChange(props.childIndex, { subScansOption: {...props.subScansOption, copol180: e.target.checked}}); }}
            />
          </Grid>
        </>
      );
    }
  }

  return (
    <>
      <Grid item xs={1.5}>
        <Checkbox
          color="success"
          size="small"
          disabled={props.disabled}
          disableRipple
          style={{"paddingTop": "0"}}
          checked={props.enable}
          onChange={(e) => { props.onChildChange(props.childIndex, { enable: e.target.checked} ); }}
        ></Checkbox>
      </Grid>
      <Grid item xs={1.5}>{props.RF}</Grid>
      <Grid item xs={1.5}>{props.LO}</Grid>
      {itemStatus()}
    </>
  );
}

