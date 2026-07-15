import { FormAssociatedElement } from '../core/form-associated.js';
import { fieldStyles } from '../styles/base.js';

export type RgSliderOrientation = 'horizontal' | 'vertical';
export type RgSliderSize = 'sm' | 'md' | 'lg';

function hasAssignedContent(slot: HTMLSlotElement): boolean {
  return slot.assignedNodes({ flatten: true }).some((node) => {
    return node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim());
  });
}

function assignedText(slot: HTMLSlotElement): string {
  return slot
    .assignedNodes({ flatten: true })
    .map((node) => node.textContent ?? '')
    .join(' ')
    .trim();
}

export class RgSliderElement extends FormAssociatedElement {
  static readonly tagName = 'rg-slider' as const;
  static readonly observedAttributes = [
    'description',
    'disabled',
    'error',
    'invalid',
    'label',
    'max',
    'min',
    'name',
    'orientation',
    'required',
    'show-value',
    'size',
    'step',
    'value',
  ] as const;
  static readonly template = String.raw`
    <div class="field" part="field">
      <div class="label-row" part="label-row">
        <label class="label" part="label"><slot name="label"><span data-label></span></slot></label>
        <output class="value" part="value" hidden></output>
      </div>
      <div class="control-wrap" part="control track">
        <input class="range" part="range" type="range" />
      </div>
      <div class="hint" part="description">
        <slot name="description"><span data-description></span></slot>
      </div>
      <div class="error" part="error" role="alert">
        <slot name="error"><span data-error></span></slot>
      </div>
    </div>
  `;
  static readonly styles = String.raw`
    ${fieldStyles}

    :host {
      --_rg-slider-progress: 0%;
      --_rg-slider-track-direction: to right;
      --_rg-slider-thumb-rest-scale: 1;
      --_rg-slider-thumb-hover-scale: 1.12;
      --_rg-slider-thumb-active-scale: 0.92;
    }
    :host(:dir(rtl)) { --_rg-slider-track-direction: to left; }
    :host([orientation='vertical']) { --_rg-slider-track-direction: to top; }
    :host([size='sm']) {
      --_rg-slider-thumb-rest-scale: 0.86;
      --_rg-slider-thumb-hover-scale: 0.96;
      --_rg-slider-thumb-active-scale: 0.8;
    }
    :host([size='lg']) {
      --_rg-slider-thumb-rest-scale: 1.14;
      --_rg-slider-thumb-hover-scale: 1.24;
      --_rg-slider-thumb-active-scale: 1.04;
    }
    .control-wrap { min-height: 2rem; }
    .range {
      width: 100%;
      height: 1.5rem;
      margin: 0;
      appearance: none;
      background: transparent;
      cursor: pointer;
    }
    .range::-webkit-slider-runnable-track {
      height: 0.48rem;
      border-radius: 999px;
      background: linear-gradient(
        var(--_rg-slider-track-direction),
        var(--_rg-brand) 0 var(--_rg-slider-progress),
        var(--_rg-surface-sunken) var(--_rg-slider-progress) 100%
      );
      box-shadow: inset 0 1px 2px rgb(23 32 27 / 10%);
    }
    .range::-moz-range-track {
      height: 0.48rem;
      border-radius: 999px;
      background: var(--_rg-surface-sunken);
      box-shadow: inset 0 1px 2px rgb(23 32 27 / 10%);
    }
    .range::-moz-range-progress { height: 0.48rem; border-radius: 999px; background: var(--_rg-brand); }
    .range::-webkit-slider-thumb {
      width: 1.25rem;
      height: 1.25rem;
      margin-block-start: -0.39rem;
      appearance: none;
      border: 0.22rem solid var(--_rg-brand);
      border-radius: 50%;
      background: var(--_rg-surface-raised);
      box-shadow: var(--_rg-shadow-sm);
      transform: scale(var(--_rg-slider-thumb-rest-scale));
      transition: transform var(--_rg-base) var(--_rg-spring), box-shadow var(--_rg-base) var(--_rg-ease);
    }
    .range::-moz-range-thumb {
      width: 0.82rem;
      height: 0.82rem;
      border: 0.22rem solid var(--_rg-brand);
      border-radius: 50%;
      background: var(--_rg-surface-raised);
      box-shadow: var(--_rg-shadow-sm);
      transform: scale(var(--_rg-slider-thumb-rest-scale));
      transition: transform var(--_rg-base) var(--_rg-spring), box-shadow var(--_rg-base) var(--_rg-ease);
    }
    .range:not(:disabled):hover::-webkit-slider-thumb { transform: scale(var(--_rg-slider-thumb-hover-scale)); box-shadow: var(--_rg-shadow-glow); }
    .range:not(:disabled):hover::-moz-range-thumb { transform: scale(var(--_rg-slider-thumb-hover-scale)); box-shadow: var(--_rg-shadow-glow); }
    .range:active::-webkit-slider-thumb {
      transform: scale(var(--_rg-slider-thumb-active-scale));
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    .range:active::-moz-range-thumb {
      transform: scale(var(--_rg-slider-thumb-active-scale));
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    .range:focus-visible { outline: none; }
    .range:focus-visible::-webkit-slider-thumb { box-shadow: var(--_rg-ring), var(--_rg-shadow-sm); }
    .range:focus-visible::-moz-range-thumb { box-shadow: var(--_rg-ring), var(--_rg-shadow-sm); }
    .range:disabled { cursor: not-allowed; opacity: 0.52; }
    .value {
      min-width: 2.5rem;
      padding: 0.18rem 0.48rem;
      border-radius: 999px;
      color: var(--_rg-brand);
      background: var(--_rg-brand-soft);
      font-size: 0.75rem;
      font-variant-numeric: tabular-nums;
      font-weight: 750;
      text-align: center;
      animation: rg-slider-value-in var(--_rg-slow) var(--_rg-spring);
    }
    :host([orientation='vertical']) .field { grid-template-columns: auto minmax(0, 1fr); align-items: center; }
    :host([orientation='vertical']) .label-row,
    :host([orientation='vertical']) .hint,
    :host([orientation='vertical']) .error { grid-column: 1 / -1; }
    :host([orientation='vertical']) .control-wrap { min-width: 2rem; min-height: 10rem; justify-content: center; }
    :host([orientation='vertical']) .range {
      width: 1.5rem;
      height: 10rem;
      writing-mode: vertical-lr;
      direction: rtl;
    }
    :host([invalid]) .range, .range[aria-invalid='true'] { accent-color: var(--_rg-danger); }

    @keyframes rg-slider-value-in {
      from { opacity: 0; transform: translateY(0.2rem) scale(0.9); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;

  #controlId = '';
  #descriptionId = '';
  #errorId = '';

  get min(): number {
    return this.#numberAttribute('min', 0);
  }

  set min(value: number) {
    this.setNumber('min', value);
  }

  get max(): number {
    return this.#numberAttribute('max', 100);
  }

  set max(value: number) {
    this.setNumber('max', value);
  }

  get step(): number {
    const value = this.#numberAttribute('step', 1);
    return value > 0 ? value : 1;
  }

  set step(value: number) {
    if (!Number.isFinite(value) || value <= 0) this.removeAttribute('step');
    else this.setNumber('step', value);
  }

  get value(): number {
    const minimum = Math.min(this.min, this.max);
    const maximum = Math.max(this.min, this.max);
    const value = Math.min(maximum, Math.max(minimum, this.#numberAttribute('value', minimum)));
    const snapped = minimum + Math.round((value - minimum) / this.step) * this.step;
    return Math.min(maximum, Math.max(minimum, Number(snapped.toPrecision(12))));
  }

  set value(value: number) {
    this.setNumber('value', value);
  }

  get label(): string {
    return this.getString('label');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get description(): string {
    return this.getString('description');
  }

  set description(value: string) {
    this.setString('description', value);
  }

  get error(): string {
    return this.getString('error');
  }

  set error(value: string) {
    this.setString('error', value);
  }

  get invalid(): boolean {
    return this.getBoolean('invalid');
  }

  set invalid(value: boolean) {
    this.setBoolean('invalid', value);
  }

  get showValue(): boolean {
    return this.getBoolean('show-value');
  }

  set showValue(value: boolean) {
    this.setBoolean('show-value', value);
  }

  get orientation(): RgSliderOrientation {
    return this.getString('orientation', 'horizontal') === 'vertical' ? 'vertical' : 'horizontal';
  }

  set orientation(value: RgSliderOrientation) {
    this.setString('orientation', value);
  }

  get size(): RgSliderSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgSliderSize) {
    this.setString('size', value);
  }

  protected onMount(): void {
    this.#controlId = this.createId('rg-slider');
    this.#descriptionId = `${this.#controlId}-description`;
    this.#errorId = `${this.#controlId}-error`;
    this.initialValue = String(this.value);

    this.query<HTMLInputElement>('.range').id = this.#controlId;
    this.query<HTMLLabelElement>('.label').htmlFor = this.#controlId;
    this.query<HTMLOutputElement>('.value').setAttribute('for', this.#controlId);
    this.query<HTMLElement>('.hint').id = this.#descriptionId;
    this.query<HTMLElement>('.error').id = this.#errorId;
  }

  protected onConnect(signal: AbortSignal): void {
    const control = this.query<HTMLInputElement>('.range');
    this.listen(control, 'input', (event) => this.#handleNativeEvent(event), signal);
    this.listen(control, 'change', (event) => this.#handleNativeEvent(event), signal);

    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.update('slot'), signal);
    });

    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => this.update('slotted-content'));
      observer.observe(this, { childList: true, characterData: true, subtree: true });
      signal.addEventListener('abort', () => observer.disconnect(), { once: true });
    }
  }

  protected update(_changedAttribute?: string): void {
    if (!this.shadowRoot) return;
    const control = this.query<HTMLInputElement>('.range');
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');
    const labelSlot = this.query<HTMLSlotElement>('slot[name="label"]');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const errorSlot = this.query<HTMLSlotElement>('slot[name="error"]');
    const hasLabel = Boolean(this.label) || hasAssignedContent(labelSlot);
    const hasDescription = Boolean(this.description) || hasAssignedContent(descriptionSlot);
    const hasError = Boolean(this.error) || hasAssignedContent(errorSlot);
    const errorMessage = assignedText(errorSlot) || this.error;

    control.name = this.name;
    const minimum = Math.min(this.min, this.max);
    const maximum = Math.max(this.min, this.max);
    control.min = String(minimum);
    control.max = String(maximum);
    control.step = String(this.step);
    control.disabled = disabled;
    control.required = this.required;
    control.value = String(this.value);
    this.query<HTMLElement>('[data-label]').textContent = this.label;
    this.query<HTMLElement>('[data-description]').textContent = this.description;
    this.query<HTMLElement>('[data-error]').textContent = this.error;
    this.query<HTMLElement>('.label-row').hidden = !hasLabel && !this.showValue;
    this.query<HTMLElement>('.label').hidden = !hasLabel;
    this.query<HTMLElement>('.hint').hidden = !hasDescription;
    this.query<HTMLElement>('.error').hidden = !hasError;

    const output = this.query<HTMLOutputElement>('.value');
    output.hidden = !this.showValue;
    output.value = control.value;
    control.setAttribute('aria-orientation', this.orientation);
    control.setCustomValidity(errorMessage || (this.invalid ? 'Invalid value.' : ''));
    this.mirrorValidity(control);
    const isInvalid = !control.validity.valid;
    control.setAttribute('aria-invalid', String(isInvalid));
    if (hasError && isInvalid) control.setAttribute('aria-errormessage', this.#errorId);
    else control.removeAttribute('aria-errormessage');
    const describedBy = [hasDescription ? this.#descriptionId : '', hasError ? this.#errorId : '']
      .filter(Boolean)
      .join(' ');
    if (describedBy) control.setAttribute('aria-describedby', describedBy);
    else control.removeAttribute('aria-describedby');

    const range = maximum - minimum;
    const progress = range === 0 ? 0 : ((Number(control.value) - minimum) / range) * 100;
    this.style.setProperty('--_rg-slider-progress', `${Math.min(100, Math.max(0, progress))}%`);
    this.setFormValue(disabled ? null : control.value, control.value);
  }

  protected restoreFormValue(value: string): void {
    this.value = Number(value);
  }

  #handleNativeEvent(event: Event): void {
    const control = this.query<HTMLInputElement>('.range');
    const value = Number(control.value);
    if (this.value !== value) this.value = value;
    else this.update('value');

    if (!event.composed) {
      this.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
    }
  }

  #numberAttribute(name: string, fallback: number): number {
    const raw = this.getAttribute(name);
    if (raw === null || raw.trim() === '') return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }
}
