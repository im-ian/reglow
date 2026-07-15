import { afterEach, describe, expect, it, vi } from 'vitest';
import { RgThemeElement } from '../src/index.js';
import '../src/register.js';

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  document.body.replaceChildren();
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: originalMatchMedia,
  });
});

describe('theme preference regressions', () => {
  it('reports the effective reduced-motion state when the OS requests it', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const theme = document.createElement('rg-theme') as RgThemeElement;
    theme.motion = 'full';
    document.body.append(theme);

    expect(theme.resolvedMotion).toBe('reduced');
    expect(theme.dataset.rgMotion).toBe('reduced');
  });
});
