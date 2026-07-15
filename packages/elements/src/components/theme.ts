import { ReglowElement } from '../core/reglow-element.js';

export type RgThemeMode = 'light' | 'dark' | 'system';
export type RgResolvedThemeMode = Exclude<RgThemeMode, 'system'>;
export type RgThemeDensity = 'comfortable' | 'compact';
export type RgThemeMotion = 'full' | 'reduced' | 'system';
export type RgResolvedThemeMotion = Exclude<RgThemeMotion, 'system'>;

export interface RgThemeChangeDetail {
  readonly mode: RgThemeMode;
  readonly resolvedMode: RgResolvedThemeMode;
  readonly previousResolvedMode: RgResolvedThemeMode | null;
  readonly density: RgThemeDensity;
  readonly motion: RgThemeMotion;
  readonly resolvedMotion: RgResolvedThemeMotion;
}

const systemDarkQuery = '(prefers-color-scheme: dark)';
const systemReducedMotionQuery = '(prefers-reduced-motion: reduce)';

function isThemeMode(value: string): value is RgThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

function isThemeDensity(value: string): value is RgThemeDensity {
  return value === 'comfortable' || value === 'compact';
}

function isThemeMotion(value: string): value is RgThemeMotion {
  return value === 'full' || value === 'reduced' || value === 'system';
}

export class RgThemeElement extends ReglowElement {
  static readonly tagName = 'rg-theme' as const;
  static readonly observedAttributes = ['density', 'mode', 'motion'] as const;
  static readonly template = '<div class="root" part="root"><slot></slot></div>';
  static readonly styles = String.raw`
    :host {
      display: block;
      min-width: 0;
      color-scheme: light;
    }

    :host([mode='dark']) { color-scheme: dark; }

    :host([density='compact']) {
      --rg-density-scale: 0.875;
      --rg-control-height-sm: 2rem;
      --rg-control-height-md: 2.5rem;
      --rg-control-height-lg: 3rem;
    }

    :host([motion='reduced']) {
      --rg-duration-fast: 1ms;
      --rg-duration-base: 1ms;
      --rg-duration-slow: 1ms;
      --rg-duration-expressive: 1ms;
    }

    .root {
      min-height: inherit;
      color: var(--_rg-text);
      background: var(--rg-theme-background, transparent);
      transition:
        color var(--_rg-base) var(--_rg-ease),
        background-color var(--_rg-base) var(--_rg-ease);
    }

    @media (prefers-color-scheme: dark) {
      :host(:not([mode])),
      :host([mode='system']) {
        color-scheme: dark;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host(:not([motion])),
      :host([motion='system']) {
        --rg-duration-fast: 1ms;
        --rg-duration-base: 1ms;
        --rg-duration-slow: 1ms;
        --rg-duration-expressive: 1ms;
      }
    }
  `;

  #resolvedMode: RgResolvedThemeMode | null = null;
  #stateSignature = '';

  get mode(): RgThemeMode {
    const value = this.getString('mode', 'system');
    return isThemeMode(value) ? value : 'system';
  }

  set mode(value: RgThemeMode) {
    if (isThemeMode(value)) this.setString('mode', value);
    else this.removeAttribute('mode');
  }

  get resolvedMode(): RgResolvedThemeMode {
    return this.#resolveMode();
  }

  get density(): RgThemeDensity {
    const value = this.getString('density', 'comfortable');
    return isThemeDensity(value) ? value : 'comfortable';
  }

  set density(value: RgThemeDensity) {
    this.setString('density', isThemeDensity(value) && value !== 'comfortable' ? value : null);
  }

  get motion(): RgThemeMotion {
    const value = this.getString('motion', 'system');
    return isThemeMotion(value) ? value : 'system';
  }

  set motion(value: RgThemeMotion) {
    this.setString('motion', isThemeMotion(value) && value !== 'system' ? value : null);
  }

  get resolvedMotion(): RgResolvedThemeMotion {
    if (this.#systemPreference(systemReducedMotionQuery)?.matches) return 'reduced';
    return this.motion === 'reduced' ? 'reduced' : 'full';
  }

  protected onConnect(signal: AbortSignal): void {
    [systemDarkQuery, systemReducedMotionQuery].forEach((query) => {
      const media = this.#systemPreference(query);
      if (media) this.listen(media, 'change', () => this.update('system-preference'), signal);
    });
  }

  protected update(_changedAttribute?: string): void {
    const next = this.#resolveMode();
    const previous = this.#resolvedMode;
    const signature = `${this.mode}:${next}:${this.density}:${this.motion}:${this.resolvedMotion}`;

    this.dataset.rgTheme = this.mode;
    this.dataset.rgResolvedTheme = next;
    this.dataset.rgDensity = this.density;
    this.dataset.rgMotion = this.resolvedMotion;
    this.style.colorScheme = next;

    if (this.#stateSignature === signature) return;

    this.#resolvedMode = next;
    this.#stateSignature = signature;
    this.emit<RgThemeChangeDetail>('rg-theme-change', {
      mode: this.mode,
      resolvedMode: next,
      previousResolvedMode: previous,
      density: this.density,
      motion: this.motion,
      resolvedMotion: this.resolvedMotion,
    });
  }

  #resolveMode(): RgResolvedThemeMode {
    if (this.mode !== 'system') return this.mode;
    return this.#systemPreference(systemDarkQuery)?.matches ? 'dark' : 'light';
  }

  #systemPreference(query: string): MediaQueryList | null {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
    return window.matchMedia(query);
  }
}
