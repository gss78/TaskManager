import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '@asseinfo/react-kanban/dist/styles.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontSize: 15,
    h3: {
      fontWeight: 700,
      fontSize: '2.2rem',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

const MUITheme = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default MUITheme;
