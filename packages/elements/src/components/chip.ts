import { FormAssociatedElement } from '../core/form-associated.js';
import { ReglowElement } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';

export type RgChipSelection = 'none' | 'single' | 'multiple';
export type RgChipSize = 'sm' | 'md' | 'lg';

export interface RgChipRemoveDetail {
  readonly value: string;
  readonly originalEvent: MouseEvent;
}

export interface RgChipValueChangeDetail {
  readonly value: string | string[];
  readonly previousValue: string | string[];
}

export class RgChipElement extends ReglowElement {
  static readonly tagName = 'rg-chip' as const;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = [
    'aria-label',
    'aria-labelledby',
    'disabled',
    'removable',
    'remove-label',
    'selected',
    'size',
    'value',
  ] as const;
  static readonly template = String.raw`
    <span class="chip" part="base chip">
      <span class="start" part="start"><slot name="start"></slot></span>
      <span class="label" part="label"><slot></slot></span>
      <span class="end" part="end"><slot name="end"></slot></span>
      <button class="remove" part="remove" type="button" data-remove aria-hidden="true">×</button>
    </span>
  `;
  static readonly styles = String.raw`
    ${motionStyles}

    :host {
      display: inline-flex;
      max-width: 100%;
      border-radius: var(--rg-radius-pill, 999px);
      vertical-align: middle;
    }
    :host([data-selectable]) { cursor: pointer; }
    :host(:focus-visible) { outline: none; box-shadow: var(--_rg-ring); }
    .chip {
      display: inline-flex;
      min-width: 0;
      min-height: 2rem;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.7rem;
      border: 1px solid var(--_rg-border);
      border-radius: inherit;
      color: var(--_rg-text);
      background: var(--_rg-surface);
      box-shadow: none;
      font-size: 0.78rem;
      font-weight: 680;
      line-height: 1.2;
      transition: color var(--_rg-base) var(--_rg-ease), border-color var(--_rg-base) var(--_rg-ease),
        background var(--_rg-base) var(--_rg-ease), transform var(--_rg-base) var(--_rg-spring);
    }
    :host([data-selectable]:hover:not([disabled]):not([data-group-disabled])) .chip { border-color: var(--_rg-brand); color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
    :host([data-selectable]:active:not([disabled]):not([data-group-disabled])) .chip {
      transform: scale(0.96);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    :host([selected]) .chip { border-color: var(--_rg-brand); color: var(--_rg-brand-text); background: var(--_rg-brand-soft); box-shadow: none; }
    :host([disabled]), :host([data-group-disabled]) { cursor: not-allowed; opacity: 0.5; }
    :host([size='sm']) .chip { min-height: 1.65rem; padding: 0.2rem 0.55rem; font-size: 0.7rem; }
    :host([size='lg']) .chip { min-height: 2.4rem; padding: 0.42rem 0.85rem; font-size: 0.88rem; }
    .start, .end { display: inline-flex; flex: none; }
    .label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .remove {
      display: inline-grid;
      width: 1.5rem;
      height: 1.5rem;
      margin-block: -0.25rem;
      margin-inline: 0 -0.45rem;
      padding: 0;
      border: 0;
      border-radius: 50%;
      color: currentColor;
      background: transparent;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      place-items: center;
      transition: background-color var(--_rg-fast) var(--_rg-ease), transform var(--_rg-base) var(--_rg-spring);
    }
    .remove:hover:not(:disabled) { background: color-mix(in srgb, currentColor 14%, transparent); }
    .remove:active:not(:disabled) {
      transform: scale(0.88);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    .remove:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
    .remove:disabled { cursor: not-allowed; }
  `;

  #selection: RgChipSelection = 'none';
  #groupDisabled = false;
  #tabStop = false;
  #derivedAriaLabel: string | null = null;

  get value(): string {
    return this.getString('value');
  }

  set value(value: string) {
    this.setString('value', value);
  }

  get selected(): boolean {
    return this.getBoolean('selected');
  }

  set selected(value: boolean) {
    this.setBoolean('selected', value);
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  get removable(): boolean {
    return this.getBoolean('removable');
  }

  set removable(value: boolean) {
    this.setBoolean('removable', value);
  }

  get removeLabel(): string {
    return this.getString('remove-label', 'Remove chip');
  }

  set removeLabel(value: string) {
    this.setString('remove-label', value);
  }

  get size(): RgChipSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgChipSize) {
    this.setString('size', value === 'md' ? null : value);
  }

  setGroupContext(selection: RgChipSelection, disabled: boolean, tabStop: boolean): void {
    this.#selection = selection;
    this.#groupDisabled = disabled;
    this.#tabStop = tabStop;
    if (this.shadowRoot) this.update('group');
  }

  protected onConnect(signal: AbortSignal): void {
    const remove = this.query<HTMLButtonElement>('.remove');
    this.listen(
      remove,
      'click',
      (event) => {
        event.stopPropagation();
        this.emit<RgChipRemoveDetail>(
          'rg-remove',
          { value: this.value, originalEvent: event as MouseEvent },
          { cancelable: true },
        );
      },
      signal,
    );
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.update('slot'), signal);
    });
  }

  protected update(_changedAttribute?: string): void {
    const grouped = this.#selection !== 'none';
    const disabled = this.disabled || this.#groupDisabled;
    const remove = this.query<HTMLButtonElement>('.remove');
    const label = this.query<HTMLSlotElement>('slot:not([name])')
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');

    this.toggleAttribute('data-selectable', grouped);
    this.toggleAttribute('data-group-disabled', this.#groupDisabled);
    if (grouped) {
      this.setAttribute('role', 'option');
      this.setAttribute('aria-selected', String(this.selected));
      this.#syncAccessibleLabel(label);
      this.tabIndex = !disabled && this.#tabStop ? 0 : -1;
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-selected');
      this.#syncAccessibleLabel('');
      this.tabIndex = -1;
    }
    if (disabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');

    remove.hidden = !this.removable;
    remove.disabled = disabled;
    remove.setAttribute(
      'aria-label',
      this.hasAttribute('remove-label') || !label ? this.removeLabel : `Remove ${label}`,
    );
    remove.setAttribute('aria-hidden', String(!this.removable));
  }

  #syncAccessibleLabel(label: string): void {
    const current = this.getAttribute('aria-label');
    const hasAuthoredLabel = current !== null && current !== this.#derivedAriaLabel;
    if (hasAuthoredLabel) {
      this.#derivedAriaLabel = null;
      return;
    }
    if (this.hasAttribute('aria-labelledby')) {
      if (current !== null) this.removeAttribute('aria-label');
      this.#derivedAriaLabel = null;
      return;
    }

    const next = label || null;
    this.#derivedAriaLabel = next;
    if (next !== null && current !== next) this.setAttribute('aria-label', next);
    else if (next === null && current !== null) this.removeAttribute('aria-label');
  }
}

export class RgChipGroupElement extends FormAssociatedElement {
  static readonly tagName = 'rg-chip-group' as const;
  static readonly observedAttributes = [
    'disabled',
    'label',
    'name',
    'required',
    'selection',
    'value',
  ] as const;
  static readonly template = String.raw`
    <div class="group" part="base">
      <span class="label" part="label"></span>
      <div class="chips" part="group"><slot></slot></div>
    </div>
  `;
  static readonly styles = String.raw`
    :host { display: block; }
    .group { display: grid; gap: 0.45rem; }
    .label { color: var(--_rg-text); font-size: 0.82rem; font-weight: 720; }
    .chips { display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center; }
    :host([disabled]), :host([data-form-disabled]) { opacity: 0.72; }
  `;

  #labelId = '';
  #capturedInitialValue = false;
  #normalizing = false;
  readonly #ownedChips = new Set<RgChipElement>();

  get selection(): RgChipSelection {
    const value = this.getString('selection', 'none');
    return value === 'single' || value === 'multiple' ? value : 'none';
  }

  set selection(value: RgChipSelection) {
    this.setString('selection', value === 'none' ? null : value);
  }

  get label(): string {
    return this.getString('label');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get value(): string | string[] {
    if (this.selection === 'multiple') {
      const attribute = this.getAttribute('value');
      return attribute === null
        ? this.#selectedChips().map((chip) => chip.value)
        : this.#parseValues(attribute);
    }
    return this.getAttribute('value') ?? this.#selectedChips()[0]?.value ?? '';
  }

  set value(value: string | string[]) {
    this.#writeValue(value);
  }

  protected onMount(): void {
    this.#labelId = this.createId('rg-chip-group-label');
    this.query<HTMLElement>('.label').id = this.#labelId;
  }

  protected onConnect(signal: AbortSignal): void {
    const slot = this.query<HTMLSlotElement>('slot');
    this.listen(slot, 'slotchange', () => this.update('slot'), signal);
    this.listen(this, 'click', (event) => this.#handleClick(event as MouseEvent), signal);
    this.listen(this, 'keydown', (event) => this.#handleKeydown(event as KeyboardEvent), signal);

    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => this.update('children'));
      observer.observe(this, {
        attributes: true,
        attributeFilter: ['disabled', 'selected', 'value'],
        childList: true,
        subtree: true,
      });
      signal.addEventListener('abort', () => observer.disconnect(), { once: true });
    }
  }

  protected onDisconnect(): void {
    this.#ownedChips.forEach((chip) => chip.setGroupContext('none', false, false));
    this.#ownedChips.clear();
  }

  protected update(_changedAttribute?: string): void {
    if (!this.shadowRoot || this.#normalizing) return;
    const chips = this.#chips();
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');
    const group = this.query<HTMLElement>('.chips');
    const label = this.query<HTMLElement>('.label');
    const requested = this.value;

    this.#normalizing = true;
    if (this.selection === 'multiple') {
      const values = new Set(Array.isArray(requested) ? requested : []);
      if (this.hasAttribute('value'))
        chips.forEach((chip) => (chip.selected = values.has(chip.value)));
    } else if (this.selection === 'single') {
      const value = typeof requested === 'string' ? requested : '';
      let matched = false;
      chips.forEach((chip) => {
        const selected =
          !matched && (this.hasAttribute('value') ? chip.value === value : chip.selected);
        chip.selected = selected;
        if (selected) matched = true;
      });
    } else {
      chips.forEach((chip) => (chip.selected = false));
    }
    this.#normalizing = false;

    this.#ownedChips.forEach((chip) => {
      if (!chips.includes(chip)) chip.setGroupContext('none', false, false);
    });
    this.#ownedChips.clear();
    chips.forEach((chip) => this.#ownedChips.add(chip));

    const focusable = chips.filter((chip) => !chip.disabled);
    const tabStop = focusable.find((chip) => chip.selected) ?? focusable[0];
    chips.forEach((chip) => chip.setGroupContext(this.selection, disabled, chip === tabStop));

    label.textContent = this.label;
    label.hidden = !this.label;
    group.setAttribute('aria-disabled', String(disabled));
    if (this.selection === 'none') {
      group.setAttribute('role', 'group');
      group.removeAttribute('aria-multiselectable');
    } else {
      group.setAttribute('role', 'listbox');
      group.setAttribute('aria-multiselectable', String(this.selection === 'multiple'));
    }
    if (this.label) group.setAttribute('aria-labelledby', this.#labelId);
    else group.removeAttribute('aria-labelledby');

    const current = this.value;
    const hasValue = Array.isArray(current) ? current.length > 0 : current.length > 0;
    if (!disabled && this.required && !hasValue) {
      this.internals?.setValidity({ valueMissing: true }, 'Please select at least one option.');
    } else {
      this.internals?.setValidity({});
    }
    group.setAttribute('aria-invalid', String(!disabled && this.required && !hasValue));
    this.#syncFormValue(current, disabled);
    if (!this.#capturedInitialValue) {
      this.initialValue = JSON.stringify(current);
      this.#capturedInitialValue = true;
    }
  }

  protected restoreFormValue(value: string): void {
    try {
      this.value = JSON.parse(value) as string | string[];
    } catch {
      this.value = value;
    }
  }

  #handleClick(event: MouseEvent): void {
    if (this.selection === 'none' || this.disabled || this.hasAttribute('data-form-disabled'))
      return;
    const chip = event.composedPath().find((item) => item instanceof RgChipElement) as
      RgChipElement | undefined;
    if (!chip || chip.disabled || !this.#chips().includes(chip)) return;
    this.#select(chip, true);
  }

  #handleKeydown(event: KeyboardEvent): void {
    if (this.selection === 'none' || this.disabled || this.hasAttribute('data-form-disabled'))
      return;
    const chip = event.composedPath().find((item) => item instanceof RgChipElement) as
      RgChipElement | undefined;
    const enabled = this.#chips().filter((item) => !item.disabled);
    if (!chip || !enabled.includes(chip)) return;
    const index = enabled.indexOf(chip);
    let nextIndex: number | undefined;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = index - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = index + 1;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = enabled.length - 1;
    else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.#select(chip, true);
      return;
    } else return;

    event.preventDefault();
    const next = enabled[(nextIndex + enabled.length) % enabled.length];
    if (!next) return;
    enabled.forEach((item) => item.setGroupContext(this.selection, false, item === next));
    next.focus();
  }

  #select(chip: RgChipElement, notify: boolean): void {
    const previousValue = this.#cloneValue(this.value);
    if (this.selection === 'multiple') {
      chip.selected = !chip.selected;
      this.#writeValue(this.#selectedChips().map((item) => item.value));
    } else {
      this.#chips().forEach((item) => (item.selected = item === chip));
      this.#writeValue(chip.value);
    }
    const value = this.#cloneValue(this.value);
    if (!notify || this.#sameValue(value, previousValue)) return;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    this.emit<RgChipValueChangeDetail>('rg-value-change', { value, previousValue });
  }

  #writeValue(value: string | string[]): void {
    const serialized = Array.isArray(value) ? JSON.stringify(value) : value;
    this.#normalizing = true;
    if (serialized) this.setAttribute('value', serialized);
    else this.removeAttribute('value');
    this.#normalizing = false;
    if (this.shadowRoot) this.update('value');
  }

  #syncFormValue(value: string | string[], disabled: boolean): void {
    if (disabled || this.selection === 'none' || !this.name) {
      this.setFormValue(null, JSON.stringify(value));
      return;
    }
    if (Array.isArray(value)) {
      if (!value.length) {
        this.setFormValue(null, JSON.stringify(value));
        return;
      }
      const data = new FormData();
      value.forEach((item) => data.append(this.name, item));
      this.setFormValue(data, JSON.stringify(value));
      return;
    }
    this.setFormValue(value || null, JSON.stringify(value));
  }

  #chips(): RgChipElement[] {
    return Array.from(this.children).filter(
      (child): child is RgChipElement => child instanceof RgChipElement,
    );
  }

  #selectedChips(): RgChipElement[] {
    return this.#chips().filter((chip) => chip.selected);
  }

  #parseValues(value: string): string[] {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // Fall through to the declarative comma-separated form.
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  #cloneValue(value: string | string[]): string | string[] {
    return Array.isArray(value) ? [...value] : value;
  }

  #sameValue(left: string | string[], right: string | string[]): boolean {
    return JSON.stringify(left) === JSON.stringify(right);
  }
}
