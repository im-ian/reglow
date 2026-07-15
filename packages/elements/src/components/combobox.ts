import { FormAssociatedElement } from '../core/form-associated.js';
import { fieldStyles, motionStyles } from '../styles/base.js';
import { RgOptionElement, type RgSelectOption } from './select.js';

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

export type RgComboboxFilter = 'contains' | 'starts-with' | 'none';
export type RgComboboxSize = 'sm' | 'md' | 'lg';

export interface RgComboboxOpenChangeDetail {
  readonly open: boolean;
  readonly reason: 'input' | 'toggle' | 'escape' | 'selection' | 'outside' | 'api';
}

export interface RgComboboxValueChangeDetail {
  readonly value: string;
  readonly previousValue: string;
  readonly option: RgSelectOption;
}

export class RgComboboxElement extends FormAssociatedElement {
  static readonly tagName = 'rg-combobox' as const;
  static readonly observedAttributes = [
    'description',
    'disabled',
    'error',
    'filter',
    'invalid',
    'label',
    'name',
    'no-results-text',
    'open',
    'placeholder',
    'readonly',
    'required',
    'size',
    'value',
  ] as const;
  static readonly template = String.raw`
    <div class="field" part="field">
      <div class="label-row" part="label-row">
        <label class="label" part="label"><slot name="label"><span data-label></span></slot></label>
        <span class="optional" data-optional>Optional</span>
      </div>
      <div class="control-wrap" part="control-wrap">
        <input class="control" part="control input" role="combobox" autocomplete="off" />
        <button class="toggle" part="toggle" type="button" tabindex="-1" aria-label="Toggle options">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 6 4.5 4 4.5-4" /></svg>
        </button>
        <div class="listbox" part="listbox" role="listbox" hidden>
          <div data-options></div>
          <div class="empty" part="empty" data-empty hidden></div>
        </div>
      </div>
      <div class="hint" part="description"><slot name="description"><span data-description></span></slot></div>
      <div class="error" part="error" role="alert"><slot name="error"><span data-error></span></slot></div>
      <slot class="source"></slot>
    </div>
  `;
  static readonly styles = String.raw`
    ${fieldStyles}
    ${motionStyles}
    .control { padding: 0.65rem 2.7rem 0.65rem 0.85rem; }
    .toggle {
      position: absolute;
      z-index: 2;
      inset-inline-end: 0.45rem;
      display: grid;
      width: 2rem;
      height: 2rem;
      padding: 0;
      place-items: center;
      border: 0;
      border-radius: var(--rg-radius-sm, 0.7rem);
      color: var(--_rg-text-muted);
      background: transparent;
      cursor: pointer;
    }
    .toggle:hover:not(:disabled) { color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
    .toggle:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
    .toggle svg { width: 1rem; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; transition: transform var(--_rg-base) var(--_rg-spring); }
    :host([open]) .toggle svg { transform: rotate(180deg); }
    .listbox {
      position: absolute;
      z-index: var(--rg-z-combobox, 1100);
      inset: calc(100% + 0.35rem) 0 auto;
      max-height: 16rem;
      overflow: auto;
      padding: 0.35rem;
      border: 1px solid var(--_rg-border);
      border-radius: var(--rg-radius-md, 0.875rem);
      background: var(--_rg-surface-raised);
      box-shadow: var(--_rg-shadow-md);
      animation: rg-pop-in var(--_rg-slow) var(--_rg-spring) both;
    }
    .option {
      display: flex;
      min-height: 2.25rem;
      align-items: center;
      padding: 0.45rem 0.65rem;
      border-radius: var(--rg-radius-sm, 0.7rem);
      color: var(--_rg-text);
      font-size: 0.86rem;
      font-weight: 620;
      cursor: pointer;
    }
    .option:hover, .option[data-active] { color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
    .option[aria-selected='true']::after { margin-inline-start: auto; content: '✓'; font-weight: 800; }
    .option[aria-disabled='true'] { opacity: 0.42; cursor: not-allowed; }
    .empty { padding: 0.7rem; color: var(--_rg-text-muted); font-size: 0.82rem; text-align: center; }
    .source { display: none; }
    :host([size='sm']) .control { min-height: 2.25rem; border-radius: var(--rg-radius-sm, 0.7rem); font-size: 0.875rem; }
    :host([size='lg']) .control { min-height: 3.25rem; border-radius: var(--rg-radius-lg, 1.1rem); font-size: 1.0625rem; }
  `;

  #controlId = '';
  #listboxId = '';
  #descriptionId = '';
  #errorId = '';
  #query = '';
  #activeIndex = -1;
  #providedOptions: readonly RgSelectOption[] | null = null;

  get value(): string {
    return this.getString('value');
  }

  set value(value: string | number) {
    this.setString('value', String(value));
  }

  get options(): readonly RgSelectOption[] {
    return this.#providedOptions ?? this.#optionsFromChildren();
  }

  set options(value: readonly RgSelectOption[] | null | undefined) {
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
    if (this.shadowRoot) this.update();
  }

  get open(): boolean {
    return this.getBoolean('open');
  }

  set open(value: boolean) {
    this.setBoolean('open', value);
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

  get noResultsText(): string {
    return this.getString('no-results-text', 'No results');
  }

  set noResultsText(value: string) {
    this.setString('no-results-text', value);
  }

  get filter(): RgComboboxFilter {
    const value = this.getString('filter', 'contains');
    return value === 'starts-with' || value === 'none' ? value : 'contains';
  }

  set filter(value: RgComboboxFilter) {
    this.setString('filter', value === 'contains' ? null : value);
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

  get size(): RgComboboxSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgComboboxSize) {
    this.setString('size', value === 'md' ? null : value);
  }

  protected onMount(): void {
    this.#controlId = this.createId('rg-combobox');
    this.#listboxId = `${this.#controlId}-listbox`;
    this.#descriptionId = `${this.#controlId}-description`;
    this.#errorId = `${this.#controlId}-error`;
    this.initialValue = this.value;
    const control = this.query<HTMLInputElement>('.control');
    control.id = this.#controlId;
    control.setAttribute('aria-controls', this.#listboxId);
    control.setAttribute('aria-autocomplete', 'list');
    this.query<HTMLLabelElement>('.label').htmlFor = this.#controlId;
    this.query<HTMLElement>('.listbox').id = this.#listboxId;
    this.query<HTMLElement>('.hint').id = this.#descriptionId;
    this.query<HTMLElement>('.error').id = this.#errorId;
  }

  protected onConnect(signal: AbortSignal): void {
    const control = this.query<HTMLInputElement>('.control');
    this.listen(control, 'input', () => this.#onInput(), signal);
    this.listen(control, 'keydown', (event) => this.#onKeyDown(event as KeyboardEvent), signal);
    this.listen(
      this.query<HTMLButtonElement>('.toggle'),
      'click',
      () => {
        if (!this.disabled && !this.readOnly) this.#setOpen(!this.open, 'toggle');
      },
      signal,
    );
    this.listen(
      this.query<HTMLElement>('[data-options]'),
      'click',
      (event) => this.#onOptionClick(event as MouseEvent),
      signal,
    );
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.update(), signal);
    });
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => this.update());
      observer.observe(this, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });
      signal.addEventListener('abort', () => observer.disconnect(), { once: true });
    }
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
    const control = this.query<HTMLInputElement>('.control');
    const labelSlot = this.query<HTMLSlotElement>('slot[name="label"]');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const errorSlot = this.query<HTMLSlotElement>('slot[name="error"]');
    const hasLabel = Boolean(this.label) || hasAssignedContent(labelSlot);
    const hasDescription = Boolean(this.description) || hasAssignedContent(descriptionSlot);
    const hasError = Boolean(this.error) || hasAssignedContent(errorSlot);
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');
    const selected = this.options.find((option) => option.value === this.value);
    if (!this.#query) control.value = selected?.label ?? '';
    control.placeholder = this.placeholder;
    control.disabled = disabled;
    control.readOnly = this.readOnly;
    control.setAttribute('aria-expanded', String(this.open));
    this.query<HTMLButtonElement>('.toggle').disabled = disabled || this.readOnly;
    this.query<HTMLElement>('.listbox').hidden = !this.open;
    this.query<HTMLElement>('[data-label]').textContent = this.label;
    this.query<HTMLElement>('[data-description]').textContent = this.description;
    this.query<HTMLElement>('[data-error]').textContent = this.error;
    this.query<HTMLElement>('.label-row').hidden = !hasLabel;
    this.query<HTMLElement>('[data-optional]').hidden = !hasLabel || this.required;
    this.query<HTMLElement>('.hint').hidden = !hasDescription;
    this.query<HTMLElement>('.error').hidden = !hasError;
    this.#renderOptions();

    const errorMessage = assignedText(errorSlot) || this.error;
    control.setCustomValidity(
      errorMessage || (this.invalid || (this.required && !this.value) ? 'Select an option.' : ''),
    );
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
    this.setFormValue(disabled || !selected ? null : this.value, this.value);
  }

  protected restoreFormValue(value: string): void {
    this.#query = '';
    this.value = value;
  }

  #optionsFromChildren(): readonly RgSelectOption[] {
    return Array.from(this.children)
      .filter((child): child is RgOptionElement => child.localName === RgOptionElement.tagName)
      .map((option) => ({
        value: option.value,
        label: option.label,
        disabled: option.disabled,
        selected: option.selected,
      }));
  }

  #filteredOptions(): readonly RgSelectOption[] {
    const query = this.#query.trim().toLocaleLowerCase();
    if (!query || this.filter === 'none') return this.options;
    return this.options.filter((option) => {
      const label = option.label.toLocaleLowerCase();
      return this.filter === 'starts-with' ? label.startsWith(query) : label.includes(query);
    });
  }

  #renderOptions(): void {
    const records = this.#filteredOptions();
    const fragment = document.createDocumentFragment();
    records.forEach((record, index) => {
      const option = document.createElement('div');
      option.className = 'option';
      option.id = `${this.#listboxId}-option-${index}`;
      option.dataset['index'] = String(index);
      option.setAttribute('role', 'option');
      option.setAttribute('part', 'option');
      option.setAttribute('aria-selected', String(record.value === this.value));
      if (record.disabled) option.setAttribute('aria-disabled', 'true');
      if (index === this.#activeIndex) option.toggleAttribute('data-active', true);
      option.textContent = record.label;
      fragment.append(option);
    });
    this.query<HTMLElement>('[data-options]').replaceChildren(fragment);
    const empty = this.query<HTMLElement>('[data-empty]');
    empty.textContent = this.noResultsText;
    empty.hidden = records.length > 0;
    if (this.#activeIndex >= records.length) this.#activeIndex = -1;
    const active = this.shadowRoot?.querySelector<HTMLElement>('[data-active]') ?? null;
    const control = this.query<HTMLInputElement>('.control');
    if (active) control.setAttribute('aria-activedescendant', active.id);
    else control.removeAttribute('aria-activedescendant');
  }

  #onInput(): void {
    const control = this.query<HTMLInputElement>('.control');
    this.#query = control.value;
    this.#activeIndex = -1;
    if (!this.disabled && !this.readOnly) this.#setOpen(true, 'input');
    else this.update();
  }

  #onKeyDown(event: KeyboardEvent): void {
    const records = this.#filteredOptions();
    const enabledIndices = records.flatMap((option, index) => (option.disabled ? [] : [index]));
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.open) this.#setOpen(true, 'api');
      if (enabledIndices.length > 0) {
        const offset = event.key === 'ArrowDown' ? 1 : -1;
        const currentEnabledIndex = enabledIndices.indexOf(this.#activeIndex);
        const nextEnabledIndex =
          currentEnabledIndex < 0
            ? event.key === 'ArrowDown'
              ? 0
              : enabledIndices.length - 1
            : (currentEnabledIndex + offset + enabledIndices.length) % enabledIndices.length;
        this.#activeIndex = enabledIndices[nextEnabledIndex] ?? -1;
        this.#renderOptions();
      }
    } else if (event.key === 'Enter' && this.open) {
      const option = records[this.#activeIndex];
      if (option) {
        event.preventDefault();
        this.#select(option);
      }
    } else if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.#setOpen(false, 'escape');
    }
  }

  #onOptionClick(event: MouseEvent): void {
    const option = (event.target as Element | null)?.closest<HTMLElement>('[data-index]');
    if (!option) return;
    const record = this.#filteredOptions()[Number(option.dataset['index'])];
    if (record && !record.disabled) this.#select(record);
  }

  #select(option: RgSelectOption): void {
    const previousValue = this.value;
    this.#query = '';
    this.value = option.value;
    this.query<HTMLInputElement>('.control').value = option.label;
    this.#setOpen(false, 'selection');
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    this.emit<RgComboboxValueChangeDetail>('rg-value-change', {
      value: option.value,
      previousValue,
      option,
    });
  }

  #setOpen(open: boolean, reason: RgComboboxOpenChangeDetail['reason']): void {
    if (open === this.open || this.disabled || this.readOnly) {
      this.update();
      return;
    }
    const accepted = this.emit<RgComboboxOpenChangeDetail>(
      'rg-open-change',
      { open, reason },
      { cancelable: true },
    );
    if (accepted) this.open = open;
  }
}
