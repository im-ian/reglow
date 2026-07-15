import { FormAssociatedElement } from '../core/form-associated.js';
import { fieldStyles } from '../styles/base.js';

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

export type RgDatePickerSize = 'sm' | 'md' | 'lg';

export class RgDatePickerElement extends FormAssociatedElement {
  static readonly tagName = 'rg-date-picker' as const;
  static readonly observedAttributes = [
    'description',
    'disabled',
    'error',
    'invalid',
    'label',
    'max',
    'min',
    'name',
    'readonly',
    'required',
    'size',
    'step',
    'value',
  ] as const;
  static readonly template = String.raw`
    <div class="field" part="field">
      <div class="label-row" part="label-row">
        <label class="label" part="label"><slot name="label"><span data-label></span></slot></label>
        <span class="optional" data-optional>Optional</span>
      </div>
      <div class="control-wrap" part="control-wrap">
        <input class="control" part="control input" type="date" />
        <svg class="calendar" part="icon" viewBox="0 0 20 20" aria-hidden="true">
          <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
          <path d="M6.5 2.8v3.4M13.5 2.8v3.4M3 8h14" />
        </svg>
      </div>
      <div class="hint" part="description"><slot name="description"><span data-description></span></slot></div>
      <div class="error" part="error" role="alert"><slot name="error"><span data-error></span></slot></div>
    </div>
  `;
  static readonly styles = String.raw`
    ${fieldStyles}
    .control { padding: 0.65rem 2.7rem 0.65rem 0.85rem; color-scheme: light dark; }
    .control::-webkit-calendar-picker-indicator { position: absolute; inset-inline-end: 0.65rem; opacity: 0; cursor: pointer; }
    .calendar {
      position: absolute;
      inset-inline-end: 0.85rem;
      width: 1.15rem;
      height: 1.15rem;
      fill: none;
      stroke: var(--_rg-text-muted);
      stroke-width: 1.6;
      stroke-linecap: round;
      pointer-events: none;
    }
    :host([size='sm']) .control { min-height: 2.25rem; border-radius: var(--rg-radius-sm, 0.7rem); font-size: 0.875rem; }
    :host([size='lg']) .control { min-height: 3.25rem; border-radius: var(--rg-radius-lg, 1.1rem); font-size: 1.0625rem; }
  `;

  #controlId = '';
  #descriptionId = '';
  #errorId = '';
  #capturedInitialValue = false;

  get value(): string {
    return this.getString('value');
  }

  set value(value: string) {
    this.setString('value', value);
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

  get min(): string {
    return this.getString('min');
  }

  set min(value: string) {
    this.setString('min', value);
  }

  get max(): string {
    return this.getString('max');
  }

  set max(value: string) {
    this.setString('max', value);
  }

  get step(): number {
    return Math.max(1, this.getNumber('step', 1));
  }

  set step(value: number) {
    this.setNumber('step', Math.max(1, value));
  }

  get readOnly(): boolean {
    return this.getBoolean('readonly');
  }

  set readOnly(value: boolean) {
    this.setBoolean('readonly', value);
  }

  get invalid(): boolean {
    return this.getBoolean('invalid');
  }

  set invalid(value: boolean) {
    this.setBoolean('invalid', value);
  }

  get size(): RgDatePickerSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgDatePickerSize) {
    this.setString('size', value === 'md' ? null : value);
  }

  protected onMount(): void {
    this.#controlId = this.createId('rg-date-picker');
    this.#descriptionId = `${this.#controlId}-description`;
    this.#errorId = `${this.#controlId}-error`;
    this.query<HTMLInputElement>('.control').id = this.#controlId;
    this.query<HTMLLabelElement>('.label').htmlFor = this.#controlId;
    this.query<HTMLElement>('.hint').id = this.#descriptionId;
    this.query<HTMLElement>('.error').id = this.#errorId;
  }

  protected onConnect(signal: AbortSignal): void {
    const control = this.query<HTMLInputElement>('.control');
    this.listen(control, 'input', (event) => this.#handleNativeEvent(event), signal);
    this.listen(control, 'change', (event) => this.#handleNativeEvent(event), signal);
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.update(), signal);
    });
  }

  protected update(): void {
    const control = this.query<HTMLInputElement>('.control');
    const labelSlot = this.query<HTMLSlotElement>('slot[name="label"]');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const errorSlot = this.query<HTMLSlotElement>('slot[name="error"]');
    const hasLabel = Boolean(this.label) || hasAssignedContent(labelSlot);
    const hasDescription = Boolean(this.description) || hasAssignedContent(descriptionSlot);
    const hasError = Boolean(this.error) || hasAssignedContent(errorSlot);
    const errorMessage = assignedText(errorSlot) || this.error;
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');

    control.value = this.value;
    if (control.value !== this.value) {
      this.setString('value', control.value);
      return;
    }
    control.name = this.name;
    control.min = this.min;
    control.max = this.max;
    control.step = String(this.step);
    control.disabled = disabled;
    control.readOnly = this.readOnly;
    control.required = this.required;
    this.query<HTMLElement>('[data-label]').textContent = this.label;
    this.query<HTMLElement>('[data-description]').textContent = this.description;
    this.query<HTMLElement>('[data-error]').textContent = this.error;
    this.query<HTMLElement>('.label-row').hidden = !hasLabel;
    this.query<HTMLElement>('[data-optional]').hidden = !hasLabel || this.required;
    this.query<HTMLElement>('.hint').hidden = !hasDescription;
    this.query<HTMLElement>('.error').hidden = !hasError;

    control.setCustomValidity(errorMessage || (this.invalid ? 'Invalid date.' : ''));
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
    this.setFormValue(disabled ? null : this.value, this.value);
    if (!this.#capturedInitialValue) {
      this.initialValue = this.value;
      this.#capturedInitialValue = true;
    }
  }

  protected restoreFormValue(value: string): void {
    this.value = value;
  }

  #handleNativeEvent(event: Event): void {
    const control = this.query<HTMLInputElement>('.control');
    if (this.value !== control.value) this.value = control.value;
    else this.update();
    if (!event.composed)
      this.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
  }
}
