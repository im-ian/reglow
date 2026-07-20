import { FormAssociatedElement } from '../core/form-associated.js';
import type { InteractionStateDescriptor } from '../core/reglow-element.js';
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

export class RgCheckboxElement extends FormAssociatedElement {
  static readonly tagName = 'rg-checkbox' as const;
  static readonly interactionState = {
    checked: {
      events: ['input', 'change'],
      strategy: 'restore',
    },
    indeterminate: {
      events: ['input', 'change'],
      strategy: 'restore',
    },
  } as const satisfies InteractionStateDescriptor;
  static readonly observedAttributes = [
    'checked',
    'description',
    'disabled',
    'error',
    'indeterminate',
    'invalid',
    'label',
    'name',
    'required',
    'value',
  ] as const;
  static readonly template = String.raw`
    <div class="field" part="field">
      <label class="row" part="base">
        <input class="native" part="control" type="checkbox" />
        <span class="indicator" part="indicator" aria-hidden="true">
          <svg class="check" viewBox="0 0 16 16" focusable="false">
            <path d="m3.2 8.2 3 3.1 6.6-7" />
          </svg>
          <span class="mixed"></span>
        </span>
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
      position: relative;
      display: grid;
      width: 1.35rem;
      height: 1.35rem;
      margin-block-start: 0.06rem;
      overflow: hidden;
      border: 1.5px solid var(--_rg-border-strong);
      border-radius: 0.45rem;
      place-items: center;
      color: var(--_rg-on-brand);
      background: var(--_rg-surface);
      box-shadow: var(--_rg-shadow-xs);
      transition:
        border-color var(--_rg-base) var(--_rg-ease),
        background var(--_rg-base) var(--_rg-ease),
        box-shadow var(--_rg-base) var(--_rg-ease),
        transform var(--_rg-base) var(--_rg-spring);
    }
    :host(:not([disabled]):not([data-form-disabled])) .row:hover .indicator {
      border-color: var(--_rg-brand);
      transform: scale(1.04);
    }
    .native:focus-visible + .indicator { outline: none; border-color: var(--_rg-focus); box-shadow: var(--_rg-ring); }
    .native:active + .indicator {
      transform: scale(0.88);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    :host([checked]) .indicator, :host([indeterminate]) .indicator {
      border-color: var(--_rg-brand);
      background: var(--_rg-brand);
      animation: rg-checkbox-pop var(--_rg-slow) var(--_rg-spring);
    }
    .check {
      width: 0.9rem;
      height: 0.9rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 18;
      stroke-dashoffset: 18;
      transition: stroke-dashoffset var(--_rg-slow) var(--_rg-ease);
    }
    :host([checked]:not([indeterminate])) .check { stroke-dashoffset: 0; }
    .mixed {
      position: absolute;
      width: 0.68rem;
      height: 0.13rem;
      border-radius: 999px;
      background: currentColor;
      opacity: 0;
      transform: scaleX(0.3);
      transition: opacity var(--_rg-fast) var(--_rg-ease), transform var(--_rg-base) var(--_rg-spring);
    }
    :host([indeterminate]) .mixed { opacity: 1; transform: scaleX(1); }
    .label { min-width: 0; color: var(--_rg-text); font-size: 0.9rem; font-weight: 650; line-height: 1.45; }
    .hint, .error { margin-inline-start: 2rem; }
    :host([disabled]), :host([data-form-disabled]) { cursor: not-allowed; opacity: 0.52; }
    :host([disabled]) .row, :host([data-form-disabled]) .row { cursor: not-allowed; }
    :host([invalid]) .indicator, .native[aria-invalid='true'] + .indicator { border-color: var(--_rg-danger); }

    @keyframes rg-checkbox-pop {
      0% { transform: scale(0.82); }
      65% { transform: scale(1.08); }
      100% { transform: scale(1); }
    }
  `;

  #controlId = '';
  #descriptionId = '';
  #errorId = '';

  get value(): string {
    return this.hasAttribute('value') ? (this.getAttribute('value') ?? '') : 'on';
  }

  set value(value: string | null | undefined) {
    this.setLiveString('value', value);
  }

  get checked(): boolean {
    return this.getBoolean('checked');
  }

  set checked(value: boolean) {
    this.setBoolean('checked', value);
  }

  get indeterminate(): boolean {
    return this.getBoolean('indeterminate');
  }

  set indeterminate(value: boolean) {
    this.setBoolean('indeterminate', value);
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
    this.#controlId = this.createId('rg-checkbox');
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
    control.indeterminate = this.indeterminate;
    control.disabled = disabled;
    control.required = this.required;
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
    const nextChecked = control.checked;
    if (this.indeterminate) this.indeterminate = false;
    if (this.checked !== nextChecked) this.checked = nextChecked;
    else this.update('checked');

    if (!event.composed) {
      this.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
    }
  }
}
