import { ReglowElement } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';

export type RgProgressRingSize = 'sm' | 'md' | 'lg';

export class RgProgressRingElement extends ReglowElement {
  static readonly tagName = 'rg-progress-ring' as const;
  static readonly observedAttributes = [
    'aria-label',
    'label',
    'max',
    'show-value',
    'size',
    'value',
  ] as const;
  static readonly template = String.raw`
    <span class="ring" part="base">
      <progress class="native" part="progress" role="progressbar"></progress>
      <svg class="visual" part="visual" viewBox="0 0 48 48" aria-hidden="true">
        <circle class="track" part="track" cx="24" cy="24" r="20"></circle>
        <circle class="indicator" part="indicator" cx="24" cy="24" r="20"></circle>
      </svg>
      <span class="value" part="value" aria-hidden="true"></span>
    </span>
  `;
  static readonly styles = String.raw`
    ${motionStyles}

    :host { display: inline-flex; vertical-align: middle; }
    .ring { position: relative; display: inline-grid; width: var(--rg-progress-ring-size, 3rem); height: var(--rg-progress-ring-size, 3rem); place-items: center; }
    .native { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    .visual { width: 100%; height: 100%; overflow: visible; transform: rotate(-90deg); }
    circle { fill: none; stroke-width: var(--rg-progress-ring-width, 4); }
    .track { stroke: var(--_rg-surface-sunken); }
    .indicator {
      stroke: var(--_rg-brand);
      stroke-linecap: round;
      stroke-dasharray: 125.664;
      stroke-dashoffset: var(--_rg-progress-ring-offset, 125.664);
      transition: stroke-dashoffset var(--_rg-slow) var(--_rg-spring);
    }
    .value { position: absolute; color: var(--_rg-text); font-size: 0.68rem; font-variant-numeric: tabular-nums; font-weight: 760; }
    :host([size='sm']) .ring { --rg-progress-ring-size: 2rem; }
    :host([size='sm']) .value { font-size: 0.56rem; }
    :host([size='lg']) .ring { --rg-progress-ring-size: 4.25rem; }
    :host([size='lg']) .value { font-size: 0.82rem; }
    :host([data-indeterminate]) .indicator {
      stroke-dasharray: 35 90;
      animation: rg-progress-ring-spin 1.15s linear infinite;
      transform-origin: center;
    }
    @keyframes rg-progress-ring-spin { to { transform: rotate(360deg); } }
  `;

  get value(): number | null {
    const raw = this.getAttribute('value');
    if (raw === null || raw.trim() === '') return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  }

  set value(value: number | null) {
    this.setNumber('value', value);
  }

  get max(): number {
    const max = this.getNumber('max', 100);
    return max > 0 ? max : 100;
  }

  set max(value: number) {
    this.setNumber('max', value);
  }

  get label(): string {
    return this.getString('label');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get size(): RgProgressRingSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgProgressRingSize) {
    this.setString('size', value === 'md' ? null : value);
  }

  get showValue(): boolean {
    return this.getBoolean('show-value');
  }

  set showValue(value: boolean) {
    this.setBoolean('show-value', value);
  }

  protected update(): void {
    const progress = this.query<HTMLProgressElement>('.native');
    const valueLabel = this.query<HTMLElement>('.value');
    const value = this.value;
    const max = this.max;
    const accessibleLabel =
      this.getAttribute('aria-label')?.trim() || this.label.trim() || 'Progress';

    progress.max = max;
    progress.setAttribute('aria-label', accessibleLabel);
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', String(max));

    if (value === null) {
      progress.removeAttribute('value');
      progress.removeAttribute('aria-valuenow');
      progress.removeAttribute('aria-valuetext');
      this.toggleAttribute('data-indeterminate', true);
      this.style.setProperty('--_rg-progress-ring-ratio', '0');
      this.style.setProperty('--_rg-progress-ring-offset', '125.664');
      valueLabel.hidden = true;
      valueLabel.textContent = '';
      return;
    }

    const normalized = Math.min(max, Math.max(0, value));
    const ratio = normalized / max;
    const percentage = Math.round(ratio * 100);
    progress.value = normalized;
    progress.setAttribute('aria-valuenow', String(normalized));
    progress.setAttribute('aria-valuetext', `${percentage}%`);
    this.toggleAttribute('data-indeterminate', false);
    this.style.setProperty('--_rg-progress-ring-ratio', String(ratio));
    this.style.setProperty('--_rg-progress-ring-offset', String(125.664 * (1 - ratio)));
    valueLabel.hidden = !this.showValue;
    valueLabel.textContent = `${percentage}%`;
  }
}
