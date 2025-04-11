import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-plus-jakarta), var(--font-noto-sans-jp), sans-serif',
  },
  palette: {
    text: {
      primary: '#212529',
      secondary: '#868E96',
    },
  },
  components: {
    // @ts-expect-error - MuiPickersDay is not officially typed in MUI Theme
    MuiPickersDay: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#FCC419',
            color: '#212529',
            '&:hover': {
              backgroundColor: '#e6b800',
            },
          },
          // ↓ ここが効いてるかも
          '&.MuiPickersDay-root.Mui-selected.MuiPickersDay-dayWithMargin': {
            backgroundColor: '#FCC419 !important',
          },
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        switchViewButton: {
          // ▼ ドロップダウンボタン（年 or 月選択）サイズ調整
          '& .MuiTypography-root': {
            fontSize: '1rem', // ← お好みで（1rem = 16px）
          },
        },
        labelContainer: {
          // ▼ "April 2025" のフォントサイズ調整
          '& .MuiTypography-root': {
            fontSize: '1rem', // ← 小さくしたいときはここ
            fontWeight: 500,  // 必要なら調整
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.MuiPickersYear-yearButton.Mui-selected': {
            backgroundColor: '#FCC419',
            color: '#212529',
            '&:hover': {
              backgroundColor: '#e6b800',
            },
          },
        },
      },
    },
  },
});

export default theme;