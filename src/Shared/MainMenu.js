import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Typography } from '@mui/material';

import { saveTheme, ThemeContext } from "../themes";
import JIRAIssueCollector from "./JIRAIssueCollector";
import AppController from './AppController';
import AlertDialog from './AlertDialog';

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAbout: false,
      anchorEl: null
    }
  }

  setShowAbout(show) {
    this.setState({showAbout: show});
  }

  render() {
    const open = Boolean(this.state.anchorEl);
    const handleClick = (event) => {
      this.setState({anchorEl : event.currentTarget});
    };
    const handleClose = () => {
      this.setState({anchorEl : null});
    };
 
    return (<ThemeContext.Consumer>
      {({theme, setTheme}) => {
        return (
          <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
              <Tooltip placement="bottom" title={<Typography fontSize={13}>App menu</Typography>}>
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'main-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  {/* <Avatar sx={{ width: 32, height: 32 }}> */}
                    <MenuIcon/>
                  {/* </Avatar> */}
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={this.state.anchorEl}
              id="main-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                onClick={() => {
                  this.setShowAbout(true);
                }}
              >
                About
              </MenuItem>
              <MenuItem 
                onClick={ () => { 
                  setTheme(1);
                  saveTheme(1);
                }}
              >
                Light Theme
              </MenuItem>
              <MenuItem
                onClick={ () => { 
                  setTheme(2);
                  saveTheme(2);
                }}
              >
                Dark Theme
              </MenuItem>
              <MenuItem>
                <JIRAIssueCollector
                  appVersion={AppController.getAppVersion()}
                >
                  Bug Report
                </JIRAIssueCollector>          
              </MenuItem>
            </Menu>
            <AlertDialog
              open={this.state.showAbout}
              title="About CTS Control"
              onClose={() => this.setShowAbout(false)}
              hideCancel={true}
            >
              App: {AppController.getAppVersion()}
              <br/>
              API: {AppController.getAPIVersion()}
            </AlertDialog>
          </React.Fragment>
        )
      }}
      </ThemeContext.Consumer>
    )
  }
};
export default MainMenu;
