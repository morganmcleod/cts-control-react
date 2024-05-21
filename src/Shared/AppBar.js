import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Tooltip, 
  IconButton,
  Typography,
  Container,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import MainMenu from './MainMenu';

const pages = ['Cold Cart', 'LO & RF', 'Bias', 'Noise Temp', 'Stability', 'Beam Patterns', 'Devices Info'];
const colors = ['white', 'lightgreen', 'yellow', '#eaccff', '#ee4400', '#ff9999', 'tan'];

export default function CTSAppBar(props) {
  const [selected, setSelected] = useState(0);
  const handleClick = (index) => {
    setSelected(index);
    props.setVisibleTab(index);
  };
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters variant='dense' style={{maxHeight: '48px'}}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            CTS
          </Typography>
          
          <Tooltip placement="bottom" title={<Typography fontSize={13}>Home</Typography>}>
            <IconButton
              component="a"
              href="/"
            >
              <HomeIcon/>            
            </IconButton>
          </Tooltip>

          <Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={e => {handleClick(index)}}
                sx={{ 
                  my: 2, 
                  color: colors[index], 
                  display: 'block',
                  fontWeight: (index === selected ? "bold" : "normal"), 
                  textDecoration: (index === selected ? "underline" : "none")
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <MainMenu/>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
