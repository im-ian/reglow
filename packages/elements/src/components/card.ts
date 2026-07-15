import { ReglowElement } from '../core/reglow-element.js';

export type RgCardVariant = 'elevated' | 'outlined' | 'soft';
export type RgCardPadding = 'none' | 'sm' | 'md' | 'lg';
export type RgCardRadius = 'sm' | 'md' | 'lg' | 'xl';

const cardVariants = new Set<RgCardVariant>(['elevated', 'outlined', 'soft']);
const cardPaddings = new Set<RgCardPadding>(['none', 'sm', 'md', 'lg']);
const cardRadii = new Set<RgCardRadius>(['sm', 'md', 'lg', 'xl']);

export class RgCardElement extends ReglowElement {
  static readonly tagName = 'rg-card' as const;
  static readonly observedAttributes = [
    'aria-describedby',
    'aria-label',
    'aria-labelledby',
  ] as const;
  static readonly template = String.raw`
    <article class="card" part="base card">
      <div class="media" part="media" data-slot-wrapper="media">
        <slot name="media"></slot>
      </div>
      <div class="header" part="header" data-slot-wrapper="header">
        <slot name="header"></slot>
      </div>
      <div class="body" part="body" data-slot-wrapper="body">
        <slot></slot>
      </div>
      <div class="footer" part="footer" data-slot-wrapper="footer">
        <slot name="footer"></slot>
      </div>
    </article>
  `;

  static readonly styles = String.raw`
    :host {
      --_rg-card-padding: 1.25rem;
      --_rg-card-radius: var(--rg-radius-lg, 1.25rem);
      display: block;
      min-width: 0;
    }

    .card {
      display: grid;
      min-width: 0;
      overflow: clip;
      border: 1px solid color-mix(in srgb, var(--_rg-border) 82%, transparent);
      border-radius: var(--_rg-card-radius);
      color: var(--_rg-text);
      background: var(--_rg-surface-raised);
      box-shadow: var(--_rg-shadow-sm);
      transition:
        background-color var(--_rg-base) var(--_rg-ease),
        border-color var(--_rg-base) var(--_rg-ease),
        box-shadow var(--_rg-slow) var(--_rg-ease),
        transform var(--_rg-slow) var(--_rg-spring);
    }

    :host([lift]) .card:hover {
      border-color: color-mix(in srgb, var(--_rg-brand) 25%, var(--_rg-border));
      box-shadow: var(--_rg-shadow-md);
      transform: translateY(-0.25rem) rotateX(0.35deg);
    }

    :host([variant='outlined']) .card {
      border-color: var(--_rg-border-strong);
      box-shadow: none;
    }

    :host([variant='soft']) .card {
      border-color: transparent;
      background: var(--_rg-canvas-subtle);
      box-shadow: none;
    }

    :host([padding='none']) { --_rg-card-padding: 0; }
    :host([padding='sm']) { --_rg-card-padding: 0.875rem; }
    :host([padding='lg']) { --_rg-card-padding: 1.75rem; }

    :host([radius='sm']) { --_rg-card-radius: var(--rg-radius-sm, 0.625rem); }
    :host([radius='md']) { --_rg-card-radius: var(--rg-radius-md, 0.875rem); }
    :host([radius='xl']) { --_rg-card-radius: var(--rg-radius-xl, 1.75rem); }

    .media {
      min-width: 0;
      overflow: hidden;
      line-height: 0;
    }

    .header,
    .body,
    .footer {
      min-width: 0;
      padding-inline: var(--_rg-card-padding);
    }

    .header {
      padding-block: var(--_rg-card-padding) 0;
    }

    .body {
      padding-block: var(--_rg-card-padding);
    }

    .header:not([hidden]) + .body:not([hidden]) {
      padding-block-start: 0.75rem;
    }

    .footer {
      padding-block: 0 var(--_rg-card-padding);
    }

    .header:not([hidden]) + .body[hidden] + .footer:not([hidden]),
    .media:not([hidden]) + .header[hidden] + .body[hidden] + .footer:not([hidden]) {
      padding-block-start: var(--_rg-card-padding);
    }

    :host([padding='none']) .header,
    :host([padding='none']) .body,
    :host([padding='none']) .footer {
      padding: 0;
    }

    ::slotted([slot='media']) {
      display: block;
      width: 100%;
      max-width: 100%;
    }

    ::slotted(img[slot='media']) {
      height: auto;
      object-fit: cover;
    }

    @media (forced-colors: active) {
      .card { border-color: CanvasText; }
    }
  `;

  get variant(): RgCardVariant {
    const value = this.getString('variant', 'elevated') as RgCardVariant;
    return cardVariants.has(value) ? value : 'elevated';
  }

  set variant(value: RgCardVariant) {
    this.setString('variant', cardVariants.has(value) && value !== 'elevated' ? value : null);
  }

  get padding(): RgCardPadding {
    const value = this.getString('padding', 'md') as RgCardPadding;
    return cardPaddings.has(value) ? value : 'md';
  }

  set padding(value: RgCardPadding) {
    this.setString('padding', cardPaddings.has(value) && value !== 'md' ? value : null);
  }

  get radius(): RgCardRadius {
    const value = this.getString('radius', 'lg') as RgCardRadius;
    return cardRadii.has(value) ? value : 'lg';
  }

  set radius(value: RgCardRadius) {
    this.setString('radius', cardRadii.has(value) ? value : 'lg');
  }

  get lift(): boolean {
    return this.getBoolean('lift');
  }

  set lift(value: boolean) {
    this.setBoolean('lift', value);
  }

  protected onConnect(signal: AbortSignal): void {
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.#syncSlot(slot), signal);
      this.#syncSlot(slot);
    });
  }

  protected update(): void {
    const card = this.shadowRoot?.querySelector<HTMLElement>('.card');
    if (!card) return;

    this.#mirrorAttribute(card, 'aria-describedby');
    this.#mirrorAttribute(card, 'aria-label');
    this.#mirrorAttribute(card, 'aria-labelledby');
  }

  #syncSlot(slot: HTMLSlotElement): void {
    const slotName = slot.name || 'body';
    const wrapper = this.shadowRoot?.querySelector<HTMLElement>(
      `[data-slot-wrapper='${slotName}']`,
    );
    if (!wrapper) return;

    const hasContent = slot.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
    });
    wrapper.hidden = !hasContent;
  }

  #mirrorAttribute(target: HTMLElement, name: string): void {
    const value = this.getAttribute(name);
    if (value === null) target.removeAttribute(name);
    else target.setAttribute(name, value);
  }
}
