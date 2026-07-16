import { ReglowElement } from '../core/reglow-element.js';

export type ToastTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
export type ToastCloseReason = 'timeout' | 'close-button' | 'api';
export type ToastPosition = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

export interface ToastOpenChangeDetail {
  readonly open: boolean;
  readonly reason: ToastCloseReason;
}

export interface ToastDismissDetail {
  readonly reason: ToastCloseReason;
}

export interface ToastOptions {
  readonly id?: string;
  readonly title?: string;
  readonly message: string;
  readonly tone?: ToastTone;
  readonly duration?: number;
  readonly dismissible?: boolean;
}

let toastId = 0;

export class RgToastElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-toast';
  static readonly observedAttributes = ['open', 'tone', 'duration', 'dismissible', 'dismiss-label'];
  static readonly styles = `
    :host { display: block; pointer-events: auto; }
    :host(:not([open])) { display: none; }

    .toast {
      --_rg-toast-padding-block: 1rem;
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas: 'layout close';
      align-items: start;
      width: min(24rem, calc(100vw - 2rem));
      overflow: hidden;
      border: 1px solid var(--_rg-border);
      border-radius: var(--rg-radius-xl, 1.75rem);
      color: var(--_rg-text);
      background: color-mix(in srgb, var(--_rg-surface-raised) 94%, transparent);
      box-shadow: var(--_rg-shadow-md);
      backdrop-filter: blur(18px);
      animation: rg-toast-in var(--_rg-slow) var(--_rg-spring) both;
    }

    .accent {
      position: absolute;
      inset-block-start: 0.75rem;
      inset-inline-start: 0.75rem;
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      background: color-mix(
        in srgb,
        var(--_rg-toast-accent, var(--_rg-border-strong)) 82%,
        var(--_rg-border)
      );
    }
    :host(:not([tone])) .accent,
    :host([tone='neutral']) .accent { display: none; }
    :host([tone='brand']) { --_rg-toast-accent: var(--_rg-brand); }
    :host([tone='success']) { --_rg-toast-accent: var(--_rg-success); }
    :host([tone='warning']) { --_rg-toast-accent: var(--_rg-warning); }
    :host([tone='danger']) { --_rg-toast-accent: var(--_rg-danger); }

    .layout { display: grid; grid-area: layout; grid-template-columns: auto minmax(0, 1fr); grid-template-areas: 'icon content'; align-items: start; gap: 0.625rem; min-width: 0; padding-block: var(--_rg-toast-padding-block); padding-inline: 1.5rem 0.25rem; }
    .layout[data-icon-empty] { grid-template-columns: minmax(0, 1fr); grid-template-areas: 'content'; }
    .icon {
      display: inline-grid;
      grid-area: icon;
      width: 1.125rem;
      height: 1.125rem;
      align-self: start;
      margin-block-start: 0.0625rem;
      place-items: center;
      color: var(--_rg-text-muted);
    }
    :host([tone='brand']) .icon { color: var(--_rg-brand-text); }
    :host([tone='success']) .icon { color: var(--_rg-success); }
    :host([tone='warning']) .icon { color: var(--_rg-warning); }
    :host([tone='danger']) .icon { color: var(--_rg-danger-text); }
    ::slotted([slot='icon']) { display: inline-grid; width: 1em; height: 1em; place-items: center; line-height: 0; }
    .content { grid-area: content; min-width: 0; }
    .title { display: block; font-size: 0.875rem; font-weight: 760; line-height: 1.4; }
    .message { color: var(--_rg-text-muted); font-size: 0.8125rem; line-height: 1.5; }
    .title + .message { margin-block-start: 0.1rem; }
    .action { margin-block-start: 0.55rem; }

    .close {
      display: inline-grid;
      grid-area: close;
      justify-self: end;
      width: 2rem;
      height: 2rem;
      margin-block-start: 0.65rem;
      margin-inline-end: 0.65rem;
      padding: 0;
      place-items: center;
      border: 0;
      border-radius: 999px;
      color: var(--_rg-text-muted);
      background: transparent;
      cursor: pointer;
      transition: color var(--_rg-fast) var(--_rg-ease), background var(--_rg-fast) var(--_rg-ease),
        transform var(--_rg-base) var(--_rg-spring);
    }
    .close:hover { color: var(--_rg-text); background: var(--_rg-canvas-subtle); }
    .close:active {
      transform: scale(0.92);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    .close:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
    .close svg { width: 1rem; height: 1rem; stroke: currentColor; }

    @keyframes rg-toast-in {
      from { opacity: 0; transform: translateY(0.75rem) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .timer {
      position: absolute;
      inset: auto 0 0;
      height: 2px;
      background: currentColor;
      opacity: 0.36;
      transform-origin: left center;
      animation: rg-toast-timeout linear both;
    }
    .timer[data-paused] { animation-play-state: paused; }
    :host(:dir(rtl)) .timer { transform-origin: right center; }
    .timer[hidden] { display: none; }
    @keyframes rg-toast-timeout { from { transform: scaleX(1); } to { transform: scaleX(0); } }

    slot[name='icon']:not([data-has-content]),
    slot[name='title']:not([data-has-content]),
    slot[name='action']:not([data-has-content]) { display: none; }
  `;
  static readonly template = `
    <div class="toast" part="base" aria-atomic="true">
      <span class="accent" part="accent"></span>
      <div class="layout" part="layout">
        <span class="icon" part="icon"><slot name="icon"></slot></span>
        <div class="content" part="content">
          <strong class="title" part="title"><slot name="title"></slot></strong>
          <div class="message" part="message"><slot></slot></div>
          <div class="action" part="action"><slot name="action"></slot></div>
        </div>
      </div>
      <button class="close" part="close" type="button">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
          <path d="M6 6l12 12M18 6 6 18"></path>
        </svg>
      </button>
      <span class="timer" part="progress"></span>
    </div>
  `;

  #timer: number | undefined;
  #deadline = 0;
  #remaining = 0;
  #wasOpen = false;
  #hovered = false;
  #focused = false;

  get open(): boolean {
    return this.getBoolean('open');
  }

  set open(value: boolean) {
    this.setBoolean('open', value);
  }

  get tone(): ToastTone {
    const value = this.getString('tone', 'neutral');
    return ['brand', 'success', 'warning', 'danger'].includes(value)
      ? (value as ToastTone)
      : 'neutral';
  }

  set tone(value: ToastTone) {
    this.setString('tone', value === 'neutral' ? null : value);
  }

  get duration(): number {
    return this.hasAttribute('duration') ? Math.max(0, this.getNumber('duration', 5000)) : 5000;
  }

  set duration(value: number) {
    this.setNumber('duration', value);
  }

  get dismissible(): boolean {
    return this.getBoolean('dismissible');
  }

  set dismissible(value: boolean) {
    this.setBoolean('dismissible', value);
  }

  protected onConnect(signal: AbortSignal): void {
    const close = this.query<HTMLButtonElement>('.close');
    this.listen(close, 'click', () => this.dismiss('close-button'), signal);
    this.listen(
      this,
      'pointerenter',
      () => {
        this.#hovered = true;
        this.pause();
      },
      signal,
    );
    this.listen(
      this,
      'pointerleave',
      () => {
        this.#hovered = false;
        if (!this.#focused) this.resume();
      },
      signal,
    );
    this.listen(
      this,
      'focusin',
      () => {
        this.#focused = true;
        this.pause();
      },
      signal,
    );
    this.listen(
      this,
      'focusout',
      (event) => {
        const next = (event as FocusEvent).relatedTarget as Node | null;
        if (next && (this.contains(next) || this.shadowRoot?.contains(next))) return;
        this.#focused = false;
        if (!this.#hovered) this.resume();
      },
      signal,
    );

    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.updateSlot(slot), signal);
      this.updateSlot(slot);
    });
  }

  protected onDisconnect(): void {
    this.clearTimer();
  }

  protected update(changedAttribute?: string): void {
    const toast = this.query<HTMLElement>('.toast');
    const close = this.query<HTMLButtonElement>('.close');
    const timer = this.query<HTMLElement>('.timer');
    const assertive = this.tone === 'danger' || this.tone === 'warning';

    toast.setAttribute('role', assertive ? 'alert' : 'status');
    toast.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
    close.hidden = !this.dismissible;
    close.setAttribute('aria-label', this.getString('dismiss-label', 'Dismiss notification'));
    timer.hidden = this.duration <= 0;
    timer.style.animationDuration = `${this.duration}ms`;

    if (this.open !== this.#wasOpen || changedAttribute === 'duration') {
      this.#wasOpen = this.open;
      this.clearTimer();
      if (this.open && this.duration > 0) {
        this.#remaining = this.duration;
        timer.style.animation = 'none';
        void timer.offsetWidth;
        timer.style.removeProperty('animation');
        timer.style.animationDuration = `${this.duration}ms`;
        if (this.#hovered || this.#focused) timer.toggleAttribute('data-paused', true);
        else this.resume();
      }
    }
  }

  pause(): void {
    if (this.#timer === undefined) return;
    this.#remaining = Math.max(0, this.#deadline - performance.now());
    this.clearTimer(false);
    this.query<HTMLElement>('.timer').toggleAttribute('data-paused', true);
  }

  resume(): void {
    if (!this.open || this.duration <= 0 || this.#timer !== undefined || this.#remaining <= 0)
      return;
    this.query<HTMLElement>('.timer').toggleAttribute('data-paused', false);
    this.#deadline = performance.now() + this.#remaining;
    this.#timer = window.setTimeout(() => this.dismiss('timeout'), this.#remaining);
  }

  dismiss(reason: ToastCloseReason = 'api'): boolean {
    if (!this.open) return false;
    const accepted = this.emit<ToastDismissDetail>('rg-dismiss', { reason }, { cancelable: true });
    if (!accepted) return false;

    this.open = false;
    this.emit<ToastOpenChangeDetail>('rg-open-change', { open: false, reason });
    return true;
  }

  private clearTimer(resetRemaining = true): void {
    if (this.#timer !== undefined) window.clearTimeout(this.#timer);
    this.#timer = undefined;
    if (resetRemaining) this.#remaining = 0;
  }

  private updateSlot(slot: HTMLSlotElement): void {
    const hasContent = slot.assignedNodes({ flatten: true }).length > 0;
    slot.toggleAttribute('data-has-content', hasContent);
    if (slot.name) slot.parentElement?.toggleAttribute('hidden', !hasContent);
    if (slot.name === 'icon') {
      this.query<HTMLElement>('.layout').toggleAttribute('data-icon-empty', !hasContent);
    }
  }
}

export class RgToastRegionElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-toast-region';
  static readonly observedAttributes = ['position', 'max-visible', 'label', 'pause-on-hover'];
  static readonly styles = `
    :host {
      position: fixed;
      z-index: var(--rg-z-toast, 1200);
      display: block;
      max-width: calc(100vw - 2rem);
      pointer-events: none;
    }
    :host(:not([position])), :host([position='top-end']) { inset-block-start: 1rem; inset-inline-end: 1rem; }
    :host([position='top-start']) { inset-block-start: 1rem; inset-inline-start: 1rem; }
    :host([position='bottom-start']) { inset-block-end: 1rem; inset-inline-start: 1rem; }
    :host([position='bottom-end']) { inset-block-end: 1rem; inset-inline-end: 1rem; }
    .viewport { display: grid; gap: 0.75rem; margin: 0; padding: 0; pointer-events: none; }
    ::slotted(rg-toast) { pointer-events: auto; }
    :host([position^='bottom']) .viewport { align-items: end; }
  `;
  static readonly template = `
    <section class="viewport" part="viewport" role="region">
      <slot></slot>
    </section>
  `;

  get position(): ToastPosition {
    const value = this.getString('position', 'top-end');
    return ['top-start', 'bottom-start', 'bottom-end'].includes(value)
      ? (value as ToastPosition)
      : 'top-end';
  }

  set position(value: ToastPosition) {
    this.setString('position', value === 'top-end' ? null : value);
  }

  get maxVisible(): number {
    const value = this.hasAttribute('max-visible') ? this.getNumber('max-visible', 4) : 4;
    return Math.max(1, Math.floor(value));
  }

  set maxVisible(value: number) {
    this.setNumber('max-visible', value);
  }

  protected onConnect(signal: AbortSignal): void {
    const slot = this.query<HTMLSlotElement>('slot');
    this.listen(slot, 'slotchange', () => this.enforceLimit(), signal);
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((records) => {
        const toastStateChanged = records.some(
          (record) =>
            record.type === 'attributes' &&
            record.target instanceof HTMLElement &&
            record.target.localName === 'rg-toast',
        );
        if (toastStateChanged) this.enforceLimit();
      });
      observer.observe(this, { attributes: true, attributeFilter: ['open'], subtree: true });
      signal.addEventListener('abort', () => observer.disconnect(), { once: true });
    }
    this.listen(
      this,
      'rg-open-change',
      (event) => {
        const customEvent = event as CustomEvent<ToastOpenChangeDetail>;
        const toast = customEvent.target;
        if (!(toast instanceof HTMLElement) || toast.localName !== 'rg-toast') return;

        if (customEvent.detail.open) {
          this.enforceLimit();
        } else if (toast.hasAttribute('data-rg-imperative')) {
          toast.remove();
        }
      },
      signal,
    );
    this.listen(
      this,
      'pointerenter',
      () => {
        if (this.getBoolean('pause-on-hover')) this.toasts().forEach((toast) => toast.pause());
      },
      signal,
    );
    this.listen(
      this,
      'pointerleave',
      () => {
        if (this.getBoolean('pause-on-hover')) this.toasts().forEach((toast) => toast.resume());
      },
      signal,
    );
  }

  protected update(): void {
    this.query<HTMLElement>('.viewport').setAttribute(
      'aria-label',
      this.getString('label', 'Notifications'),
    );
    this.enforceLimit();
  }

  show(options: ToastOptions): string {
    toastId += 1;
    const id = options.id || `rg-toast-${toastId}`;
    const toast = document.createElement('rg-toast');
    toast.id = id;
    toast.setAttribute('data-rg-imperative', '');
    toast.setAttribute('open', '');
    toast.setAttribute('dismissible', String(options.dismissible !== false));
    if (options.dismissible === false) toast.removeAttribute('dismissible');
    if (options.tone && options.tone !== 'neutral') toast.setAttribute('tone', options.tone);
    if (options.duration !== undefined) toast.setAttribute('duration', String(options.duration));

    if (options.title) {
      const title = document.createElement('span');
      title.slot = 'title';
      title.textContent = options.title;
      toast.append(title);
    }

    const message = document.createElement('span');
    message.textContent = options.message;
    toast.append(message);
    this.append(toast);
    this.enforceLimit();
    this.emit('rg-toast-add', { id, toast });
    return id;
  }

  dismiss(id: string): boolean {
    const toast = this.toasts().find((candidate) => candidate.id === id);
    return toast?.dismiss('api') ?? false;
  }

  clear(): void {
    this.toasts().forEach((toast) => toast.dismiss('api'));
  }

  private toasts(): RgToastElement[] {
    return Array.from(this.children).filter(
      (child): child is RgToastElement => child.localName === 'rg-toast',
    );
  }

  private enforceLimit(): void {
    const openToasts = this.toasts().filter((toast) => toast.hasAttribute('open'));
    while (openToasts.length > this.maxVisible) {
      const oldest = openToasts.shift();
      if (!oldest) break;
      if (oldest.hasAttribute('data-rg-imperative')) oldest.remove();
      else oldest.removeAttribute('open');
    }
  }
}
