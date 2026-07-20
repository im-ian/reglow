import { FormAssociatedElement } from '../core/form-associated.js';
import { ReglowElement } from '../core/reglow-element.js';
import { fieldStyles } from '../styles/base.js';

export type RgSelectSize = 'sm' | 'md' | 'lg';

export interface RgSelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly selected?: boolean;
}

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

export class RgOptionElement extends ReglowElement {
  static readonly tagName = 'rg-option' as const;
  static readonly observedAttributes = ['disabled', 'label', 'selected', 'value'] as const;
  static readonly template = '<slot></slot>';
  static readonly styles = ':host { display: none !important; }';

  get value(): string {
    return this.hasAttribute('value') ? (this.getAttribute('value') ?? '') : this.label;
  }

  set value(value: string | null | undefined) {
    this.setLiveString('value', value);
  }

  get label(): string {
    return this.getAttribute('label') ?? this.textContent?.trim() ?? '';
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  get selected(): boolean {
    return this.getBoolean('selected');
  }

  set selected(value: boolean) {
    this.setBoolean('selected', value);
  }
}

export class RgSelectElement extends FormAssociatedElement {
  static readonly tagName = 'rg-select' as const;
  static readonly observedAttributes = [
    'description',
    'disabled',
    'error',
    'invalid',
    'label',
    'name',
    'placeholder',
    'required',
    'size',
    'value',
  ] as const;
  static readonly template = `
    <div class="field" part="field">
      <div class="label-row" part="label-row">
        <label class="label" part="label"><slot name="label"><span data-label></span></slot></label>
        <span class="optional" data-optional>Optional</span>
      </div>
      <div class="control-wrap" part="control-wrap">
        <select class="control" part="control select"></select>
        <svg class="chevron" part="icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="m3.5 6 4.5 4 4.5-4" />
        </svg>
      </div>
      <div class="hint" part="description">
        <slot name="description"><span data-description></span></slot>
      </div>
      <div class="error" part="error" role="alert">
        <slot name="error"><span data-error></span></slot>
      </div>
      <slot class="source"></slot>
    </div>
  `;
  static get styles(): string {
    return `
    ${fieldStyles}

    .control {
      appearance: none;
      padding: 0.65rem 2.65rem 0.65rem 0.85rem;
      cursor: pointer;
    }
    .control:disabled { cursor: not-allowed; }
    .chevron {
      position: absolute;
      inset-inline-end: 0.85rem;
      width: 1rem;
      height: 1rem;
      fill: none;
      stroke: var(--_rg-text-muted);
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
      pointer-events: none;
      transition: color var(--_rg-fast) var(--_rg-ease), transform var(--_rg-base) var(--_rg-spring);
    }
    .control:focus-visible + .chevron { color: var(--_rg-brand); transform: translateY(0.1rem); }
    :host([size='sm']) .control { min-height: 2.25rem; border-radius: var(--rg-radius-sm, 0.7rem); font-size: 0.875rem; }
    :host([size='lg']) .control { min-height: 3.25rem; border-radius: var(--rg-radius-lg, 1.1rem); font-size: 1.0625rem; }
    .source { display: none; }
  `;
  }

  #controlId = '';
  #descriptionId = '';
  #errorId = '';
  #capturedInitialValue = false;
  #initialOptionsWereEmpty = false;
  #optionSignature = '';
  #providedOptions: readonly RgSelectOption[] | null = null;

  get value(): string {
    const attribute = this.getAttribute('value');
    if (attribute !== null) return attribute;
    const control = this.shadowRoot?.querySelector<HTMLSelectElement>('.control');
    if (control && this.#capturedInitialValue) return control.value;
    return this.#optionRecords().find((option) => option.selected)?.value ?? '';
  }

  set value(value: string | number | null | undefined) {
    this.setLiveString('value', value);
  }

  get options(): readonly RgSelectOption[] {
    return this.#providedOptions ?? this.#optionRecordsFromChildren();
  }

  set options(value: readonly RgSelectOption[] | null | undefined) {
    const shouldRefreshInitialValue = this.#capturedInitialValue && this.#initialOptionsWereEmpty;
    this.#providedOptions = value
      ? value.map((option) => ({
          value: String(option.value),
          label: String(option.label),
          disabled: Boolean(option.disabled),
          selected: Boolean(option.selected),
        }))
      : value === null
        ? null
        : [];
    if (this.shadowRoot) {
      this.update('options');
      if (shouldRefreshInitialValue) {
        this.initialValue = this.query<HTMLSelectElement>('.control').value;
        this.#initialOptionsWereEmpty = this.#optionRecords().length === 0;
      }
    }
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

  get invalid(): boolean {
    return this.getBoolean('invalid');
  }

  set invalid(value: boolean) {
    this.setBoolean('invalid', value);
  }

  get size(): RgSelectSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgSelectSize) {
    this.setString('size', value);
  }

  protected onMount(): void {
    this.#controlId = this.createId('rg-select');
    this.#descriptionId = `${this.#controlId}-description`;
    this.#errorId = `${this.#controlId}-error`;

    this.query<HTMLSelectElement>('.control').id = this.#controlId;
    this.query<HTMLLabelElement>('.label').htmlFor = this.#controlId;
    this.query<HTMLElement>('.hint').id = this.#descriptionId;
    this.query<HTMLElement>('.error').id = this.#errorId;
  }

  protected onConnect(signal: AbortSignal): void {
    const control = this.query<HTMLSelectElement>('.control');
    this.listen(control, 'input', (event) => this.#handleNativeEvent(event), signal);
    this.listen(control, 'change', (event) => this.#handleNativeEvent(event), signal);

    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.update('slot'), signal);
    });

    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((records) => {
        if (records.some((record) => record.type === 'childList' || record.target !== this)) {
          this.update('options');
        }
      });
      observer.observe(this, {
        attributes: true,
        attributeFilter: ['disabled', 'label', 'selected', 'value'],
        childList: true,
        characterData: true,
        subtree: true,
      });
      signal.addEventListener('abort', () => observer.disconnect(), { once: true });
    }
  }

  protected update(_changedAttribute?: string): void {
    if (!this.shadowRoot) return;
    const control = this.query<HTMLSelectElement>('.control');
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');
    const records = this.#optionRecords();
    this.#synchronizeOptions(control, records);

    const labelSlot = this.query<HTMLSlotElement>('slot[name="label"]');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const errorSlot = this.query<HTMLSlotElement>('slot[name="error"]');
    const hasLabel = Boolean(this.label) || hasAssignedContent(labelSlot);
    const hasDescription = Boolean(this.description) || hasAssignedContent(descriptionSlot);
    const hasError = Boolean(this.error) || hasAssignedContent(errorSlot);
    const errorMessage = assignedText(errorSlot) || this.error;

    control.name = this.name;
    control.disabled = disabled;
    control.required = this.required;
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

    const selectedOption = control.selectedOptions.item(0);
    this.setFormValue(
      !disabled && selectedOption && !selectedOption.disabled ? control.value : null,
      control.value,
    );
    if (!this.#capturedInitialValue) {
      this.initialValue = control.value;
      this.#initialOptionsWereEmpty = records.length === 0;
      this.#capturedInitialValue = true;
    }
  }

  protected restoreFormValue(value: string): void {
    this.value = value;
  }

  #handleNativeEvent(event: Event): void {
    const control = this.query<HTMLSelectElement>('.control');
    if (this.getAttribute('value') !== control.value) this.value = control.value;
    else this.update('value');

    if (!event.composed) {
      this.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
    }
  }

  #optionRecords(): readonly RgSelectOption[] {
    return this.#providedOptions ?? this.#optionRecordsFromChildren();
  }

  #optionRecordsFromChildren(): readonly RgSelectOption[] {
    return Array.from(this.children)
      .filter((element): element is RgOptionElement => element.localName === 'rg-option')
      .map((option) => ({
        value: option.value,
        label: option.label,
        disabled: option.disabled,
        selected: option.selected,
      }));
  }

  #synchronizeOptions(control: HTMLSelectElement, records: readonly RgSelectOption[]): void {
    const signature = JSON.stringify({ placeholder: this.placeholder, records });
    const needsRebuild = signature !== this.#optionSignature;
    if (needsRebuild) {
      const fragment = document.createDocumentFragment();
      if (this.placeholder) {
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = this.placeholder;
        placeholder.disabled = this.required;
        placeholder.hidden = this.required;
        fragment.append(placeholder);
      }
      records.forEach((record) => {
        const option = document.createElement('option');
        option.value = record.value;
        option.textContent = record.label;
        option.disabled = Boolean(record.disabled);
        option.defaultSelected = Boolean(record.selected);
        option.selected = Boolean(record.selected);
        fragment.append(option);
      });
      control.replaceChildren(fragment);
      this.#optionSignature = signature;
    }

    const explicitValue = this.getAttribute('value');
    if (explicitValue !== null) {
      control.value = explicitValue;
      if (control.value !== explicitValue) this.removeAttribute('value');
    } else if (needsRebuild) {
      const selected = records.find((record) => record.selected);
      if (selected) control.value = selected.value;
      else if (this.placeholder) control.value = '';
    }
  }
}
