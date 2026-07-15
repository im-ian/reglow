import { ReglowElement } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';

export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';
export type TooltipOpenReason = 'api' | 'hover' | 'focus' | 'escape';

export interface TooltipOpenChangeDetail {
  readonly open: boolean;
  readonly reason: TooltipOpenReason;
}

type PopoverElement = HTMLElement & {
  showPopover?: () => void;
  hidePopover?: () => void;
};

export class RgTooltipElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-tooltip';
  static readonly observedAttributes = ['content', 'open', 'placement', 'delay', 'disabled'];
  static readonly styles = String.raw`
    ${motionStyles}

    :host { display: inline-flex; }
    .trigger { display: contents; }
    .bubble {
      position: fixed;
      z-index: var(--rg-z-tooltip, 1300);
      inset: auto;
      width: max-content;
      max-width: min(20rem, calc(100vw - 1rem));
      margin: 0;
      padding: 0.48rem 0.66rem;
      overflow: visible;
      border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
      border-radius: var(--rg-radius-sm, 0.65rem);
      color: var(--_rg-surface);
      background: color-mix(in srgb, var(--_rg-text) 94%, transparent);
      box-shadow: var(--_rg-shadow-sm);
      font-size: 0.75rem;
      font-weight: 620;
      line-height: 1.4;
      letter-spacing: -0.005em;
      pointer-events: none;
      animation: rg-pop-in var(--_rg-slow) var(--_rg-spring) both;
    }
    .bubble[hidden] { display: none; }
    .arrow {
      position: absolute;
      width: 0.55rem;
      height: 0.55rem;
      border: inherit;
      border-width: 0 1px 1px 0;
      background: inherit;
      transform: rotate(45deg);
    }
    .bubble[data-placement='top'] .arrow { inset: auto calc(50% - 0.28rem) -0.29rem auto; }
    .bubble[data-placement='bottom'] .arrow { inset: -0.29rem calc(50% - 0.28rem) auto auto; transform: rotate(225deg); }
    .bubble[data-placement='start'] .arrow { inset: calc(50% - 0.28rem) -0.29rem auto auto; transform: rotate(-45deg); }
    .bubble[data-placement='end'] .arrow { inset: calc(50% - 0.28rem) auto auto -0.29rem; transform: rotate(135deg); }
    :host(:dir(rtl)) .bubble[data-placement='start'] .arrow { inset: calc(50% - 0.28rem) auto auto -0.29rem; transform: rotate(135deg); }
    :host(:dir(rtl)) .bubble[data-placement='end'] .arrow { inset: calc(50% - 0.28rem) -0.29rem auto auto; transform: rotate(-45deg); }
    slot[name='content']:not([data-has-content]) { display: none; }
  `;
  static readonly template = String.raw`
    <span class="trigger" part="trigger"><slot name="trigger"></slot></span>
    <div class="bubble" part="bubble" role="tooltip" popover="manual" hidden>
      <slot name="content"></slot><span data-content></span><span class="arrow" part="arrow"></span>
    </div>
  `;

  #trigger: HTMLElement | null = null;
  #previousDescription: string | null = null;
  #appliedDescription = '';
  #showTimer: number | undefined;
  #hideTimer: number | undefined;
  #frame = 0;
  #hovered = false;
  #focused = false;

  get content(): string {
    return this.getString('content');
  }

  set content(value: string) {
    this.setString('content', value);
  }

  get open(): boolean {
    return this.getBoolean('open');
  }

  set open(value: boolean) {
    this.setBoolean('open', value);
  }

  get placement(): TooltipPlacement {
    const value = this.getString('placement', 'top');
    return ['bottom', 'start', 'end'].includes(value) ? (value as TooltipPlacement) : 'top';
  }

  set placement(value: TooltipPlacement) {
    this.setString('placement', value === 'top' ? null : value);
  }

  get delay(): number {
    return this.hasAttribute('delay') ? Math.max(0, this.getNumber('delay', 350)) : 350;
  }

  set delay(value: number) {
    this.setNumber('delay', value);
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  protected onConnect(signal: AbortSignal): void {
    const triggerSlot = this.query<HTMLSlotElement>('slot[name="trigger"]');
    const contentSlot = this.query<HTMLSlotElement>('slot[name="content"]');
    this.listen(triggerSlot, 'slotchange', () => this.updateTrigger(), signal);
    this.listen(contentSlot, 'slotchange', () => this.update(), signal);
    this.listen(this, 'pointerover', (event) => this.onPointerOver(event as PointerEvent), signal);
    this.listen(this, 'pointerout', (event) => this.onPointerOut(event as PointerEvent), signal);
    this.listen(this, 'focusin', (event) => this.onFocusIn(event as FocusEvent), signal);
    this.listen(this, 'focusout', (event) => this.onFocusOut(event as FocusEvent), signal);
    this.listen(
      this,
      'keydown',
      (event) => {
        if ((event as KeyboardEvent).key === 'Escape' && this.open) {
          event.preventDefault();
          this.setOpen(false, 'escape');
        }
      },
      signal,
    );
    if (typeof window !== 'undefined') {
      this.listen(window, 'resize', () => this.schedulePosition(), signal);
      this.listen(window, 'scroll', () => this.schedulePosition(), signal, { capture: true });
    }
    this.updateTrigger();
  }

  protected onDisconnect(): void {
    this.clearTimers();
    this.restoreDescription();
    if (this.#frame && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(this.#frame);
    this.#frame = 0;
  }

  protected update(): void {
    const bubble = this.query<PopoverElement>('.bubble');
    const contentSlot = this.query<HTMLSlotElement>('slot[name="content"]');
    const fallback = this.query<HTMLElement>('[data-content]');
    const hasSlottedContent = contentSlot.assignedNodes({ flatten: true }).length > 0;
    const description = this.content || this.assignedText(contentSlot);

    fallback.textContent = hasSlottedContent ? '' : this.content;
    contentSlot.toggleAttribute('data-has-content', hasSlottedContent);
    bubble.dataset['placement'] = this.placement;
    this.applyDescription(description);

    if (this.open && !this.disabled && this.#trigger && description) this.showBubble(bubble);
    else this.hideBubble(bubble);
  }

  show(): void {
    this.setOpen(true, 'api');
  }

  hide(): void {
    this.setOpen(false, 'api');
  }

  private updateTrigger(): void {
    const trigger = this.query<HTMLSlotElement>('slot[name="trigger"]')
      .assignedElements({ flatten: true })
      .find((element): element is HTMLElement => element instanceof HTMLElement);
    if (trigger === this.#trigger) {
      this.update();
      return;
    }
    this.restoreDescription();
    this.#trigger = trigger ?? null;
    this.#previousDescription = this.#trigger?.getAttribute('aria-description') ?? null;
    this.update();
  }

  private applyDescription(description: string): void {
    if (!this.#trigger) return;
    if (!description) {
      this.restoreDescription(false);
      return;
    }
    this.#appliedDescription = description;
    this.#trigger.setAttribute('aria-description', description);
  }

  private restoreDescription(clearTrigger = true): void {
    if (
      this.#trigger &&
      this.#trigger.getAttribute('aria-description') === this.#appliedDescription
    ) {
      if (this.#previousDescription === null) this.#trigger.removeAttribute('aria-description');
      else this.#trigger.setAttribute('aria-description', this.#previousDescription);
    }
    this.#appliedDescription = '';
    if (clearTrigger) {
      this.#trigger = null;
      this.#previousDescription = null;
    }
  }

  private onPointerOver(event: PointerEvent): void {
    if (!this.eventBelongsToTrigger(event)) return;
    this.#hovered = true;
    this.queueOpen('hover', this.delay);
  }

  private onPointerOut(event: PointerEvent): void {
    if (!this.eventBelongsToTrigger(event)) return;
    const related = event.relatedTarget as Node | null;
    if (related && this.#trigger?.contains(related)) return;
    this.#hovered = false;
    if (!this.#focused) this.queueClose('hover');
  }

  private onFocusIn(event: FocusEvent): void {
    if (!this.eventBelongsToTrigger(event)) return;
    this.#focused = true;
    this.queueOpen('focus', Math.min(this.delay, 150));
  }

  private onFocusOut(event: FocusEvent): void {
    if (!this.eventBelongsToTrigger(event)) return;
    const related = event.relatedTarget as Node | null;
    if (related && this.#trigger?.contains(related)) return;
    this.#focused = false;
    if (!this.#hovered) this.queueClose('focus');
  }

  private eventBelongsToTrigger(event: Event): boolean {
    return Boolean(this.#trigger && event.composedPath().includes(this.#trigger));
  }

  private queueOpen(reason: Extract<TooltipOpenReason, 'hover' | 'focus'>, delay: number): void {
    if (this.disabled || this.open) return;
    if (this.#hideTimer !== undefined) window.clearTimeout(this.#hideTimer);
    if (this.#showTimer !== undefined) window.clearTimeout(this.#showTimer);
    this.#hideTimer = undefined;
    this.#showTimer = window.setTimeout(() => {
      this.#showTimer = undefined;
      this.setOpen(true, reason);
    }, delay);
  }

  private queueClose(reason: Extract<TooltipOpenReason, 'hover' | 'focus'>): void {
    if (this.#showTimer !== undefined) window.clearTimeout(this.#showTimer);
    if (this.#hideTimer !== undefined) window.clearTimeout(this.#hideTimer);
    this.#showTimer = undefined;
    this.#hideTimer = window.setTimeout(() => {
      this.#hideTimer = undefined;
      this.setOpen(false, reason);
    }, 80);
  }

  private setOpen(open: boolean, reason: TooltipOpenReason): void {
    if (this.open === open || (open && this.disabled)) return;
    this.open = open;
    this.emit<TooltipOpenChangeDetail>('rg-open-change', { open, reason });
  }

  private showBubble(bubble: PopoverElement): void {
    bubble.hidden = false;
    if (!this.isPopoverOpen(bubble)) {
      try {
        bubble.showPopover?.();
      } catch {
        bubble.hidden = false;
      }
    }
    this.schedulePosition();
  }

  private hideBubble(bubble: PopoverElement): void {
    if (this.isPopoverOpen(bubble)) {
      try {
        bubble.hidePopover?.();
      } catch {
        // The hidden fallback below is sufficient when the Popover API rejects a stale state.
      }
    }
    bubble.hidden = true;
  }

  private isPopoverOpen(bubble: HTMLElement): boolean {
    try {
      return bubble.matches(':popover-open');
    } catch {
      return !bubble.hidden;
    }
  }

  private schedulePosition(): void {
    if (!this.open || !this.#trigger || typeof requestAnimationFrame !== 'function') return;
    if (this.#frame) cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(() => {
      this.#frame = 0;
      this.positionBubble();
    });
  }

  private positionBubble(): void {
    if (!this.#trigger) return;
    const bubble = this.query<HTMLElement>('.bubble');
    if (bubble.hidden) return;
    const trigger = this.#trigger.getBoundingClientRect();
    const tooltip = bubble.getBoundingClientRect();
    const gap = 9;
    const margin = 8;
    const direction = getComputedStyle(this).direction;
    let top = trigger.top - tooltip.height - gap;
    let left = trigger.left + (trigger.width - tooltip.width) / 2;

    if (this.placement === 'bottom') top = trigger.bottom + gap;
    else if (this.placement === 'start') {
      top = trigger.top + (trigger.height - tooltip.height) / 2;
      left = direction === 'rtl' ? trigger.right + gap : trigger.left - tooltip.width - gap;
    } else if (this.placement === 'end') {
      top = trigger.top + (trigger.height - tooltip.height) / 2;
      left = direction === 'rtl' ? trigger.left - tooltip.width - gap : trigger.right + gap;
    }

    left = Math.max(margin, Math.min(window.innerWidth - tooltip.width - margin, left));
    top = Math.max(margin, Math.min(window.innerHeight - tooltip.height - margin, top));
    bubble.style.left = `${Math.round(left)}px`;
    bubble.style.top = `${Math.round(top)}px`;
  }

  private assignedText(slot: HTMLSlotElement): string {
    return slot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
  }

  private clearTimers(): void {
    if (this.#showTimer !== undefined) window.clearTimeout(this.#showTimer);
    if (this.#hideTimer !== undefined) window.clearTimeout(this.#hideTimer);
    this.#showTimer = undefined;
    this.#hideTimer = undefined;
  }
}
