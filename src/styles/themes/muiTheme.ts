import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'ltr',

  palette: {
    primary: {
      main: '#e8799a',
      light: '#fca5a5',
      dark: '#d4547a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c4894a',
      light: '#e8c49a',
      dark: '#a67239',
      contrastText: '#ffffff',
    },
    error:   { main: '#dc2626' },
    warning: { main: '#f59e0b' },
    success: { main: '#10b981' },
    background: {
      default: '#fdf0f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#4a2c3a',
      secondary: '#9e6b7e',
    },
  },

  typography: {
    fontFamily: ['Nunito', 'Dancing Script', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'].join(','),
    h1: { fontFamily: 'Dancing Script, cursive', fontSize: '3rem',   fontWeight: 700, color: '#4a2c3a' },
    h2: { fontFamily: 'Dancing Script, cursive', fontSize: '2.5rem', fontWeight: 600, color: '#4a2c3a' },
    h3: { fontSize: '1.75rem', fontWeight: 600, color: '#4a2c3a' },
    h4: { fontSize: '1.5rem',  fontWeight: 600, color: '#4a2c3a' },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem',    fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.03em' },
    body1: { fontSize: '1rem', lineHeight: 1.7, color: '#2b1821' },
    body2: { fontSize: '0.9rem', lineHeight: 1.6, color: '#9e6b7e' },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#fdf0f5',
          backgroundImage: `
            radial-gradient(ellipse at 20% 60%, rgba(232, 196, 154, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 30%, rgba(232, 121, 154, 0.15) 0%, transparent 55%)
          `,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999, padding: '12px 32px', fontSize: '0.9rem',
          fontWeight: 700, textTransform: 'none', boxShadow: 'none', transition: 'all 0.2s ease',
        },
        contained: {
          background: 'linear-gradient(135deg, #e8799a, #d4547a)',
          boxShadow: '0 6px 20px rgba(212, 84, 122, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #d4547a, #c23d61)',
            boxShadow: '0 10px 28px rgba(212, 84, 122, 0.4)',
            transform: 'translateY(-3px)',
          },
        },
        outlined: {
          borderColor: '#e8799a', borderWidth: 2, color: '#d4547a',
          '&:hover': { borderWidth: 2, backgroundColor: '#f9e4ec', transform: 'translateY(-3px)' },
        },
        text: {
          color: '#d4547a',
          '&:hover': { backgroundColor: '#f9e4ec' },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, boxShadow: '0 8px 24px rgba(212, 84, 122, 0.12)', transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 12px 32px rgba(212, 84, 122, 0.2)', transform: 'translateY(-6px)' },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12, backgroundColor: '#fdf0f5', transition: 'all 0.2s',
            '&:hover': { backgroundColor: '#ffffff' },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              '& fieldset': { borderColor: '#e8799a', borderWidth: 2 },
            },
            '& fieldset': { borderColor: '#d4a8b8', borderWidth: 2 },
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: '0 8px 24px rgba(212, 84, 122, 0.1)' },
        elevation3: { boxShadow: '0 12px 32px rgba(212, 84, 122, 0.15)' },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
        filled: {
          backgroundColor: '#f9e4ec', color: '#d4547a',
          '&:hover': { backgroundColor: '#e8799a', color: '#ffffff' },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 248, 242, 0.93)', backdropFilter: 'blur(14px)',
          borderBottom: '2px solid rgba(232, 121, 154, 0.18)', boxShadow: 'none', color: '#4a2c3a',
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
        standardError:   { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' },
        standardSuccess: { backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color: '#d4547a', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s',
          '&:hover': { color: '#e8799a', textDecoration: 'underline' },
        },
      },
    },

    MuiContainer: {
      styleOverrides: {
        root: { maxWidth: '1200px !important' },
      },
    },
  },
});

export default theme;