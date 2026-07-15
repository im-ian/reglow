import { ReglowElement } from '../core/reglow-element.js';

export type RgDividerOrientation = 'horizontal' | 'vertical';
export type RgDividerVariant = 'subtle' | 'strong' | 'brand';
export type RgDividerSpacing = 'none' | 'sm' | 'md' | 'lg';

const dividerOrientations = new Set<RgDividerOrientation>(['horizontal', 'vertical']);
const dividerVariants = new Set<RgDividerVariant>(['subtle', 'strong', 'brand']);
const dividerSpacings = new Set<RgDividerSpacing>(['none', 'sm', 'md', 'lg']);

export class RgDividerElement extends ReglowElement {
  static readonly tagName = 'rg-divider' as const;
  static readonly observedAttributes = [
    'aria-label',
    'aria-labelledby',
    'decorative',
    'inset',
    'orientation',
  ] as const;
  static readonly template = String.raw`
    <div class="divider" part="base divider">
      <hr class="rule before" part="line rule rule-before" />
      <span class="label" id="label" part="label"><slot></slot></span>
      <hr class="rule after" part="line rule rule-after" aria-hidden="true" />
    </div>
  `;

  static readonly styles = String.raw`
    :host {
      --_rg-divider-color: var(--_rg-border);
      --_rg-divider-space: 1rem;
      display: block;
      width: 100%;
    }

    .divider {
      display: flex;
      width: 100%;
      align-items: center;
      gap: 0.75rem;
      padding-block: var(--_rg-divider-space);
    }

    .rule {
      width: auto;
      min-width: 0;
      height: 0;
      flex: 1 1 auto;
      margin: 0;
      border: 0;
      border-block-start: 1px solid var(--_rg-divider-color);
      color: inherit;
      transition:
        border-color var(--_rg-base) var(--_rg-ease),
        transform var(--_rg-base) var(--_rg-spring);
    }

    .label {
      display: none;
      flex: 0 1 auto;
      color: var(--_rg-text-muted);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.035em;
      line-height: 1.3;
      text-align: center;
      text-transform: uppercase;
    }

    :host([data-has-label]) .label { display: inline-flex; }
    :host(:not([data-has-label])) .after { display: none; }

    :host([variant='strong']) { --_rg-divider-color: var(--_rg-border-strong); }
    :host([variant='brand']) { --_rg-divider-color: color-mix(in srgb, var(--_rg-brand) 58%, transparent); }

    :host([spacing='none']) { --_rg-divider-space: 0; }
    :host([spacing='sm']) { --_rg-divider-space: 0.5rem; }
    :host([spacing='lg']) { --_rg-divider-space: 1.5rem; }

    :host([inset]) .divider { padding-inline: 1.25rem; }

    :host([orientation='vertical']) {
      display: inline-block;
      width: auto;
      height: 100%;
      min-height: 1.5rem;
      vertical-align: middle;
    }

    :host([orientation='vertical']) .divider {
      width: auto;
      height: 100%;
      min-height: inherit;
      flex-direction: column;
      padding-block: 0;
      padding-inline: var(--_rg-divider-space);
    }

    :host([orientation='vertical']) .rule {
      width: 0;
      min-height: 0;
      border-block-start: 0;
      border-inline-start: 1px solid var(--_rg-divider-color);
    }

    :host([orientation='vertical']) .label {
      max-height: 8rem;
      writing-mode: vertical-rl;
    }

    :host([orientation='vertical'][inset]) .divider {
      padding-block: 1.25rem;
    }

    @media (forced-colors: active) {
      .rule { border-color: CanvasText; }
    }
  `;

  #hasLabel = false;

  get orientation(): RgDividerOrientation {
    const value = this.getString('orientation', 'horizontal') as RgDividerOrientation;
    return dividerOrientations.has(value) ? value : 'horizontal';
  }

  set orientation(value: RgDividerOrientation) {
    this.setString('orientation', dividerOrientations.has(value) ? value : 'horizontal');
  }

  get variant(): RgDividerVariant {
    const value = this.getString('variant', 'subtle') as RgDividerVariant;
    return dividerVariants.has(value) ? value : 'subtle';
  }

  set variant(value: RgDividerVariant) {
    this.setString('variant', dividerVariants.has(value) ? value : 'subtle');
  }

  get spacing(): RgDividerSpacing {
    const value = this.getString('spacing', 'md') as RgDividerSpacing;
    return dividerSpacings.has(value) ? value : 'md';
  }

  set spacing(value: RgDividerSpacing) {
    this.setString('spacing', dividerSpacings.has(value) ? value : 'md');
  }

  get decorative(): boolean {
    return this.getBoolean('decorative');
  }

  set decorative(value: boolean) {
    this.setBoolean('decorative', value);
  }

  get inset(): boolean {
    return this.getBoolean('inset');
  }

  set inset(value: boolean) {
    this.setBoolean('inset', value);
  }

  protected onConnect(signal: AbortSignal): void {
    const slot = this.query<HTMLSlotElement>('slot');
    this.listen(slot, 'slotchange', () => this.#syncLabel(slot), signal);
    this.#syncLabel(slot);
  }

  protected update(_changedAttribute?: string): void {
    const rule = this.shadowRoot?.querySelector<HTMLHRElement>('.before');
    if (!rule) return;

    rule.setAttribute('aria-orientation', this.orientation);

    if (this.decorative) {
      rule.setAttribute('aria-hidden', 'true');
      rule.removeAttribute('aria-label');
      rule.removeAttribute('aria-labelledby');
      return;
    }

    rule.removeAttribute('aria-hidden');
    const ariaLabel = this.getAttribute('aria-label');
    const ariaLabelledBy = this.getAttribute('aria-labelledby');

    if (ariaLabel !== null) {
      rule.setAttribute('aria-label', ariaLabel);
      rule.removeAttribute('aria-labelledby');
    } else if (ariaLabelledBy !== null) {
      rule.removeAttribute('aria-label');
      rule.setAttribute('aria-labelledby', ariaLabelledBy);
    } else if (this.#hasLabel) {
      rule.removeAttribute('aria-label');
      rule.setAttribute('aria-labelledby', 'label');
    } else {
      rule.removeAttribute('aria-label');
      rule.removeAttribute('aria-labelledby');
    }
  }

  #syncLabel(slot: HTMLSlotElement): void {
    this.#hasLabel = slot.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
    });
    this.toggleAttribute('data-has-label', this.#hasLabel);
    this.update('slot');
  }
}
