/**
 * Single source of truth for design tokens used in JS/TS (MUI theme, etc.).
 * CSS files should use matching custom properties from variables.css.
 */
export const colors = {
  pink: '#e8799a',
  deepPink: '#d4547a',
  deepPinkDark: '#c23d61',
  lightPink: '#f0a8bc',
  blush: '#f9e4ec',
  softPink: '#fdf2f8',
  gold: '#c4894a',
  goldLight: '#e8c49a',
  cream: '#fff8f2',
  white: '#ffffff',
  text: '#4a2c3a',
  textHeading: '#1f2937',
  textBody: '#374151',
  textMuted: '#9ca3af',
  mid: '#9e6b7e',
  light: '#d4a8b8',
  border: '#e5e7eb',
  dangerBg: '#fee2e2',
  dangerText: '#991b1b',
} as const;

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.pink}, ${colors.deepPink})`,
  primaryHover: `linear-gradient(135deg, ${colors.deepPink}, ${colors.deepPinkDark})`,
  headerBand: 'linear-gradient(135deg, rgba(232, 121, 154, 0.08), rgba(232, 196, 154, 0.08))',
  radialBackground: `
    radial-gradient(ellipse at 20% 60%, rgba(232, 196, 154, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 30%, rgba(232, 121, 154, 0.15) 0%, transparent 55%)
  `,
} as const;

export const shadows = {
  sm: '0 2px 10px rgba(212, 84, 122, 0.08)',
  md: '0 4px 20px rgba(212, 84, 122, 0.10)',
  lg: '0 8px 40px rgba(212, 84, 122, 0.15)',
  btn: '0 6px 20px rgba(212, 84, 122, 0.35)',
  btnHover: '0 10px 28px rgba(212, 84, 122, 0.4)',
  btnSm: '0 4px 14px rgba(212, 84, 122, 0.3)',
} as const;

export const layout = {
  navHeight: 72,
  navHeightMobile: 64,
  containerMax: 1200,
  containerWide: 1400,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;

export const fonts = {
  main: "'Nunito', sans-serif",
  script: "'Dancing Script', cursive",
} as const;
