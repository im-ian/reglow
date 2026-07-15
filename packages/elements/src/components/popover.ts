import { ReglowElement } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';

export type RgPopoverPlacement = 'top' | 'bottom' | 'start' | 'end';
export type RgPopoverTrigger = 'click' | 'manual';
export type RgPopoverOpenReason = 'api' | 'trigger' | 'escape' | 'outside';

export interface RgPopoverOpenChangeDetail {
  readonly open: boolean;
  readonly reason: RgPopoverOpenReason;
}

export class RgPopoverElement extends ReglowElement {
  static readonly tagName = 'rg-popover' as const;
  static readonly observedAttributes = [
    'disabled',
    'label',
    'match-trigger-width',
    'open',
    'placement',
    'trigger',
  ] as const;
  static readonly template = String.raw`
    <span class="trigger" part="trigger"><slot name="trigger"></slot></span>
    <div class="panel" part="panel" popover="manual" tabindex="-1" hidden>
      <slot></slot><span class="arrow" part="arrow" aria-hidden="true"></span>
    </div>
  `;
  static readonly styles = String.raw`
    ${motionStyles}
    :host { display: inline-flex; }
    .trigger { display: contents; }
    .panel {
      position: fixed;
      z-index: var(--rg-z-popover, 1200);
      inset: auto;
      width: max-content;
      max-width: min(24rem, calc(100vw - 1rem));
      margin: 0;
      padding: 0.8rem;
      overflow: visible;
      border: 1px solid var(--_rg-border);
      border-radius: var(--rg-radius-lg, 1.125rem);
      color: var(--_rg-text);
      background: var(--_rg-surface-raised);
      box-shadow: var(--_rg-shadow-md);
      animation: rg-pop-in var(--_rg-slow) var(--_rg-spring) both;
    }
    .panel:focus { outline: none; }
    .panel:focus-visible { box-shadow: var(--_rg-ring), var(--_rg-shadow-md); }
    .arrow {
      position: absolute;
      width: 0.65rem;
      height: 0.65rem;
      border: inherit;
      border-width: 0 1px 1px 0;
      background: inherit;
      transform: rotate(45deg);
    }
    .panel[data-placement='top'] .arrow { inset: auto calc(50% - 0.33rem) -0.34rem auto; }
    .panel[data-placement='bottom'] .arrow { inset: -0.34rem calc(50% - 0.33rem) auto auto; transform: rotate(225deg); }
    .panel[data-placement='start'] .arrow { inset: calc(50% - 0.33rem) -0.34rem auto auto; transform: rotate(-45deg); }
    .panel[data-placement='end'] .arrow { inset: calc(50% - 0.33rem) auto auto -0.34rem; transform: rotate(135deg); }
  `;

  #triggerElement: HTMLElement | null = null;
  #panelId = '';
  #frame = 0;

  get open(): boolean {
    return this.getBoolean('open');
  }

  set open(value: boolean) {
    this.setBoolean('open', value);
  }

  get placement(): RgPopoverPlacement {
    const value = this.getString('placement', 'bottom');
    return value === 'top' || value === 'start' || value === 'end' ? value : 'bottom';
  }

  set placement(value: RgPopoverPlacement) {
    this.setString('placement', value === 'bottom' ? null : value);
  }

  get trigger(): RgPopoverTrigger {
    return this.getString('trigger') === 'manual' ? 'manual' : 'click';
  }

  set trigger(value: RgPopoverTrigger) {
    this.setString('trigger', value === 'click' ? null : value);
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  get label(): string {
    return this.getString('label');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get matchTriggerWidth(): boolean {
    return this.getBoolean('match-trigger-width');
  }

  set matchTriggerWidth(value: boolean) {
    this.setBoolean('match-trigger-width', value);
  }

  protected onMount(): void {
    this.#panelId = this.createId('rg-popover');
    this.query<HTMLElement>('.panel').id = this.#panelId;
  }

  protected onConnect(signal: AbortSignal): void {
    const triggerSlot = this.query<HTMLSlotElement>('slot[name="trigger"]');
    this.listen(triggerSlot, 'slotchange', () => this.#syncTrigger(), signal);
    this.listen(this, 'click', (event) => this.#onClick(event as MouseEvent), signal);
    this.listen(this, 'keydown', (event) => this.#onKeyDown(event as KeyboardEvent), signal);
    if (typeof document !== 'undefined') {
      this.listen(document, 'pointerdown', (event) => this.#onDocumentPointerDown(event), signal, {
        capture: true,
      });
    }
    if (typeof window !== 'undefined') {
      this.listen(window, 'resize', () => this.#schedulePosition(), signal);
      this.listen(window, 'scroll', () => this.#schedulePosition(), signal, { capture: true });
    }
    this.#syncTrigger();
  }

  protected onDisconnect(): void {
    if (this.#frame && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(this.#frame);
    this.#frame = 0;
  }

  protected update(): void {
    if (this.disabled && this.open) this.open = false;
    const panel = this.query<HTMLElement>('.panel');
    panel.hidden = !this.open;
    panel.dataset['placement'] = this.placement;
    if (this.label) panel.setAttribute('aria-label', this.label);
    else panel.removeAttribute('aria-label');
    this.#applyTriggerAria();
    if (this.open) this.#schedulePosition();
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

  #syncTrigger(): void {
    this.#triggerElement =
      this.query<HTMLSlotElement>('slot[name="trigger"]')
        .assignedElements({ flatten: true })
        .find((element): element is HTMLElement => element instanceof HTMLElement) ?? null;
    this.#applyTriggerAria();
    this.update();
  }

  #applyTriggerAria(): void {
    if (!this.#triggerElement) return;
    this.#triggerElement.setAttribute('aria-controls', this.#panelId);
    this.#triggerElement.setAttribute('aria-expanded', String(this.open));
    this.#triggerElement.setAttribute('aria-haspopup', 'dialog');
    if (this.disabled) this.#triggerElement.setAttribute('aria-disabled', 'true');
    else this.#triggerElement.removeAttribute('aria-disabled');
  }

  #onClick(event: MouseEvent): void {
    if (
      this.trigger === 'click' &&
      this.#triggerElement &&
      event.composedPath().includes(this.#triggerElement)
    ) {
      this.#setOpen(!this.open, 'trigger');
    }
  }

  #onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.open) return;
    event.preventDefault();
    this.#setOpen(false, 'escape');
    this.#triggerElement?.focus();
  }

  #onDocumentPointerDown(event: Event): void {
    if (this.open && !event.composedPath().includes(this)) this.#setOpen(false, 'outside');
  }

  #setOpen(open: boolean, reason: RgPopoverOpenReason): void {
    if (this.disabled || open === this.open) return;
    const accepted = this.emit<RgPopoverOpenChangeDetail>(
      'rg-open-change',
      { open, reason },
      { cancelable: true },
    );
    if (accepted) this.open = open;
  }

  #schedulePosition(): void {
    if (!this.open || !this.#triggerElement) return;
    if (this.#frame && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(this.#frame);
    if (typeof requestAnimationFrame === 'function') {
      this.#frame = requestAnimationFrame(() => {
        this.#frame = 0;
        this.#position();
      });
    } else this.#position();
  }

  #position(): void {
    if (!this.#triggerElement) return;
    const panel = this.query<HTMLElement>('.panel');
    const triggerRect = this.#triggerElement.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const gap = 10;
    const margin = 8;
    let left = triggerRect.left + (triggerRect.width - panelRect.width) / 2;
    let top = triggerRect.bottom + gap;
    if (this.placement === 'top') top = triggerRect.top - panelRect.height - gap;
    if (this.placement === 'start') {
      left = triggerRect.left - panelRect.width - gap;
      top = triggerRect.top + (triggerRect.height - panelRect.height) / 2;
    }
    if (this.placement === 'end') {
      left = triggerRect.right + gap;
      top = triggerRect.top + (triggerRect.height - panelRect.height) / 2;
    }
    left = Math.min(
      Math.max(margin, left),
      Math.max(margin, window.innerWidth - panelRect.width - margin),
    );
    top = Math.min(
      Math.max(margin, top),
      Math.max(margin, window.innerHeight - panelRect.height - margin),
    );
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
    panel.style.minWidth = this.matchTriggerWidth ? `${Math.round(triggerRect.width)}px` : '';
  }
}
