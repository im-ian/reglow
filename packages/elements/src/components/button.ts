import { FormAssociatedElement } from '../core/form-associated.js';
import { motionStyles } from '../styles/base.js';

export type RgButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
export type RgButtonTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
export type RgButtonSize = 'sm' | 'md' | 'lg';
export type RgButtonType = 'button' | 'submit' | 'reset';

export interface RgPressDetail {
  readonly originalEvent: MouseEvent;
  readonly pressed: boolean | null;
}

const buttonVariants = new Set<RgButtonVariant>(['solid', 'soft', 'outline', 'ghost']);
const buttonTones = new Set<RgButtonTone>(['neutral', 'brand', 'success', 'warning', 'danger']);
const buttonSizes = new Set<RgButtonSize>(['sm', 'md', 'lg']);
const buttonTypes = new Set<RgButtonType>(['button', 'submit', 'reset']);

abstract class RgButtonBaseElement extends FormAssociatedElement {
  static readonly observedAttributes = [
    'aria-describedby',
    'aria-label',
    'aria-labelledby',
    'disabled',
    'full-width',
    'formnovalidate',
    'label',
    'loading',
    'name',
    'pressed',
    'size',
    'title',
    'tone',
    'type',
    'value',
    'variant',
  ] as const;

  static readonly template = String.raw`
    <button class="control" part="base control button" type="button">
      <span class="spinner" part="spinner" aria-hidden="true"></span>
      <span class="start" part="start"><slot name="start"></slot></span>
      <span class="label" part="label icon"><slot></slot></span>
      <span class="end" part="end"><slot name="end"></slot></span>
    </button>
  `;

  static readonly styles = String.raw`
    ${motionStyles}

    :host {
      display: inline-flex;
      max-width: 100%;
      vertical-align: middle;
    }

    :host([full-width]) { display: flex; width: 100%; }

    .control {
      --_rg-button-height: var(--rg-control-height-md, 2.75rem);
      --_rg-button-padding: 1rem;
      --_rg-button-gap: 0.5rem;
      --_rg-button-tone: var(--_rg-brand);
      --_rg-button-tone-hover: var(--_rg-brand-hover);
      --_rg-button-tone-active: var(--_rg-brand-active);
      --_rg-button-tone-soft: var(--_rg-brand-soft);
      --_rg-button-on-tone: var(--_rg-on-brand);
      --_rg-button-radius: var(--rg-button-border-radius, var(--rg-radius-pill, 999px));
      position: relative;
      display: inline-flex;
      width: 100%;
      min-width: 0;
      min-height: var(--_rg-button-height);
      align-items: center;
      justify-content: center;
      gap: var(--_rg-button-gap);
      padding: 0 var(--_rg-button-padding);
      overflow: hidden;
      border: 1px solid transparent;
      border-radius: var(--_rg-button-radius);
      border-start-start-radius: var(
        --rg-button-border-start-start-radius,
        var(--_rg-button-radius)
      );
      border-start-end-radius: var(
        --rg-button-border-start-end-radius,
        var(--_rg-button-radius)
      );
      border-end-start-radius: var(
        --rg-button-border-end-start-radius,
        var(--_rg-button-radius)
      );
      border-end-end-radius: var(
        --rg-button-border-end-end-radius,
        var(--_rg-button-radius)
      );
      color: var(--_rg-button-on-tone);
      background: var(--_rg-button-tone);
      box-shadow: none;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 750;
      letter-spacing: -0.012em;
      line-height: 1;
      text-decoration: none;
      user-select: none;
      transition:
        color var(--_rg-base) var(--_rg-ease),
        background-color var(--_rg-base) var(--_rg-ease),
        border-color var(--_rg-base) var(--_rg-ease),
        box-shadow var(--_rg-base) var(--_rg-ease),
        opacity var(--_rg-base) var(--_rg-ease),
        transform var(--_rg-base) var(--_rg-spring);
    }

    .control:hover:not(:disabled) {
      background: var(--_rg-button-tone-hover);
    }

    .control:active:not(:disabled) {
      background: var(--_rg-button-tone-active);
      transform: scale(0.97);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }

    .control:focus-visible {
      outline: none;
      box-shadow: var(--_rg-ring);
    }

    .control:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      transform: none;
    }

    :host([tone='neutral']) .control {
      --_rg-button-tone: var(--_rg-text);
      --_rg-button-tone-hover: color-mix(in srgb, var(--_rg-text) 86%, var(--_rg-brand));
      --_rg-button-tone-active: color-mix(in srgb, var(--_rg-text) 78%, #000);
      --_rg-button-tone-soft: var(--_rg-canvas-subtle);
      --_rg-button-on-tone: var(--_rg-surface);
    }

    :host([tone='success']) .control {
      --_rg-button-tone: var(--_rg-success);
      --_rg-button-tone-hover: color-mix(in srgb, var(--_rg-success) 88%, #000);
      --_rg-button-tone-active: color-mix(in srgb, var(--_rg-success) 78%, #000);
      --_rg-button-tone-soft: var(--_rg-success-soft);
      --_rg-button-on-tone: var(--_rg-surface);
    }

    :host([tone='warning']) .control {
      --_rg-button-tone: var(--_rg-warning);
      --_rg-button-tone-hover: color-mix(in srgb, var(--_rg-warning) 88%, #000);
      --_rg-button-tone-active: color-mix(in srgb, var(--_rg-warning) 78%, #000);
      --_rg-button-tone-soft: var(--_rg-warning-soft);
      --_rg-button-on-tone: var(--_rg-surface);
    }

    :host([tone='danger']) .control {
      --_rg-button-tone: var(--_rg-danger);
      --_rg-button-tone-hover: color-mix(in srgb, var(--_rg-danger) 88%, #000);
      --_rg-button-tone-active: color-mix(in srgb, var(--_rg-danger) 78%, #000);
      --_rg-button-tone-soft: var(--_rg-danger-soft);
      --_rg-button-on-tone: var(--_rg-surface);
    }

    :host([variant='soft']) .control {
      color: var(--_rg-button-tone);
      background: var(--_rg-button-tone-soft);
      box-shadow: none;
    }

    :host([variant='soft']) .control:hover:not(:disabled) {
      color: var(--_rg-button-tone-hover);
      background: color-mix(in srgb, var(--_rg-button-tone-soft) 82%, var(--_rg-button-tone) 18%);
    }

    :host([variant='outline']) .control {
      color: var(--_rg-button-tone);
      background: var(--_rg-surface);
      border-color: color-mix(in srgb, var(--_rg-button-tone) 55%, var(--_rg-border));
      box-shadow: none;
    }

    :host([variant='outline']) .control:hover:not(:disabled) {
      color: var(--_rg-button-tone-hover);
      background: var(--_rg-button-tone-soft);
      border-color: var(--_rg-button-tone);
    }

    :host([variant='ghost']) .control {
      color: var(--_rg-button-tone);
      background: transparent;
      box-shadow: none;
    }

    :host([variant='ghost']) .control:hover:not(:disabled) {
      color: var(--_rg-button-tone-hover);
      background: var(--_rg-button-tone-soft);
      box-shadow: none;
    }

    :host([size='sm']) .control {
      --_rg-button-height: var(--rg-control-height-sm, 2.25rem);
      --_rg-button-padding: 0.78rem;
      --_rg-button-gap: 0.38rem;
      font-size: 0.8rem;
    }

    :host([size='lg']) .control {
      --_rg-button-height: var(--rg-control-height-lg, 3.25rem);
      --_rg-button-padding: 1.25rem;
      --_rg-button-gap: 0.6rem;
      font-size: 1rem;
    }

    .start,
    .end,
    .label {
      position: relative;
      display: inline-flex;
      min-width: 0;
      align-items: center;
      justify-content: center;
    }

    .start,
    .end {
      flex: 0 0 auto;
      font-size: 1.1em;
    }

    .label {
      overflow: hidden;
      line-height: 1.25;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    ::slotted([slot='start']),
    ::slotted([slot='end']) {
      display: inline-grid;
      width: 1em;
      height: 1em;
      flex: none;
      line-height: 0;
      place-items: center;
    }

    .spinner {
      position: absolute;
      width: 1.1em;
      height: 1.1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: rg-spin 700ms linear infinite;
      opacity: 0;
      pointer-events: none;
    }

    :host([loading]) .spinner { opacity: 1; }
    :host([loading]) .start,
    :host([loading]) .label,
    :host([loading]) .end { opacity: 0; }

    :host([pressed]:not([pressed='false'])) .control:not(:disabled) {
      transform: scale(0.98);
    }

    :host(rg-icon-button) .control {
      width: var(--_rg-button-height);
      flex: 0 0 var(--_rg-button-height);
      padding: 0;
    }

    :host(rg-icon-button[full-width]) .control {
      width: 100%;
      flex: 1 1 auto;
    }

    :host(rg-icon-button) .start,
    :host(rg-icon-button) .end { display: none; }

    :host(rg-icon-button) .label {
      width: 1.2em;
      height: 1.2em;
      overflow: visible;
    }

    :host(rg-icon-button) ::slotted(*) {
      display: block;
      width: 1.2em;
      height: 1.2em;
      flex: none;
    }

    @media (forced-colors: active) {
      .control { border-color: ButtonBorder; }
      .control:disabled { color: GrayText; }
    }
  `;

  get variant(): RgButtonVariant {
    const value = this.getString('variant', 'solid') as RgButtonVariant;
    return buttonVariants.has(value) ? value : 'solid';
  }

  set variant(value: RgButtonVariant) {
    this.setString('variant', buttonVariants.has(value) && value !== 'solid' ? value : null);
  }

  get tone(): RgButtonTone {
    const value = this.getString('tone', 'brand') as RgButtonTone;
    return buttonTones.has(value) ? value : 'brand';
  }

  set tone(value: RgButtonTone) {
    this.setString('tone', buttonTones.has(value) && value !== 'brand' ? value : null);
  }

  get size(): RgButtonSize {
    const value = this.getString('size', 'md') as RgButtonSize;
    return buttonSizes.has(value) ? value : 'md';
  }

  set size(value: RgButtonSize) {
    this.setString('size', buttonSizes.has(value) ? value : 'md');
  }

  get type(): RgButtonType {
    const value = this.getString('type', 'button') as RgButtonType;
    return buttonTypes.has(value) ? value : 'button';
  }

  set type(value: RgButtonType) {
    this.setString('type', buttonTypes.has(value) ? value : 'button');
  }

  get value(): string {
    return this.getString('value');
  }

  set value(value: string) {
    this.setString('value', value);
  }

  get loading(): boolean {
    return this.getBoolean('loading');
  }

  set loading(value: boolean) {
    this.setBoolean('loading', value);
  }

  get fullWidth(): boolean {
    return this.getBoolean('full-width');
  }

  set fullWidth(value: boolean) {
    this.setBoolean('full-width', value);
  }

  get label(): string {
    return this.getString('label');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get formNoValidate(): boolean {
    return this.getBoolean('formnovalidate');
  }

  set formNoValidate(value: boolean) {
    this.setBoolean('formnovalidate', value);
  }

  get pressed(): boolean | null {
    const value = this.getAttribute('pressed');
    if (value === null) return null;
    return value !== 'false';
  }

  set pressed(value: boolean | null) {
    if (value === null) this.removeAttribute('pressed');
    else this.setAttribute('pressed', String(value));
  }

  click(): void {
    this.mount();
    this.query<HTMLButtonElement>('.control').click();
  }

  protected onMount(root: ShadowRoot): void {
    root.querySelector<HTMLButtonElement>('.control')?.addEventListener('click', (event) => {
      this.#handleClick(event);
    });
  }

  protected onConnect(signal: AbortSignal): void {
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.#syncSlot(slot), signal);
      this.#syncSlot(slot);
    });
  }

  protected update(): void {
    const control = this.shadowRoot?.querySelector<HTMLButtonElement>('.control');
    if (!control) return;

    const disabled = this.#isDisabled();
    control.disabled = disabled;
    control.type = this.type;
    control.name = this.name;
    control.value = this.value;
    control.formNoValidate = this.formNoValidate;

    this.#mirrorAttribute(control, 'aria-describedby');
    this.#mirrorAttribute(control, 'aria-label');
    this.#mirrorAttribute(control, 'aria-labelledby');
    this.#mirrorAttribute(control, 'title');
    if (!control.hasAttribute('aria-label') && this.label) {
      control.setAttribute('aria-label', this.label);
    }

    if (this.loading) control.setAttribute('aria-busy', 'true');
    else control.removeAttribute('aria-busy');

    if (this.pressed === null) control.removeAttribute('aria-pressed');
    else control.setAttribute('aria-pressed', String(this.pressed));

    this.setFormValue(null);
  }

  protected restoreFormValue(): void {
    this.setFormValue(null);
  }

  #handleClick(event: MouseEvent): void {
    if (this.#isDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    const accepted = this.emit<RgPressDetail>(
      'rg-press',
      { originalEvent: event, pressed: this.pressed },
      { cancelable: true },
    );

    if (!accepted) {
      event.preventDefault();
      return;
    }

    if (this.type === 'button') return;

    queueMicrotask(() => {
      if (!event.defaultPrevented && !this.#isDisabled()) this.#runFormAction();
    });
  }

  #runFormAction(): void {
    const form = this.form;
    if (!form) return;

    if (this.type === 'reset') {
      form.reset();
      return;
    }

    const previousNoValidate = form.noValidate;
    if (this.formNoValidate) form.noValidate = true;

    try {
      this.setFormValue(this.name ? this.value : null);
      form.requestSubmit();
    } finally {
      this.setFormValue(null);
      form.noValidate = previousNoValidate;
    }
  }

  #isDisabled(): boolean {
    return this.disabled || this.loading || this.hasAttribute('data-form-disabled');
  }

  #syncSlot(slot: HTMLSlotElement): void {
    const wrapper = slot.parentElement;
    if (!wrapper) return;
    wrapper.hidden = !slot.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
    });
  }

  #mirrorAttribute(target: HTMLElement, name: string): void {
    const value = this.getAttribute(name);
    if (value === null) target.removeAttribute(name);
    else target.setAttribute(name, value);
  }
}

export class RgButtonElement extends RgButtonBaseElement {
  static readonly tagName = 'rg-button' as const;
}

export class RgIconButtonElement extends RgButtonBaseElement {
  static readonly tagName = 'rg-icon-button' as const;
}
