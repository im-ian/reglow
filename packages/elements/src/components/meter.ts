import { ReglowElement } from '../core/reglow-element.js';

export type RgMeterTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
export type RgMeterSize = 'sm' | 'md' | 'lg';

const meterTones = new Set<RgMeterTone>(['neutral', 'brand', 'success', 'warning', 'danger']);
const meterSizes = new Set<RgMeterSize>(['sm', 'md', 'lg']);

export class RgMeterElement extends ReglowElement {
  static readonly tagName = 'rg-meter' as const;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = [
    'aria-label',
    'high',
    'label',
    'low',
    'max',
    'min',
    'optimum',
    'show-value',
    'size',
    'tone',
    'value',
    'value-text',
  ] as const;
  static readonly template = String.raw`
    <div class="meter" part="base">
      <div class="meta" part="meta">
        <span class="label" part="label"><slot name="label"></slot><span data-label></span></span>
        <span class="value" part="value"></span>
      </div>
      <meter class="native" part="meter"></meter>
      <div class="track" part="track" aria-hidden="true">
        <span class="indicator" part="indicator"></span>
      </div>
    </div>
  `;
  static readonly styles = String.raw`
    :host {
      --_rg-meter-tone: var(--_rg-brand);
      display: block;
    }

    .meter { display: grid; gap: 0.45rem; }
    .meta { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
    .meta[data-empty] { display: none; }
    .label { min-width: 0; color: var(--_rg-text); font-size: 0.8rem; font-weight: 680; }
    .value { flex: 0 0 auto; color: var(--_rg-text-muted); font-size: 0.75rem; font-variant-numeric: tabular-nums; }
    .native { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    .track {
      position: relative;
      height: var(--rg-meter-height, 0.6rem);
      overflow: hidden;
      border-radius: var(--rg-radius-pill, 999px);
      background: var(--_rg-surface-sunken);
      box-shadow: inset 0 1px 2px rgb(23 32 27 / 8%);
    }
    .indicator {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(90deg, color-mix(in srgb, var(--_rg-meter-tone) 72%, var(--_rg-surface)), var(--_rg-meter-tone));
      box-shadow: 0 1px 4px color-mix(in srgb, var(--_rg-meter-tone) 28%, transparent);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform var(--_rg-slow) var(--_rg-spring);
    }
    :host(:dir(rtl)) .indicator {
      background: linear-gradient(270deg, color-mix(in srgb, var(--_rg-meter-tone) 72%, var(--_rg-surface)), var(--_rg-meter-tone));
      transform-origin: right center;
    }
    :host([tone='neutral']) { --_rg-meter-tone: var(--_rg-text-muted); }
    :host([tone='success']) { --_rg-meter-tone: var(--_rg-success); }
    :host([tone='warning']) { --_rg-meter-tone: var(--_rg-warning); }
    :host([tone='danger']) { --_rg-meter-tone: var(--_rg-danger); }
    :host([size='sm']) .track { --rg-meter-height: 0.4rem; }
    :host([size='lg']) .track { --rg-meter-height: 0.8rem; }
    slot[name='label']:not([data-has-content]) { display: none; }

    @media (forced-colors: active) {
      .track { border: 1px solid CanvasText; }
      .indicator { background: Highlight; }
    }
  `;

  get value(): number {
    return Math.min(this.max, Math.max(this.min, this.getNumber('value', this.min)));
  }

  set value(value: number) {
    this.setNumber('value', value);
  }

  get min(): number {
    return this.getNumber('min', 0);
  }

  set min(value: number) {
    this.setNumber('min', value);
  }

  get max(): number {
    const candidate = this.getNumber('max', 100);
    return candidate > this.min ? candidate : this.min + 1;
  }

  set max(value: number) {
    this.setNumber('max', value);
  }

  get low(): number {
    return Math.min(this.max, Math.max(this.min, this.getNumber('low', this.min)));
  }

  set low(value: number) {
    this.setNumber('low', value);
  }

  get high(): number {
    return Math.min(this.max, Math.max(this.low, this.getNumber('high', this.max)));
  }

  set high(value: number) {
    this.setNumber('high', value);
  }

  get optimum(): number {
    const fallback = this.min + (this.max - this.min) / 2;
    return Math.min(this.max, Math.max(this.min, this.getNumber('optimum', fallback)));
  }

  set optimum(value: number) {
    this.setNumber('optimum', value);
  }

  get label(): string {
    return this.getString('label');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get valueText(): string {
    return this.getString('value-text');
  }

  set valueText(value: string) {
    this.setString('value-text', value);
  }

  get showValue(): boolean {
    return this.getBoolean('show-value');
  }

  set showValue(value: boolean) {
    this.setBoolean('show-value', value);
  }

  get tone(): RgMeterTone {
    const value = this.getString('tone', 'brand') as RgMeterTone;
    return meterTones.has(value) ? value : 'brand';
  }

  set tone(value: RgMeterTone) {
    this.setString('tone', meterTones.has(value) && value !== 'brand' ? value : null);
  }

  get size(): RgMeterSize {
    const value = this.getString('size', 'md') as RgMeterSize;
    return meterSizes.has(value) ? value : 'md';
  }

  set size(value: RgMeterSize) {
    this.setString('size', meterSizes.has(value) && value !== 'md' ? value : null);
  }

  protected onConnect(signal: AbortSignal): void {
    const slot = this.query<HTMLSlotElement>('slot[name="label"]');
    this.listen(slot, 'slotchange', () => this.update(), signal);
  }

  protected update(): void {
    const native = this.query<HTMLMeterElement>('meter');
    const labelSlot = this.query<HTMLSlotElement>('slot[name="label"]');
    const labelText = this.query<HTMLElement>('[data-label]');
    const valueText = this.query<HTMLElement>('.value');
    const meta = this.query<HTMLElement>('.meta');
    const indicator = this.query<HTMLElement>('.indicator');
    const hasSlottedLabel = labelSlot.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
    });
    const assignedLabel = labelSlot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
    const accessibleLabel =
      this.getAttribute('aria-label')?.trim() || this.label.trim() || assignedLabel || 'Meter';
    const percentage = Math.round(((this.value - this.min) / (this.max - this.min)) * 100);
    const accessibleValue = this.valueText.trim() || `${percentage}%`;

    native.min = this.min;
    native.max = this.max;
    native.low = this.low;
    native.high = this.high;
    native.optimum = this.optimum;
    native.value = this.value;
    native.setAttribute('aria-label', accessibleLabel);
    native.setAttribute('aria-valuetext', accessibleValue);

    labelSlot.toggleAttribute('data-has-content', hasSlottedLabel);
    labelText.textContent = hasSlottedLabel ? '' : this.label;
    valueText.textContent = this.showValue ? accessibleValue : '';
    valueText.hidden = !this.showValue;
    meta.toggleAttribute('data-empty', !hasSlottedLabel && !this.label && !this.showValue);
    indicator.style.transform = `scaleX(${(this.value - this.min) / (this.max - this.min)})`;
  }
}
