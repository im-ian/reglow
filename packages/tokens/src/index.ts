import './tokens.css';

export const reglowPalette = {
  cloud: '#f5f6f1',
  paper: '#ffffff',
  ink: '#17201b',
  cobalt: '#5367f8',
  cobaltStrong: '#3e50dd',
  coral: '#ff745b',
  mint: '#36c995',
} as const;

export const reglowSpace = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const;

export const reglowRadii = {
  sm: '0.625rem',
  md: '0.875rem',
  lg: '1.25rem',
  xl: '1.75rem',
  pill: '999px',
} as const;

export const reglowMotion = {
  fast: '120ms',
  base: '180ms',
  slow: '280ms',
  expressive: '460ms',
  ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  spring: 'cubic-bezier(0.2, 0.9, 0.25, 1.18)',
} as const;

export type ReglowThemeMode = 'light' | 'dark' | 'system';
