import { FormAssociatedElement } from '../core/form-associated.js';
import { fieldStyles } from '../styles/base.js';

export type RgTextareaResize = 'none' | 'vertical' | 'both';
export type RgTextareaSize = 'sm' | 'md' | 'lg';

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

export class RgTextareaElement extends FormAssociatedElement {
  static readonly tagName = 'rg-textarea' as const;
  static readonly observedAttributes = [
    'auto-grow',
    'cols',
    'description',
    'disabled',
    'error',
    'invalid',
    'label',
    'maxlength',
    'minlength',
    'name',
    'placeholder',
    'readonly',
    'required',
    'resize',
    'rows',
    'size',
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
        <textarea class="control" part="control textarea"></textarea>
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

    .control {
      display: block;
      min-height: 7rem;
      padding: 0.75rem 0.85rem;
      line-height: 1.55;
      resize: vertical;
    }
    :host([resize='none']) .control, :host([auto-grow]) .control { resize: none; }
    :host([resize='both']) .control { resize: both; }
    :host([size='sm']) .control { min-height: 5.75rem; border-radius: var(--rg-radius-sm, 0.7rem); font-size: 0.875rem; }
    :host([size='lg']) .control { min-height: 8.5rem; border-radius: var(--rg-radius-lg, 1.1rem); font-size: 1.0625rem; }
  `;

  #controlId = '';
  #descriptionId = '';
  #errorId = '';
  #resizeObserver?: ResizeObserver;
  #observedControlWidth = 0;

  get value(): string {
    return this.getAttribute('value') ?? '';
  }

  set value(value: string | number | null | undefined) {
    this.setLiveString('value', value);
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

  get invalid(): boolean {
    return this.getBoolean('invalid');
  }

  set invalid(value: boolean) {
    this.setBoolean('invalid', value);
  }

  get autoGrow(): boolean {
    return this.getBoolean('auto-grow');
  }

  set autoGrow(value: boolean) {
    this.setBoolean('auto-grow', value);
  }

  get rows(): number {
    return this.#positiveIntegerAttribute('rows', 4);
  }

  set rows(value: number) {
    this.#setPositiveIntegerAttribute('rows', value);
  }

  get cols(): number {
    return this.#positiveIntegerAttribute('cols', 20);
  }

  set cols(value: number) {
    this.#setPositiveIntegerAttribute('cols', value);
  }

  get minLength(): number {
    return this.#nonNegativeIntegerAttribute('minlength');
  }

  set minLength(value: number) {
    this.#setNonNegativeIntegerAttribute('minlength', value);
  }

  get maxLength(): number {
    return this.#nonNegativeIntegerAttribute('maxlength');
  }

  set maxLength(value: number) {
    this.#setNonNegativeIntegerAttribute('maxlength', value);
  }

  get resize(): RgTextareaResize {
    const value = this.getString('resize', 'vertical');
    return value === 'none' || value === 'both' ? value : 'vertical';
  }

  set resize(value: RgTextareaResize) {
    this.setString('resize', value);
  }

  get size(): RgTextareaSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgTextareaSize) {
    this.setString('size', value);
  }

  protected onMount(): void {
    this.#controlId = this.createId('rg-textarea');
    this.#descriptionId = `${this.#controlId}-description`;
    this.#errorId = `${this.#controlId}-error`;
    this.initialValue = this.value;

    this.query<HTMLTextAreaElement>('.control').id = this.#controlId;
    this.query<HTMLLabelElement>('.label').htmlFor = this.#controlId;
    this.query<HTMLElement>('.hint').id = this.#descriptionId;
    this.query<HTMLElement>('.error').id = this.#errorId;
  }

  protected onConnect(signal: AbortSignal): void {
    const control = this.query<HTMLTextAreaElement>('.control');
    this.listen(control, 'input', (event) => this.#handleNativeEvent(event), signal);
    this.listen(control, 'change', (event) => this.#handleNativeEvent(event), signal);
    this.#observeAutoGrowWidth(control, signal);

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
    const control = this.query<HTMLTextAreaElement>('.control');
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');

    control.name = this.name;
    control.disabled = disabled;
    control.required = this.required;
    control.readOnly = this.readOnly;
    control.placeholder = this.placeholder;
    control.rows = this.rows;
    control.cols = this.cols;
    this.#copyOptionalAttribute(control, 'minlength');
    this.#copyOptionalAttribute(control, 'maxlength');
    if (control.value !== this.value) control.value = this.value;

    const labelSlot = this.query<HTMLSlotElement>('slot[name="label"]');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const errorSlot = this.query<HTMLSlotElement>('slot[name="error"]');
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

    this.#resizeToContent(control);
    this.setFormValue(disabled ? null : control.value, control.value);
  }

  protected restoreFormValue(value: string): void {
    this.value = value;
  }

  #handleNativeEvent(event: Event): void {
    const control = this.query<HTMLTextAreaElement>('.control');
    if (this.value !== control.value) this.value = control.value;
    else this.update('value');
    this.#resizeToContent(control);

    if (!event.composed) {
      this.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
    }
  }

  #resizeToContent(control: HTMLTextAreaElement): void {
    if (!this.autoGrow) {
      control.style.height = '';
      return;
    }

    control.style.height = 'auto';
    control.style.height = `${control.scrollHeight}px`;
  }

  #observeAutoGrowWidth(control: HTMLTextAreaElement, signal: AbortSignal): void {
    if (typeof ResizeObserver === 'undefined') return;

    const controlWrap = this.query<HTMLElement>('.control-wrap');
    this.#resizeObserver?.disconnect();
    this.#observedControlWidth = control.getBoundingClientRect().width;

    const observer = new ResizeObserver(() => {
      const width = control.getBoundingClientRect().width;
      if (width === this.#observedControlWidth) return;

      this.#observedControlWidth = width;
      this.#resizeToContent(control);
    });
    this.#resizeObserver = observer;
    observer.observe(controlWrap);
    observer.observe(control);

    signal.addEventListener(
      'abort',
      () => {
        observer.disconnect();
        if (this.#resizeObserver === observer) this.#resizeObserver = undefined;
      },
      { once: true },
    );
  }

  #positiveIntegerAttribute(name: 'rows' | 'cols', fallback: number): number {
    const value = Number.parseInt(this.getAttribute(name) ?? '', 10);
    return Number.isInteger(value) && value > 0 ? value : fallback;
  }

  #setPositiveIntegerAttribute(name: 'rows' | 'cols', value: number): void {
    if (!Number.isInteger(value) || value <= 0) this.removeAttribute(name);
    else this.setAttribute(name, String(value));
  }

  #nonNegativeIntegerAttribute(name: 'minlength' | 'maxlength'): number {
    const value = Number.parseInt(this.getAttribute(name) ?? '', 10);
    return Number.isInteger(value) && value >= 0 ? value : -1;
  }

  #setNonNegativeIntegerAttribute(name: 'minlength' | 'maxlength', value: number): void {
    if (!Number.isInteger(value) || value < 0) this.removeAttribute(name);
    else this.setAttribute(name, String(value));
  }

  #copyOptionalAttribute(control: HTMLTextAreaElement, name: string): void {
    const value = this.getAttribute(name);
    if (value === null || value === '') control.removeAttribute(name);
    else control.setAttribute(name, value);
  }
}
