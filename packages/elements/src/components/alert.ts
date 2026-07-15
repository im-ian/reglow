import { ReglowElement } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';

export type AlertTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
export type AlertVariant = 'soft' | 'outline';

export interface AlertDismissDetail {
  readonly reason: 'close-button';
}

export class RgAlertElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-alert';
  static readonly observedAttributes = ['tone', 'variant', 'dismissible', 'dismiss-label'];
  static readonly styles = String.raw`
    ${motionStyles}

    :host { display: block; }

    .alert {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      grid-template-areas: 'icon content close';
      align-items: start;
      gap: 0.75rem;
      padding: 0.9rem 1rem;
      border: 1px solid transparent;
      border-radius: var(--rg-radius-lg, 1.125rem);
      color: var(--_rg-text);
      background: var(--_rg-canvas-subtle);
      animation: rg-pop-in var(--_rg-slow) var(--_rg-spring) both;
    }

    .alert[data-icon-empty] {
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas: 'content close';
    }

    .alert[data-close-empty] {
      grid-template-columns: auto minmax(0, 1fr);
      grid-template-areas: 'icon content';
    }

    .alert[data-icon-empty][data-close-empty] {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: 'content';
    }

    :host([tone='brand']) .alert { color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
    :host([tone='success']) .alert { color: var(--_rg-success); background: var(--_rg-success-soft); }
    :host([tone='warning']) .alert { color: var(--_rg-warning); background: var(--_rg-warning-soft); }
    :host([tone='danger']) .alert { color: var(--_rg-danger-text); background: var(--_rg-danger-soft); }
    :host([variant='outline']) .alert { border-color: currentColor; background: var(--_rg-surface); }

    .icon { display: inline-flex; grid-area: icon; align-items: center; min-height: 1.5rem; }
    .content { grid-area: content; min-width: 0; }
    .title { display: block; color: currentColor; font-size: 0.9rem; font-weight: 760; line-height: 1.4; }
    .message { color: var(--_rg-text); font-size: 0.875rem; line-height: 1.55; }
    .title + .message { margin-block-start: 0.15rem; }
    .actions { margin-block-start: 0.65rem; }

    .close {
      display: inline-grid;
      grid-area: close;
      justify-self: end;
      width: 2rem;
      height: 2rem;
      margin: -0.25rem -0.35rem -0.25rem 0;
      padding: 0;
      place-items: center;
      border: 0;
      border-radius: 999px;
      color: currentColor;
      background: transparent;
      cursor: pointer;
      transition: background var(--_rg-fast) var(--_rg-ease), transform var(--_rg-base) var(--_rg-spring);
    }

    .close:hover { background: rgb(23 32 27 / 8%); transform: translateY(-1px); }
    .close:active {
      transform: scale(0.92);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    .close:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
    .close svg { width: 1rem; height: 1rem; stroke: currentColor; }

    slot[name='icon']:not([data-has-content]),
    slot[name='title']:not([data-has-content]),
    slot[name='actions']:not([data-has-content]) { display: none; }
  `;
  static readonly template = String.raw`
    <div class="alert" part="base" aria-atomic="true">
      <span class="icon" part="icon"><slot name="icon"></slot></span>
      <div class="content" part="content">
        <strong class="title" part="title"><slot name="title"></slot></strong>
        <div class="message" part="message"><slot></slot></div>
        <div class="actions" part="actions"><slot name="actions"></slot></div>
      </div>
      <button class="close" part="close" type="button">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
          <path d="M6 6l12 12M18 6 6 18"></path>
        </svg>
      </button>
    </div>
  `;

  get tone(): AlertTone {
    const value = this.getString('tone', 'neutral');
    return ['brand', 'success', 'warning', 'danger'].includes(value)
      ? (value as AlertTone)
      : 'neutral';
  }

  set tone(value: AlertTone) {
    this.setString('tone', value === 'neutral' ? null : value);
  }

  get variant(): AlertVariant {
    return this.getString('variant') === 'outline' ? 'outline' : 'soft';
  }

  set variant(value: AlertVariant) {
    this.setString('variant', value === 'soft' ? null : value);
  }

  get dismissible(): boolean {
    return this.getBoolean('dismissible');
  }

  set dismissible(value: boolean) {
    this.setBoolean('dismissible', value);
  }

  protected onConnect(signal: AbortSignal): void {
    this.listen(this.query('.close'), 'click', () => this.dismiss(), signal);
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.updateSlot(slot), signal);
      this.updateSlot(slot);
    });
  }

  protected update(): void {
    const alert = this.query<HTMLElement>('.alert');
    const close = this.query<HTMLButtonElement>('.close');
    const assertive = this.tone === 'danger' || this.tone === 'warning';

    alert.setAttribute('role', assertive ? 'alert' : 'status');
    alert.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
    close.hidden = !this.dismissible;
    alert.toggleAttribute('data-close-empty', !this.dismissible);
    close.setAttribute('aria-label', this.getString('dismiss-label', 'Dismiss notification'));
  }

  dismiss(): boolean {
    const accepted = this.emit<AlertDismissDetail>(
      'rg-dismiss',
      { reason: 'close-button' },
      { cancelable: true },
    );
    if (accepted) this.hidden = true;
    return accepted;
  }

  private updateSlot(slot: HTMLSlotElement): void {
    const hasContent = slot.assignedNodes({ flatten: true }).length > 0;
    slot.toggleAttribute('data-has-content', hasContent);
    if (slot.name) slot.parentElement?.toggleAttribute('hidden', !hasContent);
    if (slot.name === 'icon') {
      this.query<HTMLElement>('.alert').toggleAttribute('data-icon-empty', !hasContent);
    }
  }
}
