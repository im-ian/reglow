export const baseStyles = String.raw`
  :host {
    --_rg-canvas: var(--rg-color-canvas, #f5f6f1);
    --_rg-canvas-subtle: var(--rg-color-canvas-subtle, #eef1e9);
    --_rg-surface: var(--rg-color-surface, #fff);
    --_rg-surface-raised: var(--rg-color-surface-raised, #fff);
    --_rg-surface-sunken: var(--rg-color-surface-sunken, #e8ece4);
    --_rg-text: var(--rg-color-text, #17201b);
    --_rg-text-muted: var(--rg-color-text-muted, #657068);
    --_rg-text-subtle: var(--rg-color-text-subtle, #8b958e);
    --_rg-border: var(--rg-color-border, #dce2da);
    --_rg-border-strong: var(--rg-color-border-strong, #bdc7bf);
    --_rg-brand: var(--rg-color-brand, #5367f8);
    --_rg-brand-hover: var(--rg-color-brand-hover, #4659e8);
    --_rg-brand-active: var(--rg-color-brand-active, #3e50dd);
    --_rg-brand-text: var(--rg-color-brand-text, var(--_rg-brand-active));
    --_rg-on-brand: var(--rg-color-on-brand, #fff);
    --_rg-brand-soft: var(--rg-color-brand-soft, #e7eaff);
    --_rg-accent: var(--rg-color-accent, #ff745b);
    --_rg-accent-soft: var(--rg-color-accent-soft, #ffe9e3);
    --_rg-success: var(--rg-color-success, #217a56);
    --_rg-success-soft: var(--rg-color-success-soft, #dcf5e9);
    --_rg-warning: var(--rg-color-warning, #9b5d16);
    --_rg-warning-soft: var(--rg-color-warning-soft, #fff0d7);
    --_rg-danger: var(--rg-color-danger, #c84050);
    --_rg-danger-text: var(--rg-color-danger-text, var(--_rg-danger));
    --_rg-danger-soft: var(--rg-color-danger-soft, #ffe3e6);
    --_rg-focus: var(--rg-color-focus, #6d7dff);
    --_rg-overlay: var(--rg-color-overlay, rgb(18 25 21 / 48%));
    --_rg-shadow-xs: var(--rg-shadow-xs, 0 1px 2px rgb(23 32 27 / 7%));
    --_rg-shadow-sm: var(--rg-shadow-sm, 0 2px 4px rgb(23 32 27 / 6%), 0 10px 24px rgb(23 32 27 / 7%));
    --_rg-shadow-md: var(--rg-shadow-md, 0 4px 8px rgb(23 32 27 / 7%), 0 20px 48px rgb(23 32 27 / 12%));
    --_rg-shadow-glow: var(--rg-shadow-glow, 0 0 0 1px rgb(83 103 248 / 8%), 0 16px 40px rgb(83 103 248 / 18%));
    --_rg-ring: var(--rg-focus-ring, 0 0 0 3px rgb(83 103 248 / 28%));
    --_rg-fast: var(--rg-duration-fast, 120ms);
    --_rg-base: var(--rg-duration-base, 180ms);
    --_rg-slow: var(--rg-duration-slow, 280ms);
    --_rg-expressive: var(--rg-duration-expressive, 460ms);
    --_rg-ease: var(--rg-ease-standard, cubic-bezier(0.2, 0.8, 0.2, 1));
    --_rg-spring: var(--rg-ease-spring, cubic-bezier(0.2, 0.9, 0.25, 1.18));
    box-sizing: border-box;
    color: var(--_rg-text);
    font-family: var(--rg-font-sans, 'Manrope Variable', 'Pretendard Variable', ui-rounded, system-ui, sans-serif);
    line-height: 1.5;
    -webkit-tap-highlight-color: transparent;
  }

  *, *::before, *::after { box-sizing: border-box; }
  [hidden] { display: none !important; }
  button, input, textarea, select { font: inherit; }
  button { -webkit-tap-highlight-color: transparent; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      scroll-behavior: auto !important;
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 1ms !important;
    }
  }
`;

export const focusRingStyles = String.raw`
  outline: none;
  box-shadow: var(--_rg-ring);
`;

export const fieldStyles = String.raw`
  :host { display: block; }
  .field { display: grid; gap: 0.4rem; }
  .label-row { display: flex; align-items: baseline; justify-content: space-between; gap: 0.75rem; }
  .label { color: var(--_rg-text); font-size: 0.875rem; font-weight: 720; letter-spacing: -0.012em; }
  .optional { color: var(--_rg-text-subtle); font-size: 0.75rem; font-weight: 600; }
  .hint { color: var(--_rg-text-muted); font-size: 0.78rem; line-height: 1.4; }
  .error { color: var(--_rg-danger); font-size: 0.78rem; font-weight: 650; line-height: 1.4; }
  .control-wrap { position: relative; display: flex; align-items: center; }
  .control {
    width: 100%; min-height: 2.75rem; border: 1px solid var(--_rg-border); border-radius: var(--rg-radius-md, 0.875rem);
    color: var(--_rg-text); background: var(--_rg-surface); box-shadow: var(--_rg-shadow-xs);
    transition: border-color var(--_rg-base) var(--_rg-ease), box-shadow var(--_rg-base) var(--_rg-ease),
      background var(--_rg-base) var(--_rg-ease), transform var(--_rg-fast) var(--_rg-ease);
  }
  .control:hover:not(:disabled) { border-color: var(--_rg-border-strong); }
  .control:focus-visible { outline: none; border-color: var(--_rg-focus); box-shadow: var(--_rg-ring), var(--_rg-shadow-xs); }
  .control:disabled { cursor: not-allowed; opacity: 0.52; background: var(--_rg-surface-sunken); }
  :host([invalid]) .control, .control[aria-invalid='true'] { border-color: var(--_rg-danger); }
`;

export const motionStyles = String.raw`
  @keyframes rg-pop-in {
    0% { opacity: 0; transform: translateY(0.5rem) scale(0.96); }
    60% { opacity: 1; transform: translateY(-0.08rem) scale(1.01); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes rg-slide-up {
    from { opacity: 0; transform: translateY(1rem); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes rg-spin { to { transform: rotate(360deg); } }
  @keyframes rg-pulse { 50% { opacity: 0.48; } }
  @keyframes rg-shimmer { to { transform: translateX(100%); } }
`;
