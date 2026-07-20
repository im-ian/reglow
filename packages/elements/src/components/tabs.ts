import { ReglowElement, type InteractionStateDescriptor } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivation = 'automatic' | 'manual';

export interface TabsValueChangeDetail {
  readonly value: string;
  readonly previousValue: string;
}

export class RgTabElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-tab';
  static readonly delegatesFocus = false;
  static readonly observedAttributes = [
    'aria-label',
    'aria-labelledby',
    'value',
    'selected',
    'disabled',
  ];
  static readonly styles = `
    :host {
      display: inline-flex;
      min-width: 0;
      border-radius: var(--rg-radius-md, 0.875rem);
      color: var(--_rg-text-muted);
      cursor: pointer;
      user-select: none;
    }
    :host([selected]) { color: var(--_rg-brand-text); }
    :host([disabled]) { opacity: 0.42; cursor: not-allowed; }
    :host(:focus-visible) { outline: none; box-shadow: var(--_rg-ring); }
    .tab {
      display: inline-flex;
      min-height: 2.5rem;
      align-items: center;
      justify-content: center;
      padding: 0.55rem 0.9rem;
      border-radius: inherit;
      font-size: 0.86rem;
      font-weight: 720;
      letter-spacing: -0.01em;
      transition: color var(--_rg-base) var(--_rg-ease), background var(--_rg-base) var(--_rg-ease),
        transform var(--_rg-base) var(--_rg-spring);
    }
    :host(:hover:not([selected]):not([disabled])) .tab { color: var(--_rg-text); background: rgb(83 103 248 / 7%); }
    :host(:active:not([disabled])) .tab {
      transform: scale(0.97);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
  `;
  static readonly template =
    '<span class="tab" part="base"><span part="label"><slot></slot></span></span>';

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

  protected onConnect(signal: AbortSignal): void {
    this.listen(this.query<HTMLSlotElement>('slot'), 'slotchange', () => this.update(), signal);
  }

  protected update(): void {
    const label = this.query<HTMLSlotElement>('slot')
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');

    this.setAttribute('role', 'tab');
    this.setAttribute('aria-selected', String(this.selected));
    this.tabIndex = this.selected && !this.disabled ? 0 : -1;
    this.syncAccessibleLabel(label);
    if (this.disabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
  }

  private syncAccessibleLabel(label: string): void {
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

export class RgTabPanelElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-tab-panel';
  static readonly delegatesFocus = false;
  static readonly observedAttributes = ['value', 'active'];
  static get styles(): string {
    return `
    ${motionStyles}

    :host { display: block; }
    :host([hidden]) { display: none; }
    .panel { padding-block: 1rem; animation: rg-slide-up var(--_rg-slow) var(--_rg-ease) both; }
    .panel:focus { outline: none; }
    .panel:focus-visible { border-radius: var(--rg-radius-md, 0.875rem); box-shadow: var(--_rg-ring); }
  `;
  }
  static readonly template = '<div class="panel" part="base"><slot></slot></div>';

  get value(): string {
    return this.getString('value');
  }

  set value(value: string) {
    this.setString('value', value);
  }

  get active(): boolean {
    return this.getBoolean('active');
  }

  set active(value: boolean) {
    this.setBoolean('active', value);
  }

  protected update(): void {
    this.setAttribute('role', 'tabpanel');
    this.hidden = !this.active;
    this.tabIndex = this.active ? 0 : -1;
  }
}

export class RgTabsElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-tabs';
  static readonly interactionState = {
    value: { events: ['rg-value-change'], strategy: 'restore' },
  } as const satisfies InteractionStateDescriptor;
  static readonly observedAttributes = ['value', 'orientation', 'activation', 'loop'];
  static readonly styles = `
    :host { display: block; }
    .tabs { min-width: 0; }
    .tablist {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.2rem;
      width: fit-content;
      max-width: 100%;
      padding: 0.25rem;
      border: 1px solid var(--_rg-border);
      border-radius: var(--rg-radius-lg, 1.125rem);
      background: var(--_rg-canvas-subtle);
      box-shadow: inset 0 1px 2px rgb(23 32 27 / 5%);
    }
    .indicator {
      position: absolute;
      inset: 0 auto auto 0;
      z-index: 0;
      width: 0;
      height: 0;
      border: 1px solid var(--_rg-border);
      border-radius: var(--rg-radius-md, 0.875rem);
      background: var(--_rg-surface);
      box-shadow: var(--_rg-shadow-xs);
      transform: translate(0, 0);
      transition: width var(--_rg-slow) var(--_rg-spring), height var(--_rg-slow) var(--_rg-spring),
        transform var(--_rg-slow) var(--_rg-spring);
      pointer-events: none;
    }
    slot[name='tab'] { display: contents; }
    ::slotted(rg-tab) { position: relative; z-index: 1; }
    .panels { min-width: 0; }
    :host([orientation='vertical']) .tabs { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 1rem; }
    :host([orientation='vertical']) .tablist { flex-direction: column; align-items: stretch; }
    :host([orientation='vertical']) ::slotted(rg-tab) { display: flex; }
  `;
  static readonly template = `
    <div class="tabs" part="base">
      <div class="tablist" part="tablist">
        <span class="indicator" part="indicator" aria-hidden="true"></span>
        <slot name="tab"></slot>
      </div>
      <div class="panels" part="panels"><slot></slot></div>
    </div>
  `;

  #frame = 0;
  #syncing = false;
  #rovingValue = '';

  get value(): string {
    return this.getString('value');
  }

  set value(value: string) {
    this.setString('value', value);
  }

  get orientation(): TabsOrientation {
    return this.getString('orientation') === 'vertical' ? 'vertical' : 'horizontal';
  }

  set orientation(value: TabsOrientation) {
    this.setString('orientation', value === 'horizontal' ? null : value);
  }

  get activation(): TabsActivation {
    return this.getString('activation') === 'manual' ? 'manual' : 'automatic';
  }

  set activation(value: TabsActivation) {
    this.setString('activation', value === 'automatic' ? null : value);
  }

  get loop(): boolean {
    return this.getBoolean('loop');
  }

  set loop(value: boolean) {
    this.setBoolean('loop', value);
  }

  protected onConnect(signal: AbortSignal): void {
    const tabSlot = this.query<HTMLSlotElement>('slot[name="tab"]');
    const panelSlot = this.query<HTMLSlotElement>('.panels slot');
    this.listen(tabSlot, 'slotchange', () => this.update(), signal);
    this.listen(panelSlot, 'slotchange', () => this.update(), signal);
    this.listen(this, 'click', (event) => this.onClick(event as MouseEvent), signal);
    this.listen(this, 'keydown', (event) => this.onKeyDown(event as KeyboardEvent), signal);
    this.listen(
      this,
      'focusin',
      (event) => {
        if (this.activation !== 'manual') return;
        const tab = this.eventTab(event);
        if (!tab || tab.disabled) return;
        this.#rovingValue = tab.value;
        this.syncTabStops(this.tabs(), tab);
      },
      signal,
    );
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => this.update());
      observer.observe(this, {
        attributes: true,
        attributeFilter: ['disabled', 'value'],
        childList: true,
        subtree: true,
      });
      signal.addEventListener('abort', () => observer.disconnect(), { once: true });
    }
    if (typeof window !== 'undefined') {
      this.listen(window, 'resize', () => this.scheduleIndicator(), signal);
    }
  }

  protected onDisconnect(): void {
    if (this.#frame && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(this.#frame);
    this.#frame = 0;
  }

  protected update(): void {
    if (this.#syncing) return;
    this.#syncing = true;
    this.normalizeSlots();

    const tabs = this.tabs();
    const panels = this.panels();
    tabs.forEach((tab, index) => {
      if (!tab.value) tab.value = tab.id || `tab-${index + 1}`;
      if (!tab.id) tab.id = this.createId('rg-tab');
    });
    panels.forEach((panel, index) => {
      if (!panel.value && tabs[index]) panel.value = tabs[index].value;
      if (!panel.id) panel.id = this.createId('rg-tab-panel');
    });

    const enabled = tabs.filter((tab) => !tab.disabled);
    let selected = enabled.find((tab) => tab.value === this.value) ?? enabled[0];
    if (!selected && tabs.length > 0) selected = tabs[0];
    const nextValue = selected?.value ?? '';
    if (nextValue !== this.value) this.setString('value', nextValue || null);
    const roving =
      this.activation === 'manual'
        ? (enabled.find((tab) => tab.value === this.#rovingValue) ?? selected)
        : selected;
    this.#rovingValue = roving?.value ?? '';

    tabs.forEach((tab) => {
      tab.selected = tab === selected;
      const panel = panels.find((candidate) => candidate.value === tab.value);
      if (panel) {
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('aria-labelledby', tab.id);
      } else {
        tab.removeAttribute('aria-controls');
      }
    });
    panels.forEach((panel) => {
      panel.active = panel.value === nextValue;
    });
    this.syncTabStops(tabs, roving);

    const tablist = this.query<HTMLElement>('.tablist');
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-orientation', this.orientation);
    this.#syncing = false;
    this.scheduleIndicator();
  }

  private tabs(): RgTabElement[] {
    return this.query<HTMLSlotElement>('slot[name="tab"]')
      .assignedElements({ flatten: true })
      .filter((element): element is RgTabElement => element.localName === 'rg-tab');
  }

  private normalizeSlots(): void {
    Array.from(this.children).forEach((child) => {
      if (child.localName === 'rg-tab' && !child.hasAttribute('slot')) {
        child.setAttribute('slot', 'tab');
      }
    });
  }

  private panels(): RgTabPanelElement[] {
    return this.query<HTMLSlotElement>('.panels slot')
      .assignedElements({ flatten: true })
      .filter((element): element is RgTabPanelElement => element.localName === 'rg-tab-panel');
  }

  private eventTab(event: Event): RgTabElement | undefined {
    return event
      .composedPath()
      .find(
        (target): target is RgTabElement =>
          target instanceof HTMLElement && target.localName === 'rg-tab',
      );
  }

  private onClick(event: MouseEvent): void {
    const tab = this.eventTab(event);
    if (!tab) return;
    if (tab.disabled) {
      event.preventDefault();
      return;
    }
    this.select(tab, true);
  }

  private onKeyDown(event: KeyboardEvent): void {
    const current = this.eventTab(event);
    if (!current || current.disabled) return;
    const enabled = this.tabs().filter((tab) => !tab.disabled);
    const index = enabled.indexOf(current);
    if (index < 0) return;

    let nextIndex: number | undefined;
    const previousKey = this.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = this.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

    if (event.key === previousKey) nextIndex = index - 1;
    else if (event.key === nextKey) nextIndex = index + 1;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = enabled.length - 1;
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(current, true);
      return;
    } else {
      return;
    }

    event.preventDefault();
    if (this.loop) nextIndex = (nextIndex + enabled.length) % enabled.length;
    else nextIndex = Math.max(0, Math.min(enabled.length - 1, nextIndex));
    const next = enabled[nextIndex];
    if (!next) return;
    this.#rovingValue = next.value;
    next.focus();
    if (this.activation === 'automatic') this.select(next, true);
    else this.syncTabStops(enabled, next);
  }

  private select(tab: RgTabElement, notify: boolean): void {
    if (tab.disabled) return;
    this.#rovingValue = tab.value;
    const previousValue = this.value;
    if (tab.value === previousValue) {
      tab.focus();
      return;
    }
    this.value = tab.value;
    this.update();
    if (notify) {
      this.emit<TabsValueChangeDetail>('rg-value-change', {
        value: tab.value,
        previousValue,
      });
    }
  }

  private syncTabStops(tabs: readonly RgTabElement[], focusable?: RgTabElement): void {
    tabs.forEach((tab) => {
      tab.tabIndex = tab === focusable && !tab.disabled ? 0 : -1;
    });
  }

  private scheduleIndicator(): void {
    if (typeof requestAnimationFrame !== 'function') return;
    if (this.#frame) cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(() => {
      this.#frame = 0;
      const selected = this.tabs().find((tab) => tab.selected);
      const list = this.query<HTMLElement>('.tablist');
      const indicator = this.query<HTMLElement>('.indicator');
      if (!selected) {
        indicator.style.width = '0';
        indicator.style.height = '0';
        return;
      }
      const selectedRect = selected.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      indicator.style.width = `${selectedRect.width}px`;
      indicator.style.height = `${selectedRect.height}px`;
      indicator.style.transform = `translate(${selectedRect.left - listRect.left - list.clientLeft}px, ${selectedRect.top - listRect.top - list.clientTop}px)`;
    });
  }
}
