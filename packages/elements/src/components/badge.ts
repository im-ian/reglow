import { ReglowElement } from '../core/reglow-element.js';

export type RgBadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
export type RgBadgeVariant = 'soft' | 'outline' | 'solid';
export type RgBadgeSize = 'sm' | 'md' | 'lg';

export interface RgBadgeRemoveDetail {
  readonly reason: 'remove-button';
  readonly originalEvent: MouseEvent;
}

const badgeTones = new Set<RgBadgeTone>(['neutral', 'brand', 'success', 'warning', 'danger']);
const badgeVariants = new Set<RgBadgeVariant>(['soft', 'outline', 'solid']);
const badgeSizes = new Set<RgBadgeSize>(['sm', 'md', 'lg']);

export class RgBadgeElement extends ReglowElement {
  static readonly tagName = 'rg-badge' as const;
  static readonly observedAttributes = [
    'dot',
    'removable',
    'remove-label',
    'size',
    'tone',
    'variant',
  ] as const;

  static readonly template = String.raw`
    <span class="badge" part="base badge">
      <span class="dot" part="dot" aria-hidden="true"></span>
      <span class="start" part="start"><slot name="start"></slot></span>
      <span class="label" part="label"><slot></slot></span>
      <span class="end" part="end"><slot name="end"></slot></span>
      <button class="remove" part="remove" type="button" hidden>
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <path d="M4.5 4.5l7 7m0-7l-7 7"></path>
        </svg>
      </button>
    </span>
  `;

  static readonly styles = String.raw`
    :host {
      display: inline-flex;
      max-width: 100%;
      vertical-align: middle;
    }

    .badge {
      --_rg-badge-tone: var(--_rg-text-muted);
      --_rg-badge-soft: var(--_rg-canvas-subtle);
      --_rg-badge-on-tone: var(--_rg-surface);
      display: inline-flex;
      max-width: 100%;
      min-height: 1.65rem;
      align-items: center;
      justify-content: center;
      gap: 0.32rem;
      padding: 0.18rem 0.62rem;
      border: 1px solid color-mix(in srgb, var(--_rg-badge-tone) 18%, var(--_rg-border));
      border-radius: var(--rg-radius-pill, 999px);
      color: var(--_rg-badge-tone);
      background: var(--_rg-badge-soft);
      box-shadow: inset 0 1px 0 rgb(255 255 255 / 25%);
      font-size: 0.75rem;
      font-weight: 750;
      letter-spacing: 0.006em;
      line-height: 1.15;
      transition:
        color var(--_rg-base) var(--_rg-ease),
        background-color var(--_rg-base) var(--_rg-ease),
        border-color var(--_rg-base) var(--_rg-ease),
        transform var(--_rg-fast) var(--_rg-spring);
    }

    :host([tone='brand']) .badge {
      --_rg-badge-tone: var(--_rg-brand-text);
      --_rg-badge-soft: var(--_rg-brand-soft);
      --_rg-badge-on-tone: var(--_rg-on-brand);
    }

    :host([tone='success']) .badge {
      --_rg-badge-tone: var(--_rg-success);
      --_rg-badge-soft: var(--_rg-success-soft);
      --_rg-badge-on-tone: var(--_rg-surface);
    }

    :host([tone='warning']) .badge {
      --_rg-badge-tone: var(--_rg-warning);
      --_rg-badge-soft: var(--_rg-warning-soft);
      --_rg-badge-on-tone: var(--_rg-surface);
    }

    :host([tone='danger']) .badge {
      --_rg-badge-tone: var(--_rg-danger-text);
      --_rg-badge-soft: var(--_rg-danger-soft);
      --_rg-badge-on-tone: var(--_rg-surface);
    }

    :host([variant='outline']) .badge {
      background: transparent;
      border-color: currentColor;
      box-shadow: none;
    }

    :host([variant='solid']) .badge {
      color: var(--_rg-badge-on-tone);
      background: var(--_rg-badge-tone);
      border-color: transparent;
      box-shadow: var(--_rg-shadow-xs);
    }

    :host([size='sm']) .badge {
      min-height: 1.35rem;
      gap: 0.25rem;
      padding: 0.12rem 0.48rem;
      font-size: 0.67rem;
    }

    :host([size='lg']) .badge {
      min-height: 2rem;
      gap: 0.4rem;
      padding: 0.24rem 0.75rem;
      font-size: 0.84rem;
    }

    .dot {
      display: none;
      width: 0.48em;
      height: 0.48em;
      flex: 0 0 auto;
      border-radius: 50%;
      background: currentColor;
      box-shadow: 0 0 0 0.16em color-mix(in srgb, currentColor 14%, transparent);
    }

    :host([dot]) .dot { display: inline-block; }

    .start,
    .end,
    .label {
      display: inline-flex;
      min-width: 0;
      align-items: center;
    }

    .start,
    .end { flex: 0 0 auto; }

    .label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    ::slotted([slot='start']),
    ::slotted([slot='end']) {
      width: 1em;
      height: 1em;
      flex: none;
    }

    .remove {
      display: inline-grid;
      width: 1.5rem;
      height: 1.5rem;
      margin-block: -0.22rem;
      margin-inline: 0 -0.38rem;
      padding: 0;
      place-items: center;
      border: 0;
      border-radius: 50%;
      color: inherit;
      background: transparent;
      cursor: pointer;
      transition:
        background-color var(--_rg-fast) var(--_rg-ease),
        transform var(--_rg-base) var(--_rg-spring);
    }

    .remove:hover { background: color-mix(in srgb, currentColor 14%, transparent); }
    .remove:active {
      transform: scale(0.86) rotate(4deg);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    .remove:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
    .remove svg { width: 0.9em; height: 0.9em; }

    @media (forced-colors: active) {
      .badge { border-color: currentColor; }
      .remove { border: 1px solid ButtonBorder; }
    }
  `;

  get tone(): RgBadgeTone {
    const value = this.getString('tone', 'neutral') as RgBadgeTone;
    return badgeTones.has(value) ? value : 'neutral';
  }

  set tone(value: RgBadgeTone) {
    this.setString('tone', badgeTones.has(value) && value !== 'neutral' ? value : null);
  }

  get variant(): RgBadgeVariant {
    const value = this.getString('variant', 'soft') as RgBadgeVariant;
    return badgeVariants.has(value) ? value : 'soft';
  }

  set variant(value: RgBadgeVariant) {
    this.setString('variant', badgeVariants.has(value) && value !== 'soft' ? value : null);
  }

  get size(): RgBadgeSize {
    const value = this.getString('size', 'md') as RgBadgeSize;
    return badgeSizes.has(value) ? value : 'md';
  }

  set size(value: RgBadgeSize) {
    this.setString('size', badgeSizes.has(value) && value !== 'md' ? value : null);
  }

  get dot(): boolean {
    return this.getBoolean('dot');
  }

  set dot(value: boolean) {
    this.setBoolean('dot', value);
  }

  get removable(): boolean {
    return this.getBoolean('removable');
  }

  set removable(value: boolean) {
    this.setBoolean('removable', value);
  }

  get removeLabel(): string {
    return this.getString('remove-label', 'Remove badge');
  }

  set removeLabel(value: string) {
    this.setString('remove-label', value);
  }

  protected onMount(root: ShadowRoot): void {
    root.querySelector<HTMLButtonElement>('.remove')?.addEventListener('click', (event) => {
      this.emit<RgBadgeRemoveDetail>(
        'rg-remove',
        { reason: 'remove-button', originalEvent: event },
        { cancelable: true },
      );
    });
  }

  protected onConnect(signal: AbortSignal): void {
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.#syncSlot(slot), signal);
      this.#syncSlot(slot);
    });
  }

  protected update(): void {
    const remove = this.shadowRoot?.querySelector<HTMLButtonElement>('.remove');
    if (!remove) return;
    remove.hidden = !this.removable;
    remove.setAttribute('aria-label', this.removeLabel);
  }

  #syncSlot(slot: HTMLSlotElement): void {
    const wrapper = slot.parentElement;
    if (!wrapper) return;
    wrapper.hidden = !slot.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
    });
  }
}
