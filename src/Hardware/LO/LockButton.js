import React from "react";

import '../../components.css'
import Button from '@mui/material/Button';
import { ThemeContext } from "../../themes";

class LockButton extends React.Component {
  // The LockButton has four states:
  //  LOCK (unlocked): click to start locking
  //  LOCKING: waiting for lock or failure
  //  FAILED
  //  LOCKED
  constructor(props) {
    super(props);
    this.unlockColor = props.unlockColor ?? null;
    this.lockingColor = props.lockingColor ?? "yellow";
    this.lockColor = props.lockColor ?? "green";
    this.failColor = props.failColor ?? "red";
  }
  onClick(e) {
    // forward the click event to parent:
    if (this.props.onClick)
      this.props.onClick(e);
  }
  render() {
    return (<ThemeContext.Consumer>
      {(cont) => {
        let bgColor = null;
        let text = "<>";
        let textColor = cont.theme.palette.primary.contrastText;

        if (this.props.isLocked) {
          bgColor = this.lockColor;
          text = "LOCKED";
        } else if (this.props.isLocking) {
          bgColor = this.lockingColor;
          textColor = "black";
          text = "LOCKING...";
        } else if (this.props.lockFailed) {
          bgColor = this.failColor;
          text = "FAILED";
        } else {
          bgColor = this.unlockColor ?? cont.theme.palette.primary.main;
          text = "LOCK";
        }
        return (
          <Button
            className="custom-btn-sm"
            variant="contained"
            size="small"
            style={{ backgroundColor: bgColor,
                     color: textColor,
                     minWidth: '100%',
                     maxWidth: '100%' 
            }}
            onClick={ (e) => this.onClick(e)}
          >
            {text}
          </Button>
        )
      }}
    </ThemeContext.Consumer>)
  }
}
export default LockButton;
