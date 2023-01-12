import '../components.css'
import React from "react";
import Button from '@mui/material/Button';
import { ThemeContext } from "../themes";

class EnableButton extends React.Component {
  constructor(props) {
    super(props);
    this.enableColor = props.enableColor ?? null;
    this.disableColor = props.disableColor ?? null;
    this.enableText = props.enableText ?? "ENABLED";
    this.disableText = props.disableText ?? "DISABLED";
    this.width = props.width ?? null;
  }
  onClick(e) {
    // forward the click event to parent:
    if (this.props.onClick)
      this.props.onClick(e);
  }
  render() {
    return (<ThemeContext.Consumer>
      {(cont) => {
        const enableColor = this.enableColor ?? cont.theme.palette.primary.main;
        const disableColor = this.disableColor ?? cont.theme.palette.primary.main;
        return (
          <Button
            name={this.props.name ?? "enableButton"}
            className="custom-btn-sm"
            variant="contained"
            size="small"
            value={this.props.enable}
            style={{ backgroundColor: this.props.enable ? enableColor : disableColor,
                     minWidth: this.width,
                     maxWidth: this.width
            }}
            onClick={ (e) => this.onClick(e)}
          >
            {this.props.enable ? this.enableText : this.disableText}
          </Button>
        )
      }}
    </ThemeContext.Consumer>)
  }
}
export default EnableButton