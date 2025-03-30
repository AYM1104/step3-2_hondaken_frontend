import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-plus-jakarta), var(--font-noto-sans-jp), sans-serif',
    color: '#212529', // ← これがデフォルトの文字色
  },
  palette: {
    text: {
      primary: '#212529',
      secondary: '#868E96',
    },
  },
});

export default theme;