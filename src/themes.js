import { createContext } from "react";
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#3f51b5",
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00838f',
    },
    background: {
      default: '#f0f0f0',
      paper: '#f0f0f0',
    },
    text: {
      primary: 'rgba(0,0,0,0.88)',
      error: 'rgba(255,0,0,1)',
    }
  },
  typography: {
    fontSize: 12,
  },
});

const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#3f51b5",
      contrastText: '#000000',
    },
    secondary: {
      main: "#f1f1f1ff",
    },
    background: {
      default: "#404040",
      paper: "#404040",
    },
    text: {
      primary: "#f8f8f8ff",
      error: 'rgba(255,0,0,1)',
    },
  },
  typography: {
    fontSize: 12,
  },
});

let mapTheme = (themeId) => {
  switch (themeId) {
    case 1:
      console.log('lightTheme');
      return lightTheme;
    case 2:
      console.log('darkTheme');
      return darkTheme;
    case 0:
    default:
      console.log('defaultTheme');
      return lightTheme;
  }
};

let saveTheme = (themeId) => {
  localStorage.setItem('ctsControlTheme', themeId);
};

let loadTheme = () => {
  let themeId = 0;
  let item = localStorage.getItem('ctsControlTheme');
  if (item) {
    themeId = JSON.parse(item);
  }
  return mapTheme(themeId);
}

const ThemeContext = createContext({
  theme: null,
  setTheme: (themeId) => {}
});

export { ThemeContext, mapTheme, loadTheme, saveTheme };
