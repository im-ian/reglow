import { FormAssociatedElement } from '../core/form-associated.js';
import { fieldStyles, motionStyles } from '../styles/base.js';
import {
  constrainTimeToRange,
  focusSelectedTimeOptions,
  formatDisplayTime,
  formatTime,
  handleTimePickerKeyDown,
  isTimeDisabled,
  parseTime,
  renderTimePicker,
  timePickerStyles,
  timePickerTemplate,
  updateTimePart,
  type RgPickerOpenChangeDetail,
  type RgPickerOpenReason,
  type RgTimeParts,
} from '../internal/date-time-picker.js';

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

export type RgTimePickerSize = 'sm' | 'md' | 'lg';
export type RgTimePickerOverlayWidth = 'auto' | 'full';
export type RgTimePickerOverlayAlign = 'start' | 'center' | 'end';
export type RgTimePickerOpenChangeDetail = RgPickerOpenChangeDetail;
export type RgTimePickerOpenReason = RgPickerOpenReason;

export class RgTimePickerElement extends FormAssociatedElement {
  static readonly tagName = 'rg-time-picker' as const;
  static readonly observedAttributes = [
    'description',
    'disabled',
    'error',
    'invalid',
    'label',
    'max',
    'min',
    'name',
    'open',
    'overlay-align',
    'overlay-width',
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
        <input class="validator" type="time" tabindex="-1" aria-hidden="true" hidden />
        <button class="control picker-control" part="control input" type="button">
          <span class="display-value" data-display-value></span>
        </button>
        <svg class="clock-icon" part="icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="7.2" />
          <path d="M10 5.8v4.5l3 1.8" />
        </svg>
        <div class="picker-panel" part="panel" role="dialog" aria-label="Choose a time" hidden>
          ${timePickerTemplate()}
          <footer class="picker-footer">
            <button class="picker-action" part="action" data-action="clear" type="button">Clear</button>
            <button class="picker-action done-action" part="action" data-action="done" type="button">Done</button>
          </footer>
        </div>
      </div>
      <div class="hint" part="description"><slot name="description"><span data-description></span></slot></div>
      <div class="error" part="error" role="alert"><slot name="error"><span data-error></span></slot></div>
    </div>
  `;
  static readonly styles = String.raw`
    ${fieldStyles}
    ${motionStyles}
    ${timePickerStyles}
    .validator { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
    .picker-control { display: flex; align-items: center; padding: 0.65rem 2.7rem 0.65rem 0.85rem; text-align: start; cursor: pointer; }
    .picker-control[aria-expanded='true'] { border-color: var(--_rg-focus); box-shadow: var(--_rg-ring), var(--_rg-shadow-xs); }
    .display-value { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .display-value:empty::before { color: var(--_rg-text-subtle); content: 'Choose a time'; }
    .clock-icon {
      position: absolute; z-index: 2; inset-inline-end: 0.85rem; width: 1.15rem; height: 1.15rem;
      fill: none; stroke: var(--_rg-text-muted); stroke-width: 1.6; stroke-linecap: round; pointer-events: none;
    }
    .picker-panel {
      position: absolute; z-index: var(--rg-z-time-picker, 1150); inset: calc(100% + 0.45rem) auto auto 0;
      width: max-content; max-width: min(17rem, calc(100vw - 1rem)); padding: 0.8rem;
      border: 1px solid var(--_rg-border); border-radius: var(--rg-radius-lg, 1.125rem);
      color: var(--_rg-text); background: var(--_rg-surface-raised); box-shadow: var(--_rg-shadow-md);
      animation: rg-pop-in var(--_rg-slow) var(--_rg-spring) both;
    }
    .picker-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-block-start: 0.65rem; padding-block-start: 0.65rem; border-block-start: 1px solid var(--_rg-border); }
    .picker-action { min-height: 2rem; padding: 0.35rem 0.65rem; border: 0; border-radius: var(--rg-radius-sm, 0.7rem); color: var(--_rg-text-muted); background: transparent; font-size: 0.75rem; font-weight: 720; cursor: pointer; }
    .picker-action:hover:not(:disabled) { color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
    .done-action { min-width: 3.6rem; color: var(--_rg-on-brand); background: var(--_rg-brand); }
    .done-action:hover:not(:disabled) { color: var(--_rg-on-brand); background: var(--_rg-brand-hover); }
    .picker-action:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
    .picker-action:disabled { opacity: 0.35; cursor: not-allowed; }
    :host([size='sm']) .control { min-height: 2.25rem; border-radius: var(--rg-radius-sm, 0.7rem); font-size: 0.875rem; }
    :host([size='lg']) .control { min-height: 3.25rem; border-radius: var(--rg-radius-lg, 1.1rem); font-size: 1.0625rem; }
    :host([overlay-width='full']) .picker-panel { width: 100%; max-width: 100%; }
    :host([overlay-width='full']) .time-view { min-width: 0; }
    :host([dir='rtl']) .picker-panel, :host-context([dir='rtl']) .picker-panel { inset: calc(100% + 0.45rem) 0 auto auto; }
    :host([overlay-align='center']) .picker-panel { inset-inline: 50% auto; translate: -50% 0; }
    :host([overlay-align='end']) .picker-panel { inset-inline: auto 0; }
    @media (max-width: 36rem) {
      .picker-panel { position: fixed; inset: auto 0.5rem 0.5rem; width: calc(100vw - 1rem); max-height: calc(100vh - 1rem); overflow: auto; }
      :host([overlay-width='full']) .picker-panel { width: calc(100vw - 1rem); max-width: calc(100vw - 1rem); }
      :host([overlay-align='center']) .picker-panel,
      :host([overlay-align='end']) .picker-panel { inset: auto 0.5rem 0.5rem; translate: none; }
      .time-view { min-width: 0; }
    }
  `;

  #controlId = '';
  #panelId = '';
  #descriptionId = '';
  #errorId = '';
  #capturedInitialValue = false;
  #draft: RgTimeParts = { hour: 0, minute: 0 };
  #lastValue = '';

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
    return Math.max(1, this.getNumber('step', 60));
  }

  set step(value: number) {
    this.setNumber('step', Math.max(1, value));
  }

  get open(): boolean {
    return this.getBoolean('open');
  }

  set open(value: boolean) {
    this.setBoolean('open', value);
  }

  get overlayWidth(): RgTimePickerOverlayWidth {
    return this.getString('overlay-width') === 'full' ? 'full' : 'auto';
  }

  set overlayWidth(value: RgTimePickerOverlayWidth) {
    this.setString('overlay-width', value === 'auto' ? null : value);
  }

  get overlayAlign(): RgTimePickerOverlayAlign {
    const value = this.getString('overlay-align', 'start');
    return value === 'center' || value === 'end' ? value : 'start';
  }

  set overlayAlign(value: RgTimePickerOverlayAlign) {
    this.setString('overlay-align', value === 'start' ? null : value);
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

  get size(): RgTimePickerSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgTimePickerSize) {
    this.setString('size', value === 'md' ? null : value);
  }

  protected onMount(): void {
    this.#controlId = this.createId('rg-time-picker');
    this.#panelId = `${this.#controlId}-panel`;
    this.#descriptionId = `${this.#controlId}-description`;
    this.#errorId = `${this.#controlId}-error`;
    const control = this.query<HTMLButtonElement>('.picker-control');
    control.id = this.#controlId;
    control.setAttribute('aria-controls', this.#panelId);
    this.query<HTMLLabelElement>('.label').htmlFor = this.#controlId;
    this.query<HTMLElement>('.picker-panel').id = this.#panelId;
    this.query<HTMLElement>('.hint').id = this.#descriptionId;
    this.query<HTMLElement>('.error').id = this.#errorId;
  }

  protected onConnect(signal: AbortSignal): void {
    this.listen(
      this.query<HTMLButtonElement>('.picker-control'),
      'click',
      () => this.#setOpen(!this.open, 'trigger'),
      signal,
    );
    this.listen(
      this.query<HTMLElement>('.picker-panel'),
      'click',
      (event) => this.#handlePanelClick(event as MouseEvent),
      signal,
    );
    this.listen(this, 'keydown', (event) => this.#handleKeyDown(event as KeyboardEvent), signal);
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.update(), signal);
    });
    if (typeof document !== 'undefined') {
      this.listen(
        document,
        'pointerdown',
        (event) => {
          if (this.open && !event.composedPath().includes(this)) this.#setOpen(false, 'outside');
        },
        signal,
        { capture: true },
      );
    }
    if (this.open) queueMicrotask(() => focusSelectedTimeOptions(this.shadowRoot!));
  }

  protected update(): void {
    const validator = this.query<HTMLInputElement>('.validator');
    const control = this.query<HTMLButtonElement>('.picker-control');
    const labelSlot = this.query<HTMLSlotElement>('slot[name="label"]');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const errorSlot = this.query<HTMLSlotElement>('slot[name="error"]');
    const hasLabel = Boolean(this.label) || hasAssignedContent(labelSlot);
    const hasDescription = Boolean(this.description) || hasAssignedContent(descriptionSlot);
    const hasError = Boolean(this.error) || hasAssignedContent(errorSlot);
    const errorMessage = assignedText(errorSlot) || this.error;
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');

    validator.min = '';
    validator.max = '';
    validator.value = this.value;
    if (validator.value !== this.value) {
      this.setString('value', validator.value);
      return;
    }
    const selected = parseTime(this.value);
    const min = parseTime(this.min);
    const max = parseTime(this.max);
    if (this.value !== this.#lastValue) {
      this.#lastValue = this.value;
      this.#draft = selected ?? { hour: 0, minute: 0 };
    }
    if (this.open) this.#draft = constrainTimeToRange(this.#draft, min, max);

    validator.min = this.min;
    validator.max = this.max;
    validator.step = String(this.step);
    validator.required = this.required;
    validator.disabled = disabled;
    control.disabled = disabled || this.readOnly;
    control.setAttribute('aria-expanded', String(this.open));
    control.setAttribute('aria-haspopup', 'dialog');
    this.query<HTMLElement>('[data-display-value]').textContent = selected
      ? formatDisplayTime(selected)
      : '';
    this.query<HTMLElement>('.picker-panel').hidden = !this.open || disabled;
    this.query<HTMLButtonElement>('[data-action="clear"]').disabled = this.required || !selected;

    this.query<HTMLElement>('[data-label]').textContent = this.label;
    this.query<HTMLElement>('[data-description]').textContent = this.description;
    this.query<HTMLElement>('[data-error]').textContent = this.error;
    this.query<HTMLElement>('.label-row').hidden = !hasLabel;
    this.query<HTMLElement>('[data-optional]').hidden = !hasLabel || this.required;
    this.query<HTMLElement>('.hint').hidden = !hasDescription;
    this.query<HTMLElement>('.error').hidden = !hasError;

    validator.setCustomValidity(errorMessage || (this.invalid ? 'Invalid time.' : ''));
    this.mirrorValidity(validator);
    const isInvalid = !validator.validity.valid;
    control.setAttribute('aria-invalid', String(isInvalid));
    if (hasError && isInvalid) control.setAttribute('aria-errormessage', this.#errorId);
    else control.removeAttribute('aria-errormessage');
    const describedBy = [hasDescription ? this.#descriptionId : '', hasError ? this.#errorId : '']
      .filter(Boolean)
      .join(' ');
    if (describedBy) control.setAttribute('aria-describedby', describedBy);
    else control.removeAttribute('aria-describedby');

    renderTimePicker(this.shadowRoot!, this.#draft, (value) => isTimeDisabled(value, min, max));
    this.setFormValue(disabled ? null : this.value, this.value);
    if (!this.#capturedInitialValue) {
      this.initialValue = this.value;
      this.#capturedInitialValue = true;
    }
  }

  show(): void {
    this.#setOpen(true, 'api');
  }

  hide(): void {
    this.#setOpen(false, 'api');
  }

  toggle(): void {
    this.#setOpen(!this.open, 'api');
  }

  protected restoreFormValue(value: string): void {
    this.value = value;
  }

  #handlePanelClick(event: MouseEvent): void {
    const target = (event.target as Element).closest<HTMLElement>(
      '[data-action], [data-time-part]',
    );
    if (!target) return;
    const action = target.dataset['action'];
    if (action === 'clear') {
      this.#commitValue('', true);
      return;
    }
    if (action === 'done') {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      this.#setOpen(false, 'selection');
      this.query<HTMLButtonElement>('.picker-control').focus();
      return;
    }
    const part = target.dataset['timePart'];
    if (
      (part !== 'period' && part !== 'hour' && part !== 'minute') ||
      (target instanceof HTMLButtonElement && target.disabled)
    )
      return;
    this.#draft = constrainTimeToRange(
      updateTimePart(this.#draft, part, target.dataset['value'] ?? ''),
      parseTime(this.min),
      parseTime(this.max),
    );
    this.#commitValue(formatTime(this.#draft), false);
  }

  #commitValue(value: string, close: boolean): void {
    if (this.value !== value) {
      this.value = value;
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }
    if (!close) {
      queueMicrotask(() => focusSelectedTimeOptions(this.shadowRoot!, true));
      return;
    }
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    this.#setOpen(false, 'selection');
    this.query<HTMLButtonElement>('.picker-control').focus();
  }

  #handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.#setOpen(false, 'escape');
      this.query<HTMLButtonElement>('.picker-control').focus();
      return;
    }
    const target = event.composedPath()[0];
    if (!(target instanceof HTMLButtonElement)) return;
    if (handleTimePickerKeyDown(this.shadowRoot!, target, event.key)) event.preventDefault();
  }

  #setOpen(open: boolean, reason: RgPickerOpenReason): void {
    if (this.disabled || this.readOnly || open === this.open) return;
    const accepted = this.emit<RgPickerOpenChangeDetail>(
      'rg-open-change',
      { open, reason },
      { cancelable: true },
    );
    if (!accepted) return;
    this.open = open;
    if (open) {
      this.#draft = constrainTimeToRange(
        parseTime(this.value) ?? { hour: 0, minute: 0 },
        parseTime(this.min),
        parseTime(this.max),
      );
      this.update();
      queueMicrotask(() => {
        focusSelectedTimeOptions(this.shadowRoot!);
        this.shadowRoot
          ?.querySelector<HTMLButtonElement>('.period-list [aria-selected="true"]')
          ?.focus();
      });
    }
  }
}
