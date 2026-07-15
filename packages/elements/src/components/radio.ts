import { FormAssociatedElement } from '../core/form-associated.js';
import { ReglowElement } from '../core/reglow-element.js';
import { fieldStyles } from '../styles/base.js';

export type RgRadioOrientation = 'horizontal' | 'vertical';

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

interface RadioGroupState {
  readonly selected: boolean;
  readonly value?: string;
}

function encodeGroupState(radio: RgRadioElement | undefined): string {
  const state: RadioGroupState = radio
    ? { selected: true, value: radio.value }
    : { selected: false };
  return JSON.stringify(state);
}

function decodeGroupState(state: string): RadioGroupState {
  try {
    const parsed = JSON.parse(state) as Partial<RadioGroupState>;
    return parsed.selected === true
      ? { selected: true, value: String(parsed.value ?? '') }
      : { selected: false };
  } catch {
    return state ? { selected: true, value: state } : { selected: false };
  }
}

export class RgRadioElement extends ReglowElement {
  static readonly tagName = 'rg-radio' as const;
  static readonly observedAttributes = [
    'checked',
    'description',
    'disabled',
    'label',
    'value',
  ] as const;
  static readonly template = String.raw`
    <label class="row" part="base">
      <input class="native" part="control" type="radio" />
      <span class="indicator" part="indicator" aria-hidden="true"><span class="dot"></span></span>
      <span class="copy">
        <span class="label" part="label"><slot><span data-label></span></slot></span>
        <span class="description" part="description">
          <slot name="description"><span data-description></span></slot>
        </span>
      </span>
    </label>
  `;
  static readonly styles = String.raw`
    :host { display: block; width: fit-content; max-width: 100%; }
    .row {
      position: relative;
      display: grid;
      grid-template-columns: 1.35rem minmax(0, 1fr);
      gap: 0.65rem;
      align-items: start;
      width: fit-content;
      max-width: 100%;
      cursor: pointer;
      user-select: none;
    }
    .native {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: 0;
      opacity: 0;
      pointer-events: none;
    }
    .indicator {
      display: grid;
      width: 1.35rem;
      height: 1.35rem;
      margin-block-start: 0.06rem;
      border: 1.5px solid var(--_rg-border-strong);
      border-radius: 50%;
      place-items: center;
      background: var(--_rg-surface);
      box-shadow: var(--_rg-shadow-xs);
      transition:
        border-color var(--_rg-base) var(--_rg-ease),
        background var(--_rg-base) var(--_rg-ease),
        box-shadow var(--_rg-base) var(--_rg-ease),
        transform var(--_rg-base) var(--_rg-spring);
    }
    .dot {
      width: 0.68rem;
      height: 0.68rem;
      border-radius: 50%;
      background: var(--_rg-on-brand);
      opacity: 0;
      transform: scale(0.25);
      transition: opacity var(--_rg-fast) var(--_rg-ease), transform var(--_rg-slow) var(--_rg-spring);
    }
    :host(:not([disabled]):not([data-group-disabled])) .row:hover .indicator {
      border-color: var(--_rg-brand);
      transform: scale(1.04);
    }
    .native:focus-visible + .indicator { outline: none; border-color: var(--_rg-focus); box-shadow: var(--_rg-ring); }
    .native:active + .indicator {
      transform: scale(0.88);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    :host([checked]) .indicator { border-color: var(--_rg-brand); background: var(--_rg-brand); box-shadow: var(--_rg-shadow-glow); }
    :host([checked]) .dot { opacity: 1; transform: scale(1); }
    .copy { display: grid; gap: 0.12rem; min-width: 0; }
    .label { color: var(--_rg-text); font-size: 0.9rem; font-weight: 650; line-height: 1.45; }
    .description { color: var(--_rg-text-muted); font-size: 0.78rem; line-height: 1.4; }
    :host([disabled]), :host([data-group-disabled]) { opacity: 0.52; }
    :host([disabled]) .row, :host([data-group-disabled]) .row { cursor: not-allowed; }
  `;

  #controlId = '';
  #descriptionId = '';
  #groupDisabled = false;
  #grouped = false;

  get value(): string {
    return this.hasAttribute('value') ? (this.getAttribute('value') ?? '') : 'on';
  }

  set value(value: string) {
    this.setAttribute('value', String(value));
  }

  get checked(): boolean {
    return this.getBoolean('checked');
  }

  set checked(value: boolean) {
    this.setBoolean('checked', value);
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
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

  get groupDisabled(): boolean {
    return this.#groupDisabled;
  }

  set groupDisabled(value: boolean) {
    if (this.#groupDisabled === value) return;
    this.#groupDisabled = value;
    this.toggleAttribute('data-group-disabled', value);
    if (this.shadowRoot) this.update('group-disabled');
  }

  get grouped(): boolean {
    return this.#grouped;
  }

  set grouped(value: boolean) {
    if (this.#grouped === value) return;
    this.#grouped = value;
    if (this.shadowRoot) this.update('grouped');
  }

  override focus(options?: FocusOptions): void {
    const control = this.shadowRoot?.querySelector<HTMLInputElement>('.native');
    if (control) control.focus(options);
    else super.focus(options);
  }

  protected onMount(): void {
    this.#controlId = this.createId('rg-radio');
    this.#descriptionId = `${this.#controlId}-description`;
    this.query<HTMLInputElement>('.native').id = this.#controlId;
    this.query<HTMLLabelElement>('.row').htmlFor = this.#controlId;
    this.query<HTMLElement>('.description').id = this.#descriptionId;
  }

  protected onConnect(signal: AbortSignal): void {
    const control = this.query<HTMLInputElement>('.native');
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
    const control = this.query<HTMLInputElement>('.native');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const hasDescription = Boolean(this.description) || hasAssignedContent(descriptionSlot);

    control.value = this.value;
    control.checked = this.checked;
    control.disabled = this.disabled || this.groupDisabled;
    control.tabIndex = this.grouped && !this.checked ? -1 : 0;
    this.query<HTMLElement>('[data-label]').textContent = this.label;
    this.query<HTMLElement>('[data-description]').textContent = this.description;
    this.query<HTMLElement>('.description').hidden = !hasDescription;
    if (hasDescription) control.setAttribute('aria-describedby', this.#descriptionId);
    else control.removeAttribute('aria-describedby');
  }

  #handleNativeEvent(event: Event): void {
    const control = this.query<HTMLInputElement>('.native');
    if (this.checked !== control.checked) this.checked = control.checked;
    else this.update('checked');

    if (!event.composed) {
      this.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
    }
  }
}

export class RgRadioGroupElement extends FormAssociatedElement {
  static readonly tagName = 'rg-radio-group' as const;
  static readonly observedAttributes = [
    'description',
    'disabled',
    'error',
    'invalid',
    'label',
    'name',
    'orientation',
    'required',
    'value',
  ] as const;
  static readonly template = String.raw`
    <div class="field" part="group">
      <div class="label-row" part="label-row">
        <span class="label" part="label"><slot name="label"><span data-label></span></slot></span>
        <span class="optional" data-optional>Optional</span>
      </div>
      <div class="options" part="options" role="radiogroup"><slot></slot></div>
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

    .options { display: flex; flex-direction: column; gap: 0.65rem; }
    :host([orientation='horizontal']) .options { flex-flow: row wrap; gap: 0.75rem 1.25rem; }
    :host([disabled]), :host([data-form-disabled]) { opacity: 0.68; }
    .options[aria-invalid='true'] {
      padding: 0.75rem;
      border: 1px solid var(--_rg-danger);
      border-radius: var(--rg-radius-md, 0.875rem);
      background: var(--_rg-danger-soft);
    }
  `;

  #labelId = '';
  #descriptionId = '';
  #errorId = '';
  #capturedInitialValue = false;
  #normalizingValue = false;
  readonly #ownedRadios = new Set<RgRadioElement>();

  get value(): string {
    const attribute = this.getAttribute('value');
    if (attribute !== null) return attribute;
    return this.#radios().find((radio) => radio.checked)?.value ?? '';
  }

  set value(value: string) {
    this.setAttribute('value', String(value));
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

  get orientation(): RgRadioOrientation {
    return this.getString('orientation', 'vertical') === 'horizontal' ? 'horizontal' : 'vertical';
  }

  set orientation(value: RgRadioOrientation) {
    this.setString('orientation', value);
  }

  protected onMount(): void {
    this.#labelId = this.createId('rg-radio-group-label');
    this.#descriptionId = `${this.#labelId}-description`;
    this.#errorId = `${this.#labelId}-error`;
    this.query<HTMLElement>('.label').id = this.#labelId;
    this.query<HTMLElement>('.hint').id = this.#descriptionId;
    this.query<HTMLElement>('.error').id = this.#errorId;
  }

  protected onConnect(signal: AbortSignal): void {
    const optionSlot = this.query<HTMLSlotElement>('slot:not([name])');
    this.listen(optionSlot, 'slotchange', () => this.update('slot'), signal);
    this.listen(this, 'input', (event) => this.#handleRadioEvent(event), signal);
    this.listen(this, 'change', (event) => this.#handleRadioEvent(event), signal);
    this.listen(this, 'keydown', (event) => this.#handleKeydown(event as KeyboardEvent), signal);

    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((records) => this.#handleRadioMutations(records));
      observer.observe(this, {
        attributes: true,
        attributeFilter: ['checked', 'disabled', 'value'],
        childList: true,
        characterData: true,
        subtree: true,
      });
      signal.addEventListener('abort', () => observer.disconnect(), { once: true });
    }

    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot[name]').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.update('slot'), signal);
    });
  }

  protected onDisconnect(): void {
    this.#ownedRadios.forEach((radio) => {
      radio.grouped = false;
      radio.groupDisabled = false;
    });
    this.#ownedRadios.clear();
  }

  protected update(_changedAttribute?: string): void {
    if (!this.shadowRoot || this.#normalizingValue) return;
    const radios = this.#radios();
    const selected = this.#synchronizeRadios(radios);
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');
    const group = this.query<HTMLElement>('.options');
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

    group.setAttribute('aria-orientation', this.orientation);
    group.setAttribute('aria-required', String(this.required));
    group.setAttribute('aria-disabled', String(disabled));
    if (hasLabel) group.setAttribute('aria-labelledby', this.#labelId);
    else group.removeAttribute('aria-labelledby');
    const describedBy = [hasDescription ? this.#descriptionId : '', hasError ? this.#errorId : '']
      .filter(Boolean)
      .join(' ');
    if (describedBy) group.setAttribute('aria-describedby', describedBy);
    else group.removeAttribute('aria-describedby');

    const selectedIsSuccessful = Boolean(selected && !selected.disabled && !disabled);
    const valueMissing = !disabled && this.required && !selectedIsSuccessful;
    const customError = Boolean(errorMessage) || this.invalid;
    if (valueMissing) {
      this.internals?.setValidity(
        { valueMissing: true },
        errorMessage || 'Please select an option.',
      );
    } else if (customError) {
      this.internals?.setValidity({ customError: true }, errorMessage || 'Invalid value.');
    } else {
      this.internals?.setValidity({});
    }
    const isInvalid = valueMissing || customError;
    group.setAttribute('aria-invalid', String(isInvalid));
    if (hasError && isInvalid) group.setAttribute('aria-errormessage', this.#errorId);
    else group.removeAttribute('aria-errormessage');

    const state = encodeGroupState(selected);
    this.setFormValue(selectedIsSuccessful && selected ? selected.value : null, state);
    if (!this.#capturedInitialValue) {
      this.initialValue = state;
      this.#capturedInitialValue = true;
    }
  }

  protected restoreFormValue(state: string): void {
    const restored = decodeGroupState(state);
    if (restored.selected) this.value = restored.value ?? '';
    else {
      this.removeAttribute('value');
      this.#radios().forEach((radio) => {
        radio.checked = false;
      });
      this.update('value');
    }
  }

  #radios(): RgRadioElement[] {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    if (!slot) return [];
    return slot
      .assignedElements({ flatten: true })
      .filter((element): element is RgRadioElement => element.localName === RgRadioElement.tagName);
  }

  #synchronizeRadios(radios: readonly RgRadioElement[]): RgRadioElement | undefined {
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');
    const explicitValue = this.getAttribute('value');
    const selected =
      explicitValue === null
        ? radios.find((radio) => radio.checked)
        : radios.find((radio) => radio.value === explicitValue);
    if (explicitValue !== null && !selected) {
      this.#normalizingValue = true;
      try {
        this.removeAttribute('value');
      } finally {
        this.#normalizingValue = false;
      }
    }

    this.#ownedRadios.forEach((radio) => {
      if (radios.includes(radio)) return;
      radio.grouped = false;
      radio.groupDisabled = false;
      this.#ownedRadios.delete(radio);
    });
    radios.forEach((radio) => {
      this.#ownedRadios.add(radio);
      radio.grouped = true;
      radio.groupDisabled = disabled;
      radio.checked = radio === selected;
    });

    const focusable =
      selected && !selected.disabled ? selected : radios.find((radio) => !radio.disabled);
    if (focusable && focusable !== selected) focusable.grouped = false;
    return selected;
  }

  #radioFromEvent(event: Event): RgRadioElement | undefined {
    return event
      .composedPath()
      .find(
        (target): target is RgRadioElement =>
          target instanceof Element && target.localName === RgRadioElement.tagName,
      );
  }

  #handleRadioEvent(event: Event): void {
    const radio = this.#radioFromEvent(event);
    if (
      !radio ||
      !radio.checked ||
      radio.disabled ||
      this.disabled ||
      this.hasAttribute('data-form-disabled')
    )
      return;
    if (this.getAttribute('value') !== radio.value) this.value = radio.value;
    else this.update('value');
  }

  #handleRadioMutations(records: readonly MutationRecord[]): void {
    const changedRadios = records
      .map((record) => record.target)
      .filter(
        (target): target is RgRadioElement =>
          target instanceof Element && target.localName === RgRadioElement.tagName,
      );
    const newlySelected = changedRadios.find((radio) => radio.checked && !radio.disabled);
    if (newlySelected) {
      if (this.getAttribute('value') !== newlySelected.value) this.value = newlySelected.value;
      else this.update('radio-mutation');
      return;
    }

    const selectedWasCleared = changedRadios.some(
      (radio) => !radio.checked && this.getAttribute('value') === radio.value,
    );
    if (selectedWasCleared) this.removeAttribute('value');
    this.update('radio-mutation');
  }

  #handleKeydown(event: KeyboardEvent): void {
    const radio = this.#radioFromEvent(event);
    if (!radio) return;
    const radios = this.#radios().filter(
      (candidate) => !candidate.disabled && !candidate.groupDisabled,
    );
    if (radios.length === 0) return;

    const currentIndex = Math.max(0, radios.indexOf(radio));
    let next: RgRadioElement | undefined;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      next = radios[(currentIndex + 1) % radios.length];
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = radios[(currentIndex - 1 + radios.length) % radios.length];
    } else if (event.key === 'Home') next = radios[0];
    else if (event.key === 'End') next = radios[radios.length - 1];
    else return;

    if (!next) return;
    event.preventDefault();
    this.value = next.value;
    next.focus();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
}
