import { ReglowElement } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';

export class RgProgressElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-progress';
  static readonly observedAttributes = ['aria-label', 'value', 'max', 'label'];
  static readonly styles = String.raw`
    ${motionStyles}

    :host { display: block; }
    .progress { display: grid; gap: 0.45rem; }
    .meta { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
    .label { color: var(--_rg-text); font-size: 0.8rem; font-weight: 680; }
    .value { color: var(--_rg-text-muted); font-size: 0.75rem; font-variant-numeric: tabular-nums; }
    .track {
      position: relative;
      height: var(--rg-progress-height, 0.6rem);
      overflow: hidden;
      border-radius: 999px;
      background: var(--_rg-surface-sunken);
      box-shadow: inset 0 1px 2px rgb(23 32 27 / 8%);
    }
    .indicator {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--_rg-brand), color-mix(in srgb, var(--_rg-brand) 78%, var(--_rg-accent)));
      box-shadow: 0 1px 4px rgb(83 103 248 / 28%);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform var(--_rg-slow) var(--_rg-spring);
    }
    :host(:dir(rtl)) .indicator {
      background: linear-gradient(270deg, var(--_rg-brand), color-mix(in srgb, var(--_rg-brand) 78%, var(--_rg-accent)));
      transform-origin: right center;
    }
    :host([data-indeterminate]) .indicator {
      inset-inline: -45%;
      transform: translateX(-40%);
      animation: rg-progress-indeterminate 1.35s var(--_rg-ease) infinite;
    }
    @keyframes rg-progress-indeterminate {
      0% { transform: translateX(-45%); }
      100% { transform: translateX(145%); }
    }
    :host(:dir(rtl)[data-indeterminate]) .indicator {
      animation-name: rg-progress-indeterminate-rtl;
    }
    @keyframes rg-progress-indeterminate-rtl {
      0% { transform: translateX(45%); }
      100% { transform: translateX(-145%); }
    }
    slot[name='label']:not([data-has-content]) { display: none; }
    .meta[data-empty] { display: none; }
  `;
  static readonly template = String.raw`
    <div class="progress" part="base">
      <div class="meta" part="meta">
        <span class="label" part="label"><slot name="label"></slot><span data-label></span></span>
        <span class="value" part="value" data-value></span>
      </div>
      <div class="track" part="track">
        <span class="indicator" part="indicator"></span>
      </div>
    </div>
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

  protected onConnect(signal: AbortSignal): void {
    const slot = this.query<HTMLSlotElement>('slot[name="label"]');
    this.listen(slot, 'slotchange', () => this.update(), signal);
  }

  protected update(): void {
    const progress = this.query<HTMLElement>('.progress');
    const meta = this.query<HTMLElement>('.meta');
    const labelSlot = this.query<HTMLSlotElement>('slot[name="label"]');
    const labelText = this.query<HTMLElement>('[data-label]');
    const valueText = this.query<HTMLElement>('[data-value]');
    const indicator = this.query<HTMLElement>('.indicator');
    const value = this.value;
    const max = this.max;
    const hasSlottedLabel = labelSlot.assignedNodes({ flatten: true }).length > 0;
    const hasLabel = hasSlottedLabel || this.label.length > 0;
    const accessibleLabel =
      this.getAttribute('aria-label')?.trim() ||
      this.label.trim() ||
      this.assignedText(labelSlot) ||
      'Progress';

    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', String(max));
    progress.setAttribute('aria-label', accessibleLabel);
    labelText.textContent = hasSlottedLabel ? '' : this.label;
    labelSlot.toggleAttribute('data-has-content', hasSlottedLabel);
    meta.toggleAttribute('data-empty', !hasLabel);

    if (value === null) {
      this.toggleAttribute('data-indeterminate', true);
      progress.removeAttribute('aria-valuenow');
      progress.removeAttribute('aria-valuetext');
      valueText.textContent = '';
      indicator.style.removeProperty('transform');
      return;
    }

    const normalized = Math.min(max, Math.max(0, value));
    const ratio = normalized / max;
    const percentage = Math.round(ratio * 100);
    this.toggleAttribute('data-indeterminate', false);
    progress.setAttribute('aria-valuenow', String(normalized));
    progress.setAttribute('aria-valuetext', `${percentage}%`);
    valueText.textContent = hasLabel ? `${percentage}%` : '';
    indicator.style.transform = `scaleX(${ratio})`;
  }

  private assignedText(slot: HTMLSlotElement): string {
    return slot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
  }
}

export class RgSpinnerElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-spinner';
  static readonly observedAttributes = ['size', 'label'];
  static readonly styles = String.raw`
    ${motionStyles}

    :host { display: inline-flex; vertical-align: middle; }
    .spinner {
      display: inline-grid;
      width: var(--rg-spinner-size, 1.25rem);
      height: var(--rg-spinner-size, 1.25rem);
      place-items: center;
    }
    .indicator {
      width: 100%;
      height: 100%;
      border: max(2px, 0.12em) solid color-mix(in srgb, currentColor 22%, transparent);
      border-top-color: currentColor;
      border-radius: 999px;
      animation: rg-spin 0.72s linear infinite;
    }
    :host([size='sm']) .spinner { --rg-spinner-size: 1rem; }
    :host([size='lg']) .spinner { --rg-spinner-size: 1.65rem; }
    .label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  `;
  static readonly template = String.raw`
    <span class="spinner" part="base">
      <span class="indicator" part="indicator"></span>
      <span class="label" data-label></span>
    </span>
  `;

  get label(): string {
    return this.getString('label');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  protected update(): void {
    const spinner = this.query<HTMLElement>('.spinner');
    const label = this.query<HTMLElement>('[data-label]');
    label.textContent = this.label;

    if (this.label) {
      spinner.setAttribute('role', 'status');
      spinner.removeAttribute('aria-hidden');
      spinner.setAttribute('aria-label', this.label);
    } else {
      spinner.removeAttribute('role');
      spinner.removeAttribute('aria-label');
      spinner.setAttribute('aria-hidden', 'true');
    }
  }
}
