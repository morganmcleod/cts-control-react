import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MainMenu from './MainMenu';
import eventBus from './EventBus';

const pages = ['ColdCart', 'LO', 'RF', 'BeamScanner']
  
function CTSAppBar() {

  const handleClick = (page) => {
    eventBus.dispatch("AppBar-click", page);
  };
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
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
              color: 'inherit',
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
                sx={{ my: 2, color: 'white', display: 'block' }}
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
export default CTSAppBar;
