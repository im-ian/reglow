import { ReglowElement } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';
import type { RgPopoverPlacement } from './popover.js';

export interface RgMenuSelectDetail {
  readonly value: string;
  readonly item: RgMenuItemElement;
  readonly originalEvent: MouseEvent | KeyboardEvent;
}

export interface RgMenuOpenChangeDetail {
  readonly open: boolean;
  readonly reason: 'trigger' | 'escape' | 'outside' | 'selection' | 'api';
}

function isMenuItem(value: unknown): value is RgMenuItemElement {
  return value instanceof HTMLElement && value.localName === 'rg-menu-item';
}

export class RgMenuItemElement extends ReglowElement {
  static readonly tagName = 'rg-menu-item' as const;
  static readonly observedAttributes = ['disabled', 'value'] as const;
  static readonly delegatesFocus = false;
  static readonly template = `
    <span class="item" part="base item">
      <span class="start" part="start"><slot name="start"></slot></span>
      <span class="label" part="label"><slot></slot></span>
      <span class="end" part="end"><slot name="end"></slot></span>
    </span>
  `;
  static readonly styles = `
    :host { display: block; border-radius: var(--rg-radius-sm, 0.7rem); cursor: pointer; outline: none; }
    :host([disabled]) { opacity: 0.42; cursor: not-allowed; }
    .item {
      display: flex;
      min-height: 2.35rem;
      align-items: center;
      gap: 0.65rem;
      padding: 0.48rem 0.65rem;
      border-radius: inherit;
      color: var(--_rg-text);
      font-size: 0.86rem;
      font-weight: 650;
      transition: color var(--_rg-fast) var(--_rg-ease), background var(--_rg-fast) var(--_rg-ease),
        transform var(--_rg-base) var(--_rg-spring);
    }
    :host(:hover:not([disabled])) .item,
    :host(:focus-visible:not([disabled])) .item { color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
    :host(:active:not([disabled])) .item {
      transform: scale(0.98);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    .label { min-width: 0; flex: 1; }
    .start, .end { display: inline-flex; flex: none; color: var(--_rg-text-muted); }
  `;

  get value(): string {
    return this.hasAttribute('value') ? this.getString('value') : (this.textContent?.trim() ?? '');
  }

  set value(value: string) {
    this.setString('value', value);
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  protected update(): void {
    this.setAttribute('role', 'menuitem');
    this.tabIndex = -1;
    if (this.disabled) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
  }
}

export class RgMenuElement extends ReglowElement {
  static readonly tagName = 'rg-menu' as const;
  static readonly observedAttributes = ['disabled', 'label', 'open', 'placement'] as const;
  static readonly template = `
    <span class="trigger" part="trigger"><slot name="trigger"></slot></span>
    <div class="menu" part="menu" role="menu" hidden><slot></slot></div>
  `;
  static get styles(): string {
    return `
    ${motionStyles}
    :host { display: inline-flex; }
    .trigger { display: contents; }
    .menu {
      position: fixed;
      z-index: var(--rg-z-menu, 1250);
      inset: auto;
      display: grid;
      width: max-content;
      min-width: 11rem;
      max-width: min(20rem, calc(100vw - 1rem));
      gap: 0.18rem;
      padding: 0.35rem;
      border: 1px solid var(--_rg-border);
      border-radius: var(--rg-radius-lg, 1.125rem);
      background: var(--_rg-surface-raised);
      box-shadow: var(--_rg-shadow-md);
      animation: rg-pop-in var(--_rg-slow) var(--_rg-spring) both;
    }
  `;
  }

  #triggerElement: HTMLElement | null = null;
  #menuId = '';
  #activeIndex = -1;

  get open(): boolean {
    return this.getBoolean('open');
  }

  set open(value: boolean) {
    this.setBoolean('open', value);
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  get label(): string {
    return this.getString('label', 'Menu');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get placement(): RgPopoverPlacement {
    const value = this.getString('placement', 'bottom');
    return value === 'top' || value === 'start' || value === 'end' ? value : 'bottom';
  }

  set placement(value: RgPopoverPlacement) {
    this.setString('placement', value === 'bottom' ? null : value);
  }

  protected onMount(): void {
    this.#menuId = this.createId('rg-menu');
    this.query<HTMLElement>('.menu').id = this.#menuId;
  }

  protected onConnect(signal: AbortSignal): void {
    const triggerSlot = this.query<HTMLSlotElement>('slot[name="trigger"]');
    const itemSlot = this.query<HTMLSlotElement>('slot:not([name])');
    this.listen(triggerSlot, 'slotchange', () => this.#syncTrigger(), signal);
    this.listen(itemSlot, 'slotchange', () => this.update(), signal);
    this.listen(this, 'click', (event) => this.#onClick(event as MouseEvent), signal);
    this.listen(this, 'keydown', (event) => this.#onKeyDown(event as KeyboardEvent), signal);
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
    this.#syncTrigger();
  }

  protected update(): void {
    if (this.disabled && this.open) this.open = false;
    const menu = this.query<HTMLElement>('.menu');
    menu.hidden = !this.open;
    menu.setAttribute('aria-label', this.label);
    this.#applyTriggerAria();
    this.#items().forEach((item) => (item.tabIndex = -1));
    if (this.open) this.#position();
  }

  show(): void {
    this.#setOpen(true, 'api');
  }

  hide(): void {
    this.#setOpen(false, 'api');
  }

  #items(): RgMenuItemElement[] {
    return Array.from(this.children).filter(
      (child): child is RgMenuItemElement => isMenuItem(child) && !child.disabled,
    );
  }

  #syncTrigger(): void {
    this.#triggerElement =
      this.query<HTMLSlotElement>('slot[name="trigger"]')
        .assignedElements({ flatten: true })
        .find((element): element is HTMLElement => element instanceof HTMLElement) ?? null;
    this.#applyTriggerAria();
  }

  #applyTriggerAria(): void {
    if (!this.#triggerElement) return;
    this.#triggerElement.setAttribute('aria-controls', this.#menuId);
    this.#triggerElement.setAttribute('aria-expanded', String(this.open));
    this.#triggerElement.setAttribute('aria-haspopup', 'menu');
  }

  #onClick(event: MouseEvent): void {
    const path = event.composedPath();
    if (this.#triggerElement && path.includes(this.#triggerElement)) {
      this.#setOpen(!this.open, 'trigger');
      if (this.open) this.#focus(0);
      return;
    }
    const item = path.find(isMenuItem);
    if (item && !item.disabled) this.#select(item, event);
  }

  #onKeyDown(event: KeyboardEvent): void {
    const items = this.#items();
    if (items.length === 0) return;
    const fromTrigger = Boolean(
      this.#triggerElement && event.composedPath().includes(this.#triggerElement),
    );
    if (!this.open && fromTrigger && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      this.#setOpen(true, 'trigger');
      this.#focus(event.key === 'ArrowUp' ? items.length - 1 : 0);
      return;
    }
    if (!this.open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#setOpen(false, 'escape');
      this.#triggerElement?.focus();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.#focus((this.#activeIndex + 1) % items.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.#focus((this.#activeIndex - 1 + items.length) % items.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.#focus(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.#focus(items.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const item = items[this.#activeIndex];
      if (item) this.#select(item, event);
    }
  }

  #focus(index: number): void {
    const items = this.#items();
    if (items.length === 0) return;
    this.#activeIndex = Math.min(items.length - 1, Math.max(0, index));
    items[this.#activeIndex]?.focus();
  }

  #select(item: RgMenuItemElement, originalEvent: MouseEvent | KeyboardEvent): void {
    const accepted = this.emit<RgMenuSelectDetail>(
      'rg-select',
      { value: item.value, item, originalEvent },
      { cancelable: true },
    );
    if (accepted) {
      this.#setOpen(false, 'selection');
      this.#triggerElement?.focus();
    }
  }

  #setOpen(open: boolean, reason: RgMenuOpenChangeDetail['reason']): void {
    if (this.disabled || open === this.open) return;
    const accepted = this.emit<RgMenuOpenChangeDetail>(
      'rg-open-change',
      { open, reason },
      { cancelable: true },
    );
    if (accepted) {
      this.open = open;
      if (!open) this.#activeIndex = -1;
    }
  }

  #position(): void {
    if (!this.#triggerElement) return;
    const menu = this.query<HTMLElement>('.menu');
    const triggerRect = this.#triggerElement.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const gap = 8;
    let left = triggerRect.left;
    let top = triggerRect.bottom + gap;
    if (this.placement === 'top') top = triggerRect.top - menuRect.height - gap;
    if (this.placement === 'start') {
      left = triggerRect.left - menuRect.width - gap;
      top = triggerRect.top;
    }
    if (this.placement === 'end') {
      left = triggerRect.right + gap;
      top = triggerRect.top;
    }
    menu.style.left = `${Math.max(8, left)}px`;
    menu.style.top = `${Math.max(8, top)}px`;
  }
}
