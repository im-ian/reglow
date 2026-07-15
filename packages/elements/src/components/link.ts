import { ReglowElement } from '../core/reglow-element.js';

export type RgLinkVariant = 'default' | 'subtle' | 'standalone';
export type RgLinkTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
export type RgLinkSize = 'sm' | 'md' | 'lg';

export interface RgNavigateDetail {
  readonly href: string;
  readonly originalEvent: MouseEvent;
}

const linkVariants = new Set<RgLinkVariant>(['default', 'subtle', 'standalone']);
const linkTones = new Set<RgLinkTone>(['neutral', 'brand', 'success', 'warning', 'danger']);
const linkSizes = new Set<RgLinkSize>(['sm', 'md', 'lg']);

export class RgLinkElement extends ReglowElement {
  static readonly tagName = 'rg-link' as const;
  static readonly observedAttributes = [
    'aria-current',
    'aria-describedby',
    'aria-label',
    'aria-labelledby',
    'disabled',
    'download',
    'external',
    'href',
    'hreflang',
    'referrerpolicy',
    'rel',
    'size',
    'target',
    'title',
    'tone',
    'type',
    'variant',
  ] as const;

  static readonly template = String.raw`
    <a class="link" part="base link control">
      <span class="start" part="start"><slot name="start"></slot></span>
      <span class="label" part="label"><slot></slot></span>
      <span class="end" part="end"><slot name="end"></slot></span>
      <span class="external" part="external-icon" aria-hidden="true">↗</span>
    </a>
  `;

  static readonly styles = String.raw`
    :host {
      display: inline;
      vertical-align: baseline;
    }

    .link {
      --_rg-link-tone: var(--_rg-brand-text);
      --_rg-link-hover: var(--_rg-brand-hover);
      position: relative;
      display: inline-flex;
      max-width: 100%;
      align-items: center;
      gap: 0.32em;
      border-radius: var(--rg-radius-sm, 0.625rem);
      color: var(--_rg-link-tone);
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 700;
      line-height: 1.45;
      text-decoration-line: underline;
      text-decoration-color: color-mix(in srgb, currentColor 38%, transparent);
      text-decoration-thickness: 0.08em;
      text-underline-offset: 0.18em;
      transition:
        color var(--_rg-base) var(--_rg-ease),
        background-color var(--_rg-base) var(--_rg-ease),
        text-decoration-color var(--_rg-base) var(--_rg-ease),
        transform var(--_rg-base) var(--_rg-spring);
    }

    .link:hover {
      color: var(--_rg-link-hover);
      text-decoration-color: currentColor;
      transform: translateY(-0.06rem);
    }

    .link:active {
      transform: translateY(0) scale(0.985);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }

    .link:focus-visible {
      outline: none;
      box-shadow: var(--_rg-ring);
    }

    :host([tone='neutral']) .link {
      --_rg-link-tone: var(--_rg-text);
      --_rg-link-hover: var(--_rg-brand-text);
    }
    :host([tone='success']) .link {
      --_rg-link-tone: var(--_rg-success);
      --_rg-link-hover: color-mix(in srgb, var(--_rg-success) 82%, var(--_rg-text));
    }
    :host([tone='warning']) .link {
      --_rg-link-tone: var(--_rg-warning);
      --_rg-link-hover: color-mix(in srgb, var(--_rg-warning) 82%, var(--_rg-text));
    }
    :host([tone='danger']) .link {
      --_rg-link-tone: var(--_rg-danger);
      --_rg-link-hover: color-mix(in srgb, var(--_rg-danger) 82%, var(--_rg-text));
    }

    :host([variant='subtle']) .link {
      color: color-mix(in srgb, var(--_rg-link-tone) 48%, var(--_rg-text-muted));
      text-decoration-color: transparent;
    }
    :host([variant='subtle']) .link:hover {
      color: var(--_rg-link-tone);
      text-decoration-color: currentColor;
    }
    :host([variant='standalone']) .link {
      text-decoration: none;
    }

    :host([size='sm']) .link { font-size: 0.8rem; }
    :host([size='lg']) .link { font-size: 1rem; }

    :host([disabled]) .link {
      color: var(--_rg-text-subtle);
      cursor: not-allowed;
      opacity: 0.58;
      text-decoration: none;
      transform: none;
    }

    .start,
    .end,
    .external,
    .label {
      display: inline-flex;
      min-width: 0;
      align-items: center;
    }

    .start,
    .end,
    .external {
      flex: 0 0 auto;
      font-size: 1.05em;
      text-decoration: none;
    }

    .label {
      overflow-wrap: anywhere;
    }

    .external {
      display: none;
      transition: transform var(--_rg-fast) var(--_rg-spring);
    }

    :host([external]) .external { display: inline-flex; }
    :host([external]) .link:hover .external { transform: translate(0.08rem, -0.08rem); }

    ::slotted([slot='start']),
    ::slotted([slot='end']) {
      width: 1em;
      height: 1em;
      flex: none;
    }

    @media (forced-colors: active) {
      .link { color: LinkText; }
      :host([disabled]) .link { color: GrayText; }
    }
  `;

  get href(): string {
    return this.getString('href');
  }

  set href(value: string) {
    this.setAttribute('href', value);
  }

  get target(): string {
    return this.getString('target');
  }

  set target(value: string) {
    this.setString('target', value);
  }

  get rel(): string {
    return this.getString('rel');
  }

  set rel(value: string) {
    this.setString('rel', value);
  }

  get download(): string {
    return this.getString('download');
  }

  set download(value: string | boolean) {
    if (value === false) this.removeAttribute('download');
    else this.setAttribute('download', value === true ? '' : value);
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  get external(): boolean {
    return this.getBoolean('external');
  }

  set external(value: boolean) {
    this.setBoolean('external', value);
  }

  get variant(): RgLinkVariant {
    const value = this.getString('variant', 'default') as RgLinkVariant;
    return linkVariants.has(value) ? value : 'default';
  }

  set variant(value: RgLinkVariant) {
    this.setString('variant', linkVariants.has(value) && value !== 'default' ? value : null);
  }

  get tone(): RgLinkTone {
    const value = this.getString('tone', 'brand') as RgLinkTone;
    return linkTones.has(value) ? value : 'brand';
  }

  set tone(value: RgLinkTone) {
    this.setString('tone', linkTones.has(value) && value !== 'brand' ? value : null);
  }

  get size(): RgLinkSize {
    const value = this.getString('size', 'md') as RgLinkSize;
    return linkSizes.has(value) ? value : 'md';
  }

  set size(value: RgLinkSize) {
    this.setString('size', linkSizes.has(value) ? value : 'md');
  }

  click(): void {
    this.mount();
    this.update();
    this.query<HTMLAnchorElement>('.link').click();
  }

  protected onMount(root: ShadowRoot): void {
    root.querySelector<HTMLAnchorElement>('.link')?.addEventListener('click', (event) => {
      this.#handleClick(event);
    });
  }

  protected onConnect(signal: AbortSignal): void {
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.#syncSlot(slot), signal);
      this.#syncSlot(slot);
    });
  }

  protected update(): void {
    const link = this.shadowRoot?.querySelector<HTMLAnchorElement>('.link');
    if (!link) return;

    const passthrough = [
      'aria-current',
      'aria-describedby',
      'aria-label',
      'aria-labelledby',
      'download',
      'hreflang',
      'referrerpolicy',
      'target',
      'title',
      'type',
    ] as const;

    passthrough.forEach((name) => this.#mirrorAttribute(link, name));

    if (this.disabled || !this.hasAttribute('href')) link.removeAttribute('href');
    else link.setAttribute('href', this.getAttribute('href') ?? '');

    const rel = this.#safeRel();
    if (rel) link.setAttribute('rel', rel);
    else link.removeAttribute('rel');

    if (this.disabled) {
      link.setAttribute('aria-disabled', 'true');
      link.tabIndex = -1;
    } else {
      link.removeAttribute('aria-disabled');
      link.removeAttribute('tabindex');
    }
  }

  #handleClick(event: MouseEvent): void {
    if (this.disabled || !this.hasAttribute('href')) {
      event.preventDefault();
      if (this.disabled) event.stopImmediatePropagation();
      return;
    }

    const accepted = this.emit<RgNavigateDetail>(
      'rg-navigate',
      { href: this.href, originalEvent: event },
      { cancelable: true },
    );

    if (!accepted) event.preventDefault();
  }

  #safeRel(): string {
    const tokens = this.rel.split(/\s+/u).filter(Boolean);
    if (this.target === '_blank' && !tokens.includes('noopener')) tokens.push('noopener');
    return tokens.join(' ');
  }

  #syncSlot(slot: HTMLSlotElement): void {
    const wrapper = slot.parentElement;
    if (!wrapper) return;
    wrapper.hidden = !slot.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
    });
  }

  #mirrorAttribute(target: HTMLElement, name: string): void {
    const value = this.getAttribute(name);
    if (value === null) target.removeAttribute(name);
    else target.setAttribute(name, value);
  }
}
