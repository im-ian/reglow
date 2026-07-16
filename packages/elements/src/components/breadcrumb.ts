import { ReglowElement } from '../core/reglow-element.js';

export class RgBreadcrumbItemElement extends ReglowElement {
  static readonly tagName = 'rg-breadcrumb-item' as const;
  static readonly observedAttributes = ['current', 'href', 'target', 'rel'] as const;
  static readonly delegatesFocus = false;
  static readonly template = `
    <span class="separator" part="separator" aria-hidden="true">/</span>
    <a class="item" part="base link"><slot></slot></a>
  `;
  static readonly styles = `
    :host { display: inline-flex; min-width: 0; align-items: center; gap: 0.6rem; }
    :host([data-first]) .separator { display: none; }
    .separator { color: var(--_rg-text-subtle); font-weight: 650; user-select: none; }
    .item {
      min-width: 0;
      overflow: hidden;
      border-radius: var(--rg-radius-xs, 0.45rem);
      color: var(--_rg-text-muted);
      font-size: 0.86rem;
      font-weight: 650;
      line-height: 1.4;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color var(--_rg-fast) var(--_rg-ease), background var(--_rg-fast) var(--_rg-ease);
    }
    .item[href]:hover { color: var(--_rg-brand-text); text-decoration: underline; text-underline-offset: 0.18em; }
    .item[href]:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
    :host([current]) .item { color: var(--_rg-text); font-weight: 760; }
  `;

  get href(): string {
    return this.getString('href');
  }

  set href(value: string) {
    this.setString('href', value);
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

  get current(): boolean {
    return this.getBoolean('current');
  }

  set current(value: boolean) {
    this.setBoolean('current', value);
  }

  protected update(): void {
    const link = this.query<HTMLAnchorElement>('.item');
    if (this.current) {
      link.removeAttribute('href');
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.setAttribute('aria-current', 'page');
    } else {
      if (this.href) link.href = this.href;
      else link.removeAttribute('href');
      if (this.target) link.target = this.target;
      else link.removeAttribute('target');
      if (this.rel) link.rel = this.rel;
      else link.removeAttribute('rel');
      link.removeAttribute('aria-current');
    }
  }
}

export class RgBreadcrumbElement extends ReglowElement {
  static readonly tagName = 'rg-breadcrumb' as const;
  static readonly observedAttributes = ['label'] as const;
  static readonly delegatesFocus = false;
  static readonly template = `
    <nav part="base nav">
      <ol part="list"><slot></slot></ol>
    </nav>
  `;
  static readonly styles = `
    :host { display: block; min-width: 0; }
    ol {
      display: flex;
      min-width: 0;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.6rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    ::slotted(rg-breadcrumb-item) { max-width: min(18rem, 42vw); }
  `;

  get label(): string {
    return this.getString('label', 'Breadcrumb');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  protected onConnect(signal: AbortSignal): void {
    this.listen(this.query<HTMLSlotElement>('slot'), 'slotchange', () => this.update(), signal);
  }

  protected update(): void {
    this.query<HTMLElement>('nav').setAttribute('aria-label', this.label);
    const items = Array.from(this.children).filter(
      (child): child is RgBreadcrumbItemElement => child.localName === 'rg-breadcrumb-item',
    );
    items.forEach((item, index) => item.toggleAttribute('data-first', index === 0));
  }
}
