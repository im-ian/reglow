import { FormAssociatedElement } from '../core/form-associated.js';
import { ReglowElement, type InteractionStateDescriptor } from '../core/reglow-element.js';

export type RgSegmentedControlOrientation = 'horizontal' | 'vertical';
export type RgSegmentedControlSize = 'sm' | 'md' | 'lg';

export interface RgSegmentedValueChangeDetail {
  readonly value: string;
  readonly previousValue: string;
}

function isSegment(value: unknown): value is RgSegmentElement {
  return value instanceof HTMLElement && value.localName === 'rg-segment';
}

export class RgSegmentElement extends ReglowElement {
  static readonly tagName = 'rg-segment' as const;
  static readonly interactionState = {
    selected: { events: ['click'], strategy: 'restore' },
  } as const satisfies InteractionStateDescriptor;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = ['disabled', 'selected', 'value'] as const;
  static readonly template = '<span class="segment" part="base segment"><slot></slot></span>';
  static readonly styles = `
    :host {
      display: inline-flex;
      min-width: 0;
      flex: 1 1 var(--_rg-segment-flex-basis, auto);
      border-radius: calc(var(--rg-radius-md, 0.875rem) - 0.2rem);
      color: var(--_rg-text-muted);
      cursor: pointer;
      user-select: none;
    }
    :host(:focus-visible) { outline: none; box-shadow: var(--_rg-ring); }
    :host([disabled]), :host([data-group-disabled]) { cursor: not-allowed; opacity: 0.45; }
    .segment {
      display: inline-flex;
      width: 100%;
      min-height: 2.3rem;
      align-items: center;
      justify-content: center;
      padding: 0.45rem 0.85rem;
      border-radius: inherit;
      font-size: 0.8rem;
      font-weight: 720;
      line-height: 1.2;
      text-align: center;
      transition: color var(--_rg-base) var(--_rg-ease), background var(--_rg-base) var(--_rg-ease),
        box-shadow var(--_rg-base) var(--_rg-ease), transform var(--_rg-base) var(--_rg-spring);
    }
    :host(:hover:not([selected]):not([disabled]):not([data-group-disabled])) .segment { color: var(--_rg-text); background: color-mix(in srgb, var(--_rg-brand-soft) 55%, transparent); }
    :host(:active:not([disabled]):not([data-group-disabled])) .segment {
      transform: scale(0.96);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    :host([selected]) { color: var(--_rg-brand-text); }
    :host([selected]) .segment { background: transparent; box-shadow: none; }
  `;

  #groupDisabled = false;
  #tabStop = false;

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

  setGroupContext(disabled: boolean, tabStop: boolean): void {
    this.#groupDisabled = disabled;
    this.#tabStop = tabStop;
    if (this.shadowRoot) this.update('group');
  }

  protected onConnect(signal: AbortSignal): void {
    this.listen(
      this.query<HTMLSlotElement>('slot'),
      'slotchange',
      () => this.update('slot'),
      signal,
    );
  }

  protected update(_changedAttribute?: string): void {
    const disabled = this.disabled || this.#groupDisabled;
    const label = this.query<HTMLSlotElement>('slot')
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
    this.setAttribute('role', 'radio');
    this.setAttribute('aria-checked', String(this.selected));
    if (label) this.setAttribute('aria-label', label);
    else this.removeAttribute('aria-label');
    if (disabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
    this.toggleAttribute('data-group-disabled', this.#groupDisabled);
    this.tabIndex = !disabled && this.#tabStop ? 0 : -1;
  }
}

export class RgSegmentedControlElement extends FormAssociatedElement {
  static readonly tagName = 'rg-segmented-control' as const;
  static readonly observedAttributes = [
    'disabled',
    'full-width',
    'label',
    'name',
    'orientation',
    'required',
    'size',
    'value',
  ] as const;
  static readonly template = `
    <div class="field" part="base">
      <span class="label" part="label"></span>
      <div class="control" part="control">
        <span class="indicator" part="indicator" aria-hidden="true"></span>
        <slot></slot>
      </div>
    </div>
  `;
  static readonly styles = `
    :host { display: inline-block; max-width: 100%; }
    :host([full-width]) { display: block; width: 100%; }
    .field { display: grid; gap: 0.42rem; }
    .label { color: var(--_rg-text); font-size: 0.82rem; font-weight: 720; }
    .control {
      position: relative;
      display: inline-flex;
      min-width: 0;
      gap: 0.18rem;
      padding: 0.2rem;
      border: 1px solid var(--_rg-border);
      border-radius: var(--rg-radius-md, 0.875rem);
      background: var(--_rg-surface-sunken);
      box-shadow: inset 0 1px 2px rgb(23 32 27 / 7%);
      isolation: isolate;
    }
    .indicator {
      position: absolute;
      inset: 0 auto auto 0;
      z-index: 0;
      width: 0;
      height: 0;
      border-radius: calc(var(--rg-radius-md, 0.875rem) - 0.2rem);
      background: var(--_rg-surface-raised);
      box-shadow: var(--_rg-shadow-xs);
      transform: translate(0, 0);
      transition:
        width var(--_rg-slow) var(--_rg-spring),
        height var(--_rg-slow) var(--_rg-spring),
        transform var(--_rg-slow) var(--_rg-spring);
      pointer-events: none;
    }
    ::slotted(rg-segment) { position: relative; z-index: 1; }
    :host([full-width]) .control { width: 100%; }
    :host([full-width]:not([orientation='vertical'])) ::slotted(rg-segment) {
      --_rg-segment-flex-basis: 0%;
    }
    :host([orientation='vertical']) .control { flex-direction: column; }
    :host([size='sm']) .control { font-size: 0.9em; }
    :host([size='lg']) .control { padding: 0.28rem; font-size: 1.08em; }
    :host([disabled]), :host([data-form-disabled]) { opacity: 0.68; }
  `;

  #labelId = '';
  #frame = 0;
  #capturedInitialValue = false;
  #normalizing = false;
  readonly #ownedSegments = new Set<RgSegmentElement>();

  get value(): string {
    return (
      this.getAttribute('value') ??
      this.#segments().find((segment) => segment.selected)?.value ??
      ''
    );
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

  get orientation(): RgSegmentedControlOrientation {
    return this.getString('orientation', 'horizontal') === 'vertical' ? 'vertical' : 'horizontal';
  }

  set orientation(value: RgSegmentedControlOrientation) {
    this.setString('orientation', value === 'horizontal' ? null : value);
  }

  get size(): RgSegmentedControlSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgSegmentedControlSize) {
    this.setString('size', value === 'md' ? null : value);
  }

  get fullWidth(): boolean {
    return this.getBoolean('full-width');
  }

  set fullWidth(value: boolean) {
    this.setBoolean('full-width', value);
  }

  protected onMount(): void {
    this.#labelId = this.createId('rg-segmented-label');
    this.query<HTMLElement>('.label').id = this.#labelId;
  }

  protected onConnect(signal: AbortSignal): void {
    this.listen(
      this.query<HTMLSlotElement>('slot'),
      'slotchange',
      () => this.update('slot'),
      signal,
    );
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
    if (typeof window !== 'undefined') {
      this.listen(window, 'resize', () => this.#scheduleIndicator(), signal);
    }
  }

  protected onDisconnect(): void {
    if (this.#frame && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.#frame);
    }
    this.#frame = 0;
    this.#ownedSegments.forEach((segment) => segment.setGroupContext(false, false));
    this.#ownedSegments.clear();
  }

  protected update(_changedAttribute?: string): void {
    if (!this.shadowRoot || this.#normalizing) return;
    const segments = this.#segments();
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');
    const control = this.query<HTMLElement>('.control');
    const label = this.query<HTMLElement>('.label');
    const requestedValue = this.getAttribute('value');
    const enabled = segments.filter((segment) => !segment.disabled);
    const selected =
      (requestedValue !== null
        ? enabled.find((segment) => segment.value === requestedValue)
        : enabled.find((segment) => segment.selected)) ?? enabled[0];
    const value = selected?.value ?? '';

    this.#normalizing = true;
    segments.forEach((segment) => {
      segment.selected = segment === selected;
    });
    if (value && this.getAttribute('value') !== value) this.setAttribute('value', value);
    else if (!value) this.removeAttribute('value');
    this.#normalizing = false;

    this.#ownedSegments.forEach((segment) => {
      if (!segments.includes(segment)) segment.setGroupContext(false, false);
    });
    this.#ownedSegments.clear();
    segments.forEach((segment) => this.#ownedSegments.add(segment));
    const focusable = segments.filter((segment) => !segment.disabled);
    const tabStop = focusable.find((segment) => segment.selected) ?? focusable[0];
    segments.forEach((segment) => segment.setGroupContext(disabled, segment === tabStop));

    label.textContent = this.label;
    label.hidden = !this.label;
    control.setAttribute('role', 'radiogroup');
    control.setAttribute('aria-orientation', this.orientation);
    control.setAttribute('aria-disabled', String(disabled));
    control.setAttribute('aria-required', String(this.required));
    if (this.label) control.setAttribute('aria-labelledby', this.#labelId);
    else control.removeAttribute('aria-labelledby');

    const valueMissing = !disabled && this.required && !value;
    if (valueMissing)
      this.internals?.setValidity({ valueMissing: true }, 'Please select an option.');
    else this.internals?.setValidity({});
    control.setAttribute('aria-invalid', String(valueMissing));
    this.setFormValue(disabled || !value ? null : value, value);
    if (!this.#capturedInitialValue) {
      this.initialValue = value;
      this.#capturedInitialValue = true;
    }
    this.#scheduleIndicator();
  }

  protected restoreFormValue(value: string): void {
    this.value = value;
  }

  #handleClick(event: MouseEvent): void {
    if (this.disabled || this.hasAttribute('data-form-disabled')) return;
    const segment = event.composedPath().find(isSegment);
    if (segment && this.#segments().includes(segment)) this.#select(segment, true);
  }

  #handleKeydown(event: KeyboardEvent): void {
    if (this.disabled || this.hasAttribute('data-form-disabled')) return;
    const segment = event.composedPath().find(isSegment);
    const enabled = this.#segments().filter((item) => !item.disabled);
    if (!segment || !enabled.includes(segment)) return;
    const index = enabled.indexOf(segment);
    const previousKey = this.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = this.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    let nextIndex: number | undefined;
    if (event.key === previousKey) nextIndex = index - 1;
    else if (event.key === nextKey) nextIndex = index + 1;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = enabled.length - 1;
    else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.#select(segment, true);
      return;
    } else return;

    event.preventDefault();
    const next = enabled[(nextIndex + enabled.length) % enabled.length];
    if (!next) return;
    this.#select(next, true);
    next.focus();
  }

  #select(segment: RgSegmentElement, notify: boolean): void {
    if (segment.disabled) return;
    const previousValue = this.value;
    if (segment.value === previousValue) {
      segment.focus();
      return;
    }
    this.value = segment.value;
    this.update();
    if (!notify) return;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    this.emit<RgSegmentedValueChangeDetail>('rg-value-change', {
      value: segment.value,
      previousValue,
    });
  }

  #segments(): RgSegmentElement[] {
    return Array.from(this.children).filter(isSegment);
  }

  #scheduleIndicator(): void {
    if (typeof requestAnimationFrame !== 'function') return;
    if (this.#frame) cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(() => {
      this.#frame = 0;
      const selected = this.#segments().find((segment) => segment.selected);
      const control = this.query<HTMLElement>('.control');
      const indicator = this.query<HTMLElement>('.indicator');
      if (!selected) {
        indicator.style.width = '0';
        indicator.style.height = '0';
        return;
      }

      const selectedRect = selected.getBoundingClientRect();
      const controlRect = control.getBoundingClientRect();
      indicator.style.width = `${selectedRect.width}px`;
      indicator.style.height = `${selectedRect.height}px`;
      indicator.style.transform = `translate(${selectedRect.left - controlRect.left - control.clientLeft}px, ${selectedRect.top - controlRect.top - control.clientTop}px)`;
    });
  }
}
