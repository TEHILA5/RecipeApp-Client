import { createTheme } from '@mui/material/styles';
import { colors, gradients, shadows, radii, fonts } from '../theme';

const theme = createTheme({
  direction: 'ltr',

  palette: {
    primary: {
      main: colors.pink,
      light: '#fca5a5',
      dark: colors.deepPink,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.gold,
      light: colors.goldLight,
      dark: '#a67239',
      contrastText: colors.white,
    },
    error:   { main: '#dc2626' },
    warning: { main: '#f59e0b' },
    success: { main: '#10b981' },
    background: {
      default: '#fdf0f5',
      paper: colors.white,
    },
    text: {
      primary: colors.text,
      secondary: colors.mid,
    },
  },

  typography: {
    fontFamily: ['Nunito', 'Dancing Script', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'].join(','),
    h1: { fontFamily: fonts.script, fontSize: '3rem',   fontWeight: 700, color: colors.text },
    h2: { fontFamily: fonts.script, fontSize: '2.5rem', fontWeight: 600, color: colors.text },
    h3: { fontSize: '1.75rem', fontWeight: 600, color: colors.text },
    h4: { fontSize: '1.5rem',  fontWeight: 600, color: colors.text },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem',    fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.03em' },
    body1: { fontSize: '1rem', lineHeight: 1.7, color: '#2b1821' },
    body2: { fontSize: '0.9rem', lineHeight: 1.6, color: colors.mid },
  },

  shape: { borderRadius: radii.md },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#fdf0f5',
          backgroundImage: gradients.radialBackground,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.full, padding: '12px 32px', fontSize: '0.9rem',
          fontWeight: 700, textTransform: 'none', boxShadow: 'none', transition: 'all 0.2s ease',
        },
        contained: {
          background: gradients.primary,
          boxShadow: shadows.btn,
          '&:hover': {
            background: gradients.primaryHover,
            boxShadow: shadows.btnHover,
            transform: 'translateY(-3px)',
          },
        },
        outlined: {
          borderColor: colors.pink, borderWidth: 2, color: colors.deepPink,
          '&:hover': { borderWidth: 2, backgroundColor: colors.blush, transform: 'translateY(-3px)' },
        },
        text: {
          color: colors.deepPink,
          '&:hover': { backgroundColor: colors.blush },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radii.lg, boxShadow: '0 8px 24px rgba(212, 84, 122, 0.12)', transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 12px 32px rgba(212, 84, 122, 0.2)', transform: 'translateY(-6px)' },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: radii.md, backgroundColor: '#fdf0f5', transition: 'all 0.2s',
            '&:hover': { backgroundColor: colors.white },
            '&.Mui-focused': {
              backgroundColor: colors.white,
              '& fieldset': { borderColor: colors.pink, borderWidth: 2 },
            },
            '& fieldset': { borderColor: colors.light, borderWidth: 2 },
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: radii.lg, boxShadow: '0 8px 24px rgba(212, 84, 122, 0.1)' },
        elevation3: { boxShadow: '0 12px 32px rgba(212, 84, 122, 0.15)' },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: radii.full, fontWeight: 600 },
        filled: {
          backgroundColor: colors.blush, color: colors.deepPink,
          '&:hover': { backgroundColor: colors.pink, color: colors.white },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 248, 242, 0.93)', backdropFilter: 'blur(14px)',
          borderBottom: '2px solid rgba(232, 121, 154, 0.18)', boxShadow: 'none', color: colors.text,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: radii.md },
        standardError:   { backgroundColor: colors.dangerBg, color: colors.dangerText, border: '1px solid #fecaca' },
        standardSuccess: { backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color: colors.deepPink, textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s',
          '&:hover': { color: colors.pink, textDecoration: 'underline' },
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
