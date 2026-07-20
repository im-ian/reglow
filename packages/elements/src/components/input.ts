import { FormAssociatedElement } from '../core/form-associated.js';
import { fieldStyles } from '../styles/base.js';

export type RgInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
export type RgInputSize = 'sm' | 'md' | 'lg';

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

export class RgInputElement extends FormAssociatedElement {
  static readonly tagName = 'rg-input' as const;
  static readonly observedAttributes = [
    'autocomplete',
    'clearable',
    'description',
    'disabled',
    'error',
    'inputmode',
    'invalid',
    'label',
    'max',
    'maxlength',
    'min',
    'minlength',
    'name',
    'pattern',
    'placeholder',
    'readonly',
    'required',
    'size',
    'step',
    'type',
    'value',
  ] as const;
  static readonly template = String.raw`
    <div class="field" part="field">
      <div class="label-row" part="label-row">
        <label class="label" part="label">
          <slot name="label"><span data-label></span></slot>
        </label>
        <span class="optional" data-optional>Optional</span>
      </div>
      <div class="control-wrap" part="control-wrap">
        <span class="affix affix-start" part="start" data-start><slot name="start"></slot></span>
        <input class="control" part="control input" />
        <button class="clear" part="clear" type="button" aria-label="Clear input" hidden>
          <span aria-hidden="true">×</span>
        </button>
        <span class="affix affix-end" part="end" data-end><slot name="end"></slot></span>
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

    :host([size='sm']) .control { min-height: 2.25rem; border-radius: var(--rg-radius-sm, 0.7rem); font-size: 0.875rem; }
    :host([size='lg']) .control { min-height: 3.25rem; border-radius: var(--rg-radius-lg, 1.1rem); font-size: 1.0625rem; }

    .control { padding: 0.65rem 0.85rem; }
    .control-wrap[data-has-start] .control { padding-inline-start: 2.65rem; }
    .control-wrap[data-has-end] .control { padding-inline-end: 2.65rem; }
    .control-wrap[data-has-clear] .control { padding-inline-end: 2.65rem; }
    .control-wrap[data-has-end][data-has-clear] .control { padding-inline-end: 4.75rem; }

    .affix {
      position: absolute;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--_rg-text-muted);
      pointer-events: none;
    }
    .affix-start { inset-inline-start: 0.85rem; }
    .affix-end { inset-inline-end: 0.85rem; }

    .clear {
      position: absolute;
      z-index: 2;
      inset-inline-end: 0.55rem;
      display: grid;
      width: 1.7rem;
      height: 1.7rem;
      padding: 0;
      border: 0;
      border-radius: 999px;
      place-items: center;
      color: var(--_rg-text-muted);
      background: var(--_rg-surface-sunken);
      cursor: pointer;
      transition:
        color var(--_rg-fast) var(--_rg-ease),
        background var(--_rg-fast) var(--_rg-ease),
        transform var(--_rg-base) var(--_rg-spring);
    }
    .control-wrap[data-has-end] .clear { inset-inline-end: 2.65rem; }
    .clear:hover { color: var(--_rg-text); background: var(--_rg-brand-soft); transform: scale(1.08); }
    .clear:active {
      transform: scale(0.9);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    .clear:focus-visible { outline: none; box-shadow: var(--_rg-ring); }

    ::slotted([slot='start']), ::slotted([slot='end']) { display: inline-flex; }
  `;

  #controlId = '';
  #descriptionId = '';
  #errorId = '';

  get value(): string {
    return this.getAttribute('value') ?? '';
  }

  set value(value: string | number | null | undefined) {
    this.setLiveString('value', value);
  }

  get type(): RgInputType {
    const value = this.getString('type', 'text');
    return value === 'email' ||
      value === 'password' ||
      value === 'search' ||
      value === 'tel' ||
      value === 'url' ||
      value === 'number'
      ? value
      : 'text';
  }

  set type(value: RgInputType) {
    this.setString('type', value);
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

  get placeholder(): string {
    return this.getString('placeholder');
  }

  set placeholder(value: string) {
    this.setString('placeholder', value);
  }

  get readOnly(): boolean {
    return this.getBoolean('readonly');
  }

  set readOnly(value: boolean) {
    this.setBoolean('readonly', value);
  }

  get clearable(): boolean {
    return this.getBoolean('clearable');
  }

  set clearable(value: boolean) {
    this.setBoolean('clearable', value);
  }

  get invalid(): boolean {
    return this.getBoolean('invalid');
  }

  set invalid(value: boolean) {
    this.setBoolean('invalid', value);
  }

  get size(): RgInputSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgInputSize) {
    this.setString('size', value);
  }

  get min(): string {
    return this.getString('min');
  }

  set min(value: string | number) {
    this.setAttribute('min', String(value));
  }

  get max(): string {
    return this.getString('max');
  }

  set max(value: string | number) {
    this.setAttribute('max', String(value));
  }

  get step(): string {
    return this.getString('step');
  }

  set step(value: string | number) {
    this.setAttribute('step', String(value));
  }

  get minLength(): number {
    return this.#integerAttribute('minlength');
  }

  set minLength(value: number) {
    this.#setIntegerAttribute('minlength', value);
  }

  get maxLength(): number {
    return this.#integerAttribute('maxlength');
  }

  set maxLength(value: number) {
    this.#setIntegerAttribute('maxlength', value);
  }

  get pattern(): string {
    return this.getString('pattern');
  }

  set pattern(value: string) {
    this.setString('pattern', value);
  }

  get autocomplete(): string {
    return this.getString('autocomplete');
  }

  set autocomplete(value: string) {
    this.setString('autocomplete', value);
  }

  get inputmode(): string {
    return this.getString('inputmode');
  }

  set inputmode(value: string) {
    this.setString('inputmode', value);
  }

  protected onMount(): void {
    this.#controlId = this.createId('rg-input');
    this.#descriptionId = `${this.#controlId}-description`;
    this.#errorId = `${this.#controlId}-error`;
    this.initialValue = this.value;

    this.query<HTMLInputElement>('.control').id = this.#controlId;
    this.query<HTMLLabelElement>('.label').htmlFor = this.#controlId;
    this.query<HTMLElement>('.hint').id = this.#descriptionId;
    this.query<HTMLElement>('.error').id = this.#errorId;
  }

  protected onConnect(signal: AbortSignal): void {
    const control = this.query<HTMLInputElement>('.control');
    this.listen(control, 'input', (event) => this.#handleNativeEvent(event), signal);
    this.listen(control, 'change', (event) => this.#handleNativeEvent(event), signal);
    this.listen(this.query<HTMLButtonElement>('.clear'), 'click', () => this.#clear(), signal);

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
    const control = this.query<HTMLInputElement>('.control');
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');

    control.type = this.type;
    control.name = this.name;
    control.disabled = disabled;
    control.required = this.required;
    control.readOnly = this.readOnly;
    control.placeholder = this.placeholder;
    this.#copyOptionalAttribute(control, 'autocomplete');
    control.inputMode = this.inputmode;
    this.#copyOptionalAttribute(control, 'min');
    this.#copyOptionalAttribute(control, 'max');
    this.#copyOptionalAttribute(control, 'step');
    this.#copyOptionalAttribute(control, 'minlength');
    this.#copyOptionalAttribute(control, 'maxlength');
    this.#copyOptionalAttribute(control, 'pattern');
    const requestedValue = this.value;
    if (control.value !== requestedValue) control.value = requestedValue;
    if (control.value !== requestedValue) {
      this.value = control.value;
      return;
    }

    const labelSlot = this.query<HTMLSlotElement>('slot[name="label"]');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const errorSlot = this.query<HTMLSlotElement>('slot[name="error"]');
    const startSlot = this.query<HTMLSlotElement>('slot[name="start"]');
    const endSlot = this.query<HTMLSlotElement>('slot[name="end"]');
    const hasLabel = Boolean(this.label) || hasAssignedContent(labelSlot);
    const hasDescription = Boolean(this.description) || hasAssignedContent(descriptionSlot);
    const hasError = Boolean(this.error) || hasAssignedContent(errorSlot);
    const errorMessage = assignedText(errorSlot) || this.error;

    this.query<HTMLElement>('[data-label]').textContent = this.label;
    this.query<HTMLElement>('[data-description]').textContent = this.description;
    this.query<HTMLElement>('[data-error]').textContent = this.error;
    this.query<HTMLElement>('.label-row').hidden = !hasLabel;
    this.query<HTMLElement>('[data-optional]').hidden = !hasLabel || this.required;
    this.query<HTMLElement>('.hint').hidden = !hasDescription;
    this.query<HTMLElement>('.error').hidden = !hasError;
    this.query<HTMLElement>('[data-start]').hidden = !hasAssignedContent(startSlot);
    this.query<HTMLElement>('[data-end]').hidden = !hasAssignedContent(endSlot);

    control.setCustomValidity(errorMessage || (this.invalid ? 'Invalid value.' : ''));
    this.mirrorValidity(control);
    const isInvalid = !control.validity.valid;
    control.setAttribute('aria-invalid', String(isInvalid));
    control.toggleAttribute('aria-errormessage', hasError && isInvalid);
    if (hasError && isInvalid) control.setAttribute('aria-errormessage', this.#errorId);
    const describedBy = [hasDescription ? this.#descriptionId : '', hasError ? this.#errorId : '']
      .filter(Boolean)
      .join(' ');
    if (describedBy) control.setAttribute('aria-describedby', describedBy);
    else control.removeAttribute('aria-describedby');

    const wrapper = this.query<HTMLElement>('.control-wrap');
    const clear = this.query<HTMLButtonElement>('.clear');
    const showClear = this.clearable && Boolean(control.value) && !disabled && !this.readOnly;
    wrapper.toggleAttribute('data-has-start', hasAssignedContent(startSlot));
    wrapper.toggleAttribute('data-has-end', hasAssignedContent(endSlot));
    wrapper.toggleAttribute('data-has-clear', showClear);
    clear.hidden = !showClear;

    this.setFormValue(disabled ? null : control.value, control.value);
  }

  protected restoreFormValue(value: string): void {
    this.value = value;
  }

  #handleNativeEvent(event: Event): void {
    const control = this.query<HTMLInputElement>('.control');
    if (this.value !== control.value) this.value = control.value;
    else this.update('value');

    if (!event.composed) {
      this.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
    }
  }

  #clear(): void {
    const control = this.query<HTMLInputElement>('.control');
    const previousValue = control.value;
    if (!previousValue) return;

    this.value = '';
    control.focus();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    this.emit('rg-clear', { previousValue });
  }

  #integerAttribute(name: 'minlength' | 'maxlength'): number {
    const raw = this.getAttribute(name);
    if (raw === null) return -1;
    const value = Number.parseInt(raw, 10);
    return Number.isFinite(value) && value >= 0 ? value : -1;
  }

  #setIntegerAttribute(name: 'minlength' | 'maxlength', value: number): void {
    if (!Number.isInteger(value) || value < 0) this.removeAttribute(name);
    else this.setAttribute(name, String(value));
  }

  #copyOptionalAttribute(control: HTMLInputElement, name: string): void {
    const value = this.getAttribute(name);
    if (value === null || value === '') control.removeAttribute(name);
    else control.setAttribute(name, value);
  }
}
