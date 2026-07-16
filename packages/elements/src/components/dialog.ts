import { ReglowElement } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';

export type DialogSize = 'sm' | 'md' | 'lg';
export type DialogCloseReason = 'api' | 'close-button' | 'escape' | 'backdrop' | 'native';
export type DialogDismissAction = 'close' | 'none';
export type DrawerPlacement = 'start' | 'end' | 'bottom';

export interface DialogBeforeCloseDetail {
  readonly reason: DialogCloseReason;
  readonly returnValue: string;
}

export interface DialogOpenChangeDetail {
  readonly open: boolean;
  readonly reason: DialogCloseReason;
}

export interface DialogCloseDetail {
  readonly reason: DialogCloseReason;
  readonly returnValue: string;
}

const dialogTemplate = `
  <span class="trigger" part="trigger"><slot name="trigger"></slot></span>
  <dialog class="dialog" part="base">
    <section class="panel" part="dialog panel">
      <header class="header" part="header">
        <h2 class="title" part="title"><slot name="title"></slot></h2>
        <button class="close" part="close" type="button">
          <slot name="close">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
              <path d="M6 6l12 12M18 6 6 18"></path>
            </svg>
          </slot>
        </button>
      </header>
      <div class="body" part="body"><slot></slot></div>
      <footer class="footer" part="footer"><slot name="footer"></slot></footer>
    </section>
  </dialog>
`;

const dialogObservedAttributes = [
  'open',
  'size',
  'label',
  'escape-key-action',
  'backdrop-action',
  'hide-close',
  'close-label',
] as const;
const drawerObservedAttributes = [...dialogObservedAttributes, 'placement'] as const;

const dialogStyles = `
  :host { display: contents; }
  .trigger { display: contents; }
  .dialog {
    width: min(calc(100vw - 2rem), 32rem);
    max-width: none;
    max-height: min(calc(100dvh - 2rem), 44rem);
    margin: auto;
    padding: 0;
    overflow: visible;
    border: 0;
    color: var(--_rg-text);
    background: transparent;
  }
  :host(:not([open])) .dialog slot::slotted(*) { display: none !important; }
  .dialog::backdrop {
    background: var(--rg-dialog-backdrop, var(--_rg-overlay));
    backdrop-filter: blur(3px);
    animation: rg-dialog-backdrop var(--_rg-slow) var(--_rg-ease) both;
  }
  .panel {
    max-height: min(calc(100dvh - 2rem), 44rem);
    overflow: auto;
    border: 1px solid rgb(255 255 255 / 45%);
    border-radius: var(--rg-radius-2xl, 1.5rem);
    background: var(--_rg-surface-raised);
    box-shadow: var(--_rg-shadow-md), var(--_rg-shadow-glow);
    animation: rg-pop-in var(--_rg-expressive) var(--_rg-spring) both;
    overscroll-behavior: contain;
  }
  .header {
    display: flex;
    min-height: 3.5rem;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1rem 0.35rem 1.25rem;
  }
  .header[data-title-empty] { justify-content: flex-end; }
  .title { min-width: 0; margin: 0; overflow-wrap: anywhere; font-size: 1.08rem; font-weight: 780; letter-spacing: -0.025em; line-height: 1.35; }
  .body { padding: 0.8rem 1.25rem 1.25rem; color: var(--_rg-text-muted); font-size: 0.9rem; line-height: 1.65; }
  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.65rem;
    padding: 0.85rem 1.25rem 1.15rem;
    border-block-start: 1px solid var(--_rg-border);
    background: color-mix(in srgb, var(--_rg-canvas-subtle) 60%, transparent);
  }
  .close {
    display: inline-grid;
    width: 2.25rem;
    height: 2.25rem;
    flex: 0 0 auto;
    padding: 0;
    place-items: center;
    border: 0;
    border-radius: 999px;
    color: var(--_rg-text-muted);
    background: var(--_rg-canvas-subtle);
    cursor: pointer;
    transition: color var(--_rg-fast) var(--_rg-ease), background var(--_rg-fast) var(--_rg-ease),
      transform var(--_rg-base) var(--_rg-spring);
  }
  .close:hover { color: var(--_rg-text); background: var(--_rg-surface-sunken); transform: translateY(-1px) rotate(3deg); }
  .close:active {
    transform: scale(0.92);
    transition-duration: var(--_rg-fast);
    transition-timing-function: var(--_rg-ease);
  }
  .close:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
  .close svg { width: 1rem; height: 1rem; stroke: currentColor; }
  :host([size='sm']) .dialog { width: min(calc(100vw - 2rem), 24rem); }
  :host([size='lg']) .dialog { width: min(calc(100vw - 2rem), 44rem); }
  @keyframes rg-dialog-backdrop { from { opacity: 0; } to { opacity: 1; } }
`;

class ReglowDialogElement extends ReglowElement {
  static readonly observedAttributes: readonly string[] = dialogObservedAttributes;
  static get styles(): string {
    return `${motionStyles}${dialogStyles}`;
  }
  static readonly template = dialogTemplate;

  #titleId = '';
  #returnValue = '';
  #closeReason: DialogCloseReason = 'native';
  #notifyOnClose = false;
  #restoreFocus: HTMLElement | null = null;

  initialFocus: HTMLElement | null = null;

  get open(): boolean {
    return this.getBoolean('open');
  }

  set open(value: boolean) {
    this.setBoolean('open', value);
  }

  get size(): DialogSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: DialogSize) {
    this.setString('size', value === 'md' ? null : value);
  }

  get returnValue(): string {
    return (
      this.shadowRoot?.querySelector<HTMLDialogElement>('dialog')?.returnValue ?? this.#returnValue
    );
  }

  set returnValue(value: string) {
    this.#returnValue = value;
    const dialog = this.shadowRoot?.querySelector<HTMLDialogElement>('dialog');
    if (dialog) dialog.returnValue = value;
  }

  protected onMount(): void {
    this.#titleId = this.createId('rg-dialog-title');
    this.query<HTMLElement>('.title').id = this.#titleId;
  }

  protected onConnect(signal: AbortSignal): void {
    const dialog = this.query<HTMLDialogElement>('dialog');
    const close = this.query<HTMLButtonElement>('.close');
    const panel = this.query<HTMLElement>('.panel');
    const triggerSlot = this.query<HTMLSlotElement>('slot[name="trigger"]');
    const titleSlot = this.query<HTMLSlotElement>('slot[name="title"]');
    const footerSlot = this.query<HTMLSlotElement>('slot[name="footer"]');

    this.listen(close, 'click', () => this.requestClose('close-button'), signal);
    this.listen(
      this,
      'click',
      (event) => {
        const path = event.composedPath();
        const closeControl = path.find(
          (node): node is HTMLElement =>
            node instanceof HTMLElement &&
            node.hasAttribute('data-rg-close') &&
            this.contains(node),
        );
        const closeOwner = path.find(
          (node): node is HTMLElement =>
            node instanceof HTMLElement &&
            (node.localName === 'rg-dialog' || node.localName === 'rg-drawer'),
        );
        if (closeControl && closeOwner === this && !event.defaultPrevented && this.open) {
          this.requestClose(
            'close-button',
            closeControl.getAttribute('data-rg-return-value') ?? '',
          );
          return;
        }

        const triggerClicked = triggerSlot
          .assignedElements({ flatten: true })
          .some((trigger) => event.composedPath().includes(trigger));
        if (triggerClicked && !event.defaultPrevented && !this.open) this.showModal();
      },
      signal,
    );
    this.listen(
      dialog,
      'cancel',
      (event) => {
        event.preventDefault();
        if (this.escapeKeyAction === 'close') this.requestClose('escape');
      },
      signal,
    );
    this.listen(dialog, 'close', () => this.onNativeClose(), signal);
    this.listen(
      dialog,
      'click',
      (event) => {
        if (event.target !== dialog || this.backdropAction !== 'close') return;
        const pointer = event as MouseEvent;
        const bounds = panel.getBoundingClientRect();
        const outside =
          pointer.clientX < bounds.left ||
          pointer.clientX > bounds.right ||
          pointer.clientY < bounds.top ||
          pointer.clientY > bounds.bottom;
        if (outside) this.requestClose('backdrop');
      },
      signal,
    );
    this.listen(titleSlot, 'slotchange', () => this.update(), signal);
    this.listen(footerSlot, 'slotchange', () => this.update(), signal);
    this.listen(triggerSlot, 'slotchange', () => this.update(), signal);
  }

  protected update(): void {
    const dialog = this.query<HTMLDialogElement>('dialog');
    const titleSlot = this.query<HTMLSlotElement>('slot[name="title"]');
    const footerSlot = this.query<HTMLSlotElement>('slot[name="footer"]');
    const header = this.query<HTMLElement>('.header');
    const footer = this.query<HTMLElement>('.footer');
    const close = this.query<HTMLButtonElement>('.close');
    const triggerSlot = this.query<HTMLSlotElement>('slot[name="trigger"]');
    const hasTitle = titleSlot.assignedNodes({ flatten: true }).length > 0;
    const hasFooter = footerSlot.assignedNodes({ flatten: true }).length > 0;
    const label = this.getString('label');

    header.toggleAttribute('data-title-empty', !hasTitle);
    footer.hidden = !hasFooter;
    close.hidden = this.getBoolean('hide-close');
    close.setAttribute('aria-label', this.getString('close-label', 'Close dialog'));
    triggerSlot.assignedElements({ flatten: true }).forEach((trigger) => {
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', String(this.open));
    });
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    if (label) {
      dialog.setAttribute('aria-label', label);
      dialog.removeAttribute('aria-labelledby');
    } else if (hasTitle) {
      dialog.removeAttribute('aria-label');
      dialog.setAttribute('aria-labelledby', this.#titleId);
    } else {
      dialog.removeAttribute('aria-label');
      dialog.removeAttribute('aria-labelledby');
    }

    if (this.open && !dialog.open) this.openNativeDialog(dialog);
    else if (!this.open && dialog.open) {
      this.#closeReason = 'api';
      dialog.close(this.#returnValue);
    }
  }

  get escapeKeyAction(): DialogDismissAction {
    return this.getString('escape-key-action') === 'none' ? 'none' : 'close';
  }

  set escapeKeyAction(value: DialogDismissAction) {
    this.setString('escape-key-action', value === 'close' ? null : value);
  }

  get backdropAction(): DialogDismissAction {
    return this.getString('backdrop-action') === 'none' ? 'none' : 'close';
  }

  set backdropAction(value: DialogDismissAction) {
    this.setString('backdrop-action', value === 'close' ? null : value);
  }

  showModal(): void {
    if (this.open) return;
    this.#closeReason = 'api';
    this.open = true;
    this.update();
    this.emit<DialogOpenChangeDetail>('rg-open-change', { open: true, reason: 'api' });
  }

  close(returnValue = ''): void {
    this.requestClose('api', returnValue);
  }

  private openNativeDialog(dialog: HTMLDialogElement): void {
    this.#restoreFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    try {
      dialog.showModal();
    } catch {
      if (!dialog.open) dialog.show();
    }
    if (this.#returnValue) dialog.returnValue = this.#returnValue;
    const focusTarget = this.initialFocus ?? this.querySelector<HTMLElement>('[autofocus]');
    if (focusTarget && typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
    }
  }

  private requestClose(reason: DialogCloseReason, returnValue = ''): boolean {
    if (!this.open) return false;
    const accepted = this.emit<DialogBeforeCloseDetail>(
      'rg-before-close',
      { reason, returnValue },
      { cancelable: true },
    );
    if (!accepted) return false;

    const dialog = this.query<HTMLDialogElement>('dialog');
    this.#returnValue = returnValue;
    this.#closeReason = reason;
    this.#notifyOnClose = true;
    if (dialog.open) dialog.close(returnValue);
    else this.finishClose();
    return true;
  }

  private onNativeClose(): void {
    this.#returnValue = this.query<HTMLDialogElement>('dialog').returnValue;
    this.finishClose();
  }

  private finishClose(): void {
    const wasOpen = this.open;
    this.open = false;
    if (this.#notifyOnClose || wasOpen) {
      this.emit<DialogOpenChangeDetail>('rg-open-change', {
        open: false,
        reason: this.#closeReason,
      });
    }
    this.emit<DialogCloseDetail>('rg-close', {
      reason: this.#closeReason,
      returnValue: this.#returnValue,
    });
    this.#notifyOnClose = false;
    const restore = this.#restoreFocus;
    this.#restoreFocus = null;
    if (restore?.isConnected && typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => restore.focus({ preventScroll: true }));
    }
  }
}

export class RgDialogElement extends ReglowDialogElement {
  static readonly tagName: `rg-${string}` = 'rg-dialog';
}

export class RgDrawerElement extends ReglowDialogElement {
  static readonly tagName: `rg-${string}` = 'rg-drawer';
  static readonly observedAttributes = drawerObservedAttributes;
  static get styles(): string {
    return `${super.styles}
    .dialog {
      width: 100vw;
      height: 100dvh;
      max-width: none;
      max-height: none;
      margin: 0;
      pointer-events: auto;
    }
    .panel {
      position: absolute;
      inset-block: 0;
      inset-inline: auto 0;
      width: min(28rem, calc(100vw - 2rem));
      height: 100%;
      max-height: none;
      border-radius: 0;
      border-start-start-radius: var(--rg-radius-2xl, 1.5rem);
      border-end-start-radius: var(--rg-radius-2xl, 1.5rem);
      animation: rg-drawer-from-end var(--_rg-expressive) var(--_rg-spring) both;
    }
    :host([placement='start']) .panel {
      inset-inline: 0 auto;
      border-radius: 0;
      border-start-end-radius: var(--rg-radius-2xl, 1.5rem);
      border-end-end-radius: var(--rg-radius-2xl, 1.5rem);
      animation-name: rg-drawer-from-start;
    }
    :host([placement='bottom']) .panel {
      inset-block: auto 0;
      inset-inline: 0;
      width: 100%;
      height: min(36rem, calc(100dvh - 2rem));
      border-radius: 0;
      border-start-start-radius: var(--rg-radius-2xl, 1.5rem);
      border-start-end-radius: var(--rg-radius-2xl, 1.5rem);
      animation-name: rg-drawer-from-bottom;
    }
    :host(:dir(rtl)) .panel { animation-name: rg-drawer-from-start; }
    :host(:dir(rtl)[placement='start']) .panel { animation-name: rg-drawer-from-end; }
    :host(:dir(rtl)[placement='bottom']) .panel { animation-name: rg-drawer-from-bottom; }
    @keyframes rg-drawer-from-end { from { opacity: 0; transform: translateX(2.5rem); } to { opacity: 1; transform: none; } }
    @keyframes rg-drawer-from-start { from { opacity: 0; transform: translateX(-2.5rem); } to { opacity: 1; transform: none; } }
    @keyframes rg-drawer-from-bottom { from { opacity: 0; transform: translateY(2.5rem); } to { opacity: 1; transform: none; } }
  `;
  }

  get placement(): DrawerPlacement {
    const value = this.getString('placement', 'end');
    return value === 'start' || value === 'bottom' ? value : 'end';
  }

  set placement(value: DrawerPlacement) {
    this.setString('placement', value === 'end' ? null : value);
  }
}
