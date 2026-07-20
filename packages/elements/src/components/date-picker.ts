import { FormAssociatedElement } from '../core/form-associated.js';
import { openInteractionState, type InteractionStateDescriptor } from '../core/reglow-element.js';
import { fieldStyles, motionStyles } from '../styles/base.js';
import {
  addDays,
  addMonths,
  calendarStyles,
  calendarTemplate,
  compareDates,
  formatDate,
  formatDisplayDate,
  isDateDisabled,
  parseDate,
  renderCalendar,
  today,
  type RgDateParts,
  type RgPickerDateFormat,
  type RgPickerOpenChangeDetail,
  type RgPickerOpenReason,
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

export type RgDatePickerSize = 'sm' | 'md' | 'lg';
export type RgDatePickerType = 'native' | 'custom';
export type RgDatePickerDateFormat = RgPickerDateFormat;
export type RgDatePickerOverlayWidth = 'auto' | 'full';
export type RgDatePickerOverlayAlign = 'start' | 'center' | 'end';
export type RgDatePickerOpenChangeDetail = RgPickerOpenChangeDetail;
export type RgDatePickerOpenReason = RgPickerOpenReason;

export class RgDatePickerElement extends FormAssociatedElement {
  static readonly tagName = 'rg-date-picker' as const;
  static readonly interactionState = {
    ...FormAssociatedElement.interactionState,
    ...openInteractionState,
  } as const satisfies InteractionStateDescriptor;
  static readonly observedAttributes = [
    'date-format',
    'description',
    'disabled',
    'error',
    'invalid',
    'label',
    'locale',
    'max',
    'min',
    'name',
    'open',
    'overlay-align',
    'overlay-width',
    'picker',
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
        <input class="control native-control" part="control input" type="date" />
        <button class="control custom-control" part="control input" type="button" hidden>
          <span class="display-value" data-display-value></span>
        </button>
        <svg class="calendar-icon" part="icon" viewBox="0 0 20 20" aria-hidden="true">
          <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
          <path d="M6.5 2.8v3.4M13.5 2.8v3.4M3 8h14" />
        </svg>
        <div class="picker-panel" part="panel" role="dialog" aria-label="Choose a date" hidden>
          ${calendarTemplate()}
          <footer class="picker-footer">
            <button class="picker-action" part="action" data-action="clear" type="button">Clear</button>
            <button class="picker-action today-action" part="action" data-action="today" type="button">Today</button>
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
    ${calendarStyles}
    .control { padding: 0.65rem 2.7rem 0.65rem 0.85rem; color-scheme: light dark; }
    .custom-control { display: flex; align-items: center; text-align: start; cursor: pointer; }
    .custom-control[aria-expanded='true'] { border-color: var(--_rg-focus); box-shadow: var(--_rg-ring), var(--_rg-shadow-xs); }
    .display-value { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .display-value:empty::before { color: var(--_rg-text-subtle); content: 'Choose a date'; }
    .native-control::-webkit-calendar-picker-indicator { position: absolute; inset-inline-end: 0.65rem; opacity: 0; cursor: pointer; }
    .calendar-icon {
      position: absolute; z-index: 2; inset-inline-end: 0.85rem; width: 1.15rem; height: 1.15rem;
      fill: none; stroke: var(--_rg-text-muted); stroke-width: 1.6; stroke-linecap: round; pointer-events: none;
    }
    .picker-panel {
      position: absolute; z-index: var(--rg-z-date-picker, 1150); inset: calc(100% + 0.45rem) auto auto 0;
      width: max-content; max-width: min(21rem, calc(100vw - 1rem)); padding: 0.8rem;
      border: 1px solid var(--_rg-border); border-radius: var(--rg-radius-lg, 1.125rem);
      color: var(--_rg-text); background: var(--_rg-surface-raised); box-shadow: var(--_rg-shadow-md);
      animation: rg-pop-in var(--_rg-slow) var(--_rg-spring) both;
    }
    .picker-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-block-start: 0.65rem; padding-block-start: 0.65rem; border-block-start: 1px solid var(--_rg-border); }
    .picker-action { min-height: 2rem; padding: 0.35rem 0.65rem; border-radius: var(--rg-radius-sm, 0.7rem); color: var(--_rg-text-muted); font-size: 0.75rem; font-weight: 720; }
    .picker-action:hover:not(:disabled) { color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
    .today-action { color: var(--_rg-brand-text); }
    .picker-action:disabled { opacity: 0.35; cursor: not-allowed; }
    :host([size='sm']) .control { min-height: 2.25rem; border-radius: var(--rg-radius-sm, 0.7rem); font-size: 0.875rem; }
    :host([size='lg']) .control { min-height: 3.25rem; border-radius: var(--rg-radius-lg, 1.1rem); font-size: 1.0625rem; }
    :host([overlay-width='full']) .picker-panel { width: 100%; max-width: 100%; }
    :host([overlay-width='full']) .calendar-view { min-width: 0; }
    :host([overlay-width='full']) .calendar-weekdays,
    :host([overlay-width='full']) .calendar-week { grid-template-columns: repeat(7, minmax(0, 1fr)); }
    :host([overlay-width='full']) .calendar-day { min-width: 0; }
    :host([dir='rtl']) .picker-panel, :host-context([dir='rtl']) .picker-panel { inset: calc(100% + 0.45rem) 0 auto auto; }
    :host([overlay-align='center']) .picker-panel { inset-inline: 50% auto; translate: -50% 0; }
    :host([overlay-align='end']) .picker-panel { inset-inline: auto 0; }
    @media (max-width: 36rem) {
      .picker-panel { position: fixed; inset: auto 0.5rem 0.5rem; width: calc(100vw - 1rem); max-height: calc(100vh - 1rem); overflow: auto; }
      :host([overlay-width='full']) .picker-panel { width: calc(100vw - 1rem); max-width: calc(100vw - 1rem); }
      :host([overlay-align='center']) .picker-panel,
      :host([overlay-align='end']) .picker-panel { inset: auto 0.5rem 0.5rem; translate: none; }
      .calendar-view { min-width: 0; }
    }
  `;

  #controlId = '';
  #customControlId = '';
  #panelId = '';
  #descriptionId = '';
  #errorId = '';
  #capturedInitialValue = false;
  #view = { ...today(), day: 1 };
  #focusedDate: RgDateParts | null = null;
  #lastValue = '';
  #overlayOpen = false;
  #restoreFocusOnClose = false;

  get value(): string {
    return this.getString('value');
  }

  set value(value: string | null | undefined) {
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

  get locale(): string {
    return this.getString('locale');
  }

  set locale(value: string) {
    this.setString('locale', value);
  }

  get dateFormat(): RgDatePickerDateFormat {
    const value = this.getString('date-format', 'medium');
    return value === 'short' || value === 'long' || value === 'full' || value === 'iso'
      ? value
      : 'medium';
  }

  set dateFormat(value: RgDatePickerDateFormat) {
    this.setString('date-format', value === 'medium' ? null : value);
  }

  get overlayWidth(): RgDatePickerOverlayWidth {
    return this.getString('overlay-width') === 'full' ? 'full' : 'auto';
  }

  set overlayWidth(value: RgDatePickerOverlayWidth) {
    this.setString('overlay-width', value === 'auto' ? null : value);
  }

  get overlayAlign(): RgDatePickerOverlayAlign {
    const value = this.getString('overlay-align', 'start');
    return value === 'center' || value === 'end' ? value : 'start';
  }

  set overlayAlign(value: RgDatePickerOverlayAlign) {
    this.setString('overlay-align', value === 'start' ? null : value);
  }

  get picker(): RgDatePickerType {
    return this.getString('picker') === 'custom' ? 'custom' : 'native';
  }

  set picker(value: RgDatePickerType) {
    this.setString('picker', value === 'native' ? null : value);
  }

  get open(): boolean {
    return this.getBoolean('open');
  }

  set open(value: boolean) {
    this.setBoolean('open', value);
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
    this.#customControlId = `${this.#controlId}-custom`;
    this.#panelId = `${this.#controlId}-panel`;
    this.#descriptionId = `${this.#controlId}-description`;
    this.#errorId = `${this.#controlId}-error`;
    this.query<HTMLInputElement>('.native-control').id = this.#controlId;
    const customControl = this.query<HTMLButtonElement>('.custom-control');
    customControl.id = this.#customControlId;
    customControl.setAttribute('aria-controls', this.#panelId);
    this.query<HTMLElement>('.picker-panel').id = this.#panelId;
    this.query<HTMLElement>('.hint').id = this.#descriptionId;
    this.query<HTMLElement>('.error').id = this.#errorId;
  }

  protected onConnect(signal: AbortSignal): void {
    this.#overlayOpen = false;
    const nativeControl = this.query<HTMLInputElement>('.native-control');
    this.listen(nativeControl, 'input', (event) => this.#handleNativeEvent(event), signal);
    this.listen(nativeControl, 'change', (event) => this.#handleNativeEvent(event), signal);
    this.listen(
      this.query<HTMLButtonElement>('.custom-control'),
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
  }

  protected update(): void {
    const nativeControl = this.query<HTMLInputElement>('.native-control');
    const customControl = this.query<HTMLButtonElement>('.custom-control');
    const labelSlot = this.query<HTMLSlotElement>('slot[name="label"]');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const errorSlot = this.query<HTMLSlotElement>('slot[name="error"]');
    const hasLabel = Boolean(this.label) || hasAssignedContent(labelSlot);
    const hasDescription = Boolean(this.description) || hasAssignedContent(descriptionSlot);
    const hasError = Boolean(this.error) || hasAssignedContent(errorSlot);
    const errorMessage = assignedText(errorSlot) || this.error;
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');
    const custom = this.picker === 'custom';

    nativeControl.value = this.value;
    if (nativeControl.value !== this.value) {
      this.setString('value', nativeControl.value);
      return;
    }

    const selected = parseDate(this.value);
    if (this.value !== this.#lastValue) {
      this.#lastValue = this.value;
      if (selected) this.#view = { ...selected, day: 1 };
      this.#focusedDate = selected;
    }

    const overlayOpen = custom && this.open;
    const opening = overlayOpen && !this.#overlayOpen;
    const closing = !overlayOpen && this.#overlayOpen;
    this.#overlayOpen = overlayOpen;
    if (closing && this.#restoreFocusOnClose) {
      this.#restoreFocusOnClose = false;
      queueMicrotask(() => {
        if (!this.open && this.isConnected && !customControl.hidden) customControl.focus();
      });
    }
    if (opening) {
      const target = selected ?? today();
      this.#focusedDate = target;
      this.#view = { ...target, day: 1 };
      queueMicrotask(() => {
        if (
          !this.#overlayOpen ||
          !this.isConnected ||
          this.disabled ||
          this.readOnly ||
          this.hasAttribute('data-form-disabled')
        )
          return;
        this.shadowRoot?.querySelector<HTMLButtonElement>('.calendar-day[tabindex="0"]')?.focus();
      });
    }

    nativeControl.name = this.name;
    nativeControl.min = this.min;
    nativeControl.max = this.max;
    nativeControl.step = String(this.step);
    nativeControl.disabled = disabled;
    nativeControl.readOnly = this.readOnly;
    nativeControl.required = this.required;
    nativeControl.hidden = custom;
    customControl.hidden = !custom;
    customControl.disabled = disabled || this.readOnly;
    customControl.setAttribute('aria-expanded', String(custom && this.open));
    customControl.setAttribute('aria-haspopup', 'dialog');
    this.query<HTMLElement>('[data-display-value]').textContent = selected
      ? formatDisplayDate(selected, this.locale, this.dateFormat)
      : '';
    this.query<HTMLElement>('.picker-panel').hidden = !custom || !this.open;
    this.query<HTMLButtonElement>('[data-action="clear"]').disabled = this.required || !selected;
    this.query<HTMLButtonElement>('[data-action="today"]').disabled = isDateDisabled(
      today(),
      parseDate(this.min),
      parseDate(this.max),
    );

    const label = this.query<HTMLLabelElement>('.label');
    label.htmlFor = custom ? this.#customControlId : this.#controlId;
    this.query<HTMLElement>('[data-label]').textContent = this.label;
    this.query<HTMLElement>('[data-description]').textContent = this.description;
    this.query<HTMLElement>('[data-error]').textContent = this.error;
    this.query<HTMLElement>('.label-row').hidden = !hasLabel;
    this.query<HTMLElement>('[data-optional]').hidden = !hasLabel || this.required;
    this.query<HTMLElement>('.hint').hidden = !hasDescription;
    this.query<HTMLElement>('.error').hidden = !hasError;

    nativeControl.setCustomValidity(errorMessage || (this.invalid ? 'Invalid date.' : ''));
    this.mirrorValidity(nativeControl);
    const isInvalid = !nativeControl.validity.valid;
    for (const control of [nativeControl, customControl]) {
      control.setAttribute('aria-invalid', String(isInvalid));
      if (hasError && isInvalid) control.setAttribute('aria-errormessage', this.#errorId);
      else control.removeAttribute('aria-errormessage');
      const describedBy = [hasDescription ? this.#descriptionId : '', hasError ? this.#errorId : '']
        .filter(Boolean)
        .join(' ');
      if (describedBy) control.setAttribute('aria-describedby', describedBy);
      else control.removeAttribute('aria-describedby');
    }

    if (custom) {
      renderCalendar(this.shadowRoot!, {
        view: this.#view,
        selected,
        focused: this.#focusedDate,
        min: parseDate(this.min),
        max: parseDate(this.max),
        locale: this.locale,
      });
    }
    this.setFormValue(disabled ? null : this.value, this.value);
    if (!this.#capturedInitialValue) {
      this.initialValue = this.value;
      this.#capturedInitialValue = true;
    }
  }

  show(): void {
    if (this.picker === 'custom') this.#setOpen(true, 'api');
    else this.query<HTMLInputElement>('.native-control').showPicker?.();
  }

  hide(): void {
    if (this.picker === 'custom') this.#setOpen(false, 'api');
  }

  toggle(): void {
    if (this.picker === 'custom') this.#setOpen(!this.open, 'api');
    else this.show();
  }

  protected restoreFormValue(value: string): void {
    this.value = value;
  }

  #handleNativeEvent(event: Event): void {
    const control = this.query<HTMLInputElement>('.native-control');
    if (this.value !== control.value) this.value = control.value;
    else this.update();
    if (!event.composed)
      this.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
  }

  #handlePanelClick(event: MouseEvent): void {
    const target = (event.target as Element).closest<HTMLElement>('[data-action], [data-date]');
    if (!target) return;
    const action = target.dataset['action'];
    if (action === 'previous-month' || action === 'next-month') {
      this.#view = { ...addMonths(this.#view, action === 'previous-month' ? -1 : 1), day: 1 };
      this.update();
      return;
    }
    if (action === 'clear') {
      this.#commitValue('');
      return;
    }
    if (action === 'today') {
      this.#selectDate(today());
      return;
    }
    const date = parseDate(target.dataset['date'] ?? '');
    if (date && !target.hasAttribute('disabled')) this.#selectDate(date);
  }

  #selectDate(date: RgDateParts): void {
    this.#view = { ...date, day: 1 };
    this.#focusedDate = date;
    this.#commitValue(formatDate(date));
  }

  #commitValue(value: string): void {
    if (this.value !== value) {
      this.value = value;
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    if (this.#setOpen(false, 'selection')) {
      this.query<HTMLButtonElement>('.custom-control').focus();
    }
  }

  #handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      if (this.#setOpen(false, 'escape')) {
        this.query<HTMLButtonElement>('.custom-control').focus();
      }
      return;
    }
    const target = event.composedPath()[0];
    if (!(target instanceof HTMLElement) || !target.matches('.calendar-day')) return;
    const current = parseDate(target.dataset['date'] ?? '');
    if (!current) return;
    let next: RgDateParts | null = null;
    if (event.key === 'ArrowLeft') next = addDays(current, -1);
    if (event.key === 'ArrowRight') next = addDays(current, 1);
    if (event.key === 'ArrowUp') next = addDays(current, -7);
    if (event.key === 'ArrowDown') next = addDays(current, 7);
    if (event.key === 'Home')
      next = addDays(current, -new Date(current.year, current.month - 1, current.day).getDay());
    if (event.key === 'End')
      next = addDays(current, 6 - new Date(current.year, current.month - 1, current.day).getDay());
    if (event.key === 'PageUp') next = addMonths(current, -1);
    if (event.key === 'PageDown') next = addMonths(current, 1);
    if (!next || isDateDisabled(next, parseDate(this.min), parseDate(this.max))) return;
    event.preventDefault();
    this.#focusedDate = next;
    this.#view = { ...next, day: 1 };
    this.update();
    queueMicrotask(() =>
      this.shadowRoot
        ?.querySelector<HTMLButtonElement>(`[data-date="${formatDate(next!)}"]`)
        ?.focus(),
    );
  }

  #setOpen(open: boolean, reason: RgPickerOpenReason): boolean {
    if (this.picker !== 'custom' || this.disabled || this.readOnly || open === this.open)
      return false;
    if (!open && (reason === 'escape' || reason === 'selection')) {
      this.#restoreFocusOnClose = true;
      window.setTimeout(() => {
        if (this.open) this.#restoreFocusOnClose = false;
      });
    }
    const accepted = this.requestOpenChange<RgPickerOpenChangeDetail, RgPickerOpenChangeDetail>(
      { open, reason },
      { open, reason },
      () => {
        this.open = open;
      },
    );
    return accepted && this.open === open;
  }
}
