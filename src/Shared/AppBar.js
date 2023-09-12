import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MainMenu from './MainMenu';

const pages = ['Cold Cart', 'LO & RF', 'Bias', 'Noise Temp', 'Beam Patterns'];
const colors = ['white', 'lightgreen', 'yellow', '#eaccff', '#ff9999'];

export default function CTSAppBar(props) {

  const handleClick = (index) => {
    props.setVisibleTab(index);
  };
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters variant='dense' style={{maxHeight: '48px'}}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
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

          <Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={e => {handleClick(index)}}
                sx={{ my: 2, color: colors[index], display: 'block' }}
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
