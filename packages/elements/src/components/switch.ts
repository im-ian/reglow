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

export class RgSwitchElement extends FormAssociatedElement {
  static readonly tagName = 'rg-switch' as const;
  static readonly observedAttributes = [
    'checked',
    'description',
    'disabled',
    'error',
    'invalid',
    'label',
    'name',
    'required',
    'value',
  ] as const;
  static readonly template = String.raw`
    <div class="field" part="field">
      <label class="row" part="base">
        <input class="native" part="control" type="checkbox" role="switch" />
        <span class="track" part="track" aria-hidden="true"><span class="thumb" part="thumb"></span></span>
        <span class="label" part="label">
          <slot name="label"><slot></slot><span data-label></span></slot>
        </span>
      </label>
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

    :host { width: fit-content; max-width: 100%; }
    .field { gap: 0.35rem; }
    .row {
      position: relative;
      display: grid;
      grid-template-columns: 2.65rem minmax(0, 1fr);
      gap: 0.7rem;
      align-items: center;
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
    .track {
      position: relative;
      display: flex;
      width: 2.65rem;
      height: 1.55rem;
      align-items: center;
      padding: 0.18rem;
      border: 1px solid var(--_rg-border-strong);
      border-radius: 999px;
      background: var(--_rg-surface-sunken);
      box-shadow: inset 0 1px 2px rgb(23 32 27 / 10%);
      transition:
        border-color var(--_rg-base) var(--_rg-ease),
        background var(--_rg-base) var(--_rg-ease),
        box-shadow var(--_rg-base) var(--_rg-ease),
        transform var(--_rg-fast) var(--_rg-spring);
    }
    .thumb {
      display: block;
      width: 1.08rem;
      height: 1.08rem;
      border-radius: 50%;
      background: var(--_rg-surface-raised);
      box-shadow: 0 1px 3px rgb(23 32 27 / 24%);
      transform: translateX(0);
      transition:
        width var(--_rg-fast) var(--_rg-ease),
        background var(--_rg-base) var(--_rg-ease),
        transform var(--_rg-slow) var(--_rg-spring);
    }
    :host(:not([disabled]):not([data-form-disabled])) .row:hover .track {
      border-color: var(--_rg-brand);
      transform: scale(1.025);
    }
    .native:focus-visible + .track { outline: none; border-color: var(--_rg-focus); box-shadow: var(--_rg-ring); }
    .native:active + .track .thumb { width: 1.28rem; }
    :host([checked]) .track { border-color: var(--_rg-brand); background: var(--_rg-brand); box-shadow: var(--_rg-shadow-glow); }
    :host([checked]) .thumb { transform: translateX(1.08rem); }
    :host([checked]) .native:active + .track .thumb { transform: translateX(0.88rem); }
    :host([checked]:dir(rtl)) .thumb { transform: translateX(-1.08rem); }
    :host([checked]:dir(rtl)) .native:active + .track .thumb { transform: translateX(-0.88rem); }
    .label { min-width: 0; color: var(--_rg-text); font-size: 0.9rem; font-weight: 650; line-height: 1.45; }
    .hint, .error { margin-inline-start: 3.35rem; }
    :host([disabled]), :host([data-form-disabled]) { cursor: not-allowed; opacity: 0.52; }
    :host([disabled]) .row, :host([data-form-disabled]) .row { cursor: not-allowed; }
    :host([invalid]) .track, .native[aria-invalid='true'] + .track { border-color: var(--_rg-danger); }
  `;

  #controlId = '';
  #descriptionId = '';
  #errorId = '';

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

  protected onMount(): void {
    this.#controlId = this.createId('rg-switch');
    this.#descriptionId = `${this.#controlId}-description`;
    this.#errorId = `${this.#controlId}-error`;
    this.initialValue = this.checked ? 'checked' : 'unchecked';

    this.query<HTMLInputElement>('.native').id = this.#controlId;
    this.query<HTMLLabelElement>('.row').htmlFor = this.#controlId;
    this.query<HTMLElement>('.hint').id = this.#descriptionId;
    this.query<HTMLElement>('.error').id = this.#errorId;
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
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');
    const labelSlot = this.query<HTMLSlotElement>('slot[name="label"]');
    const defaultSlot = this.query<HTMLSlotElement>('slot:not([name])');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const errorSlot = this.query<HTMLSlotElement>('slot[name="error"]');
    const hasLabel =
      Boolean(this.label) || hasAssignedContent(labelSlot) || hasAssignedContent(defaultSlot);
    const hasDescription = Boolean(this.description) || hasAssignedContent(descriptionSlot);
    const hasError = Boolean(this.error) || hasAssignedContent(errorSlot);
    const errorMessage = assignedText(errorSlot) || this.error;

    control.name = this.name;
    control.value = this.value;
    control.checked = this.checked;
    control.disabled = disabled;
    control.required = this.required;
    control.setAttribute('aria-checked', String(this.checked));
    const labelFallback = this.query<HTMLElement>('[data-label]');
    labelFallback.textContent = this.label;
    labelFallback.hidden = hasAssignedContent(defaultSlot);
    this.query<HTMLElement>('[data-description]').textContent = this.description;
    this.query<HTMLElement>('[data-error]').textContent = this.error;
    this.query<HTMLElement>('.label').hidden = !hasLabel;
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

    this.setFormValue(
      this.checked && !disabled ? this.value : null,
      this.checked ? 'checked' : 'unchecked',
    );
  }

  protected restoreFormValue(value: string): void {
    this.checked = value === 'checked';
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
