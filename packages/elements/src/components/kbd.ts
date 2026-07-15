import { ReglowElement } from '../core/reglow-element.js';

export class RgKbdElement extends ReglowElement {
  static readonly tagName = 'rg-kbd' as const;
  static readonly observedAttributes = ['keys', 'label', 'separator'] as const;
  static readonly delegatesFocus = false;
  static readonly template = String.raw`
    <span class="keys" part="base" role="img">
      <span data-keys></span><span class="fallback"><slot></slot></span>
    </span>
  `;
  static readonly styles = String.raw`
    :host { display: inline-flex; vertical-align: middle; }
    .keys, [data-keys] { display: inline-flex; align-items: center; gap: 0.25rem; }
    kbd {
      display: inline-grid;
      min-width: 1.6em;
      min-height: 1.65em;
      padding: 0.08em 0.42em;
      place-items: center;
      border: 1px solid var(--_rg-border-strong);
      border-bottom-width: 2px;
      border-radius: var(--rg-radius-xs, 0.45rem);
      color: var(--_rg-text-muted);
      background: var(--_rg-surface);
      box-shadow: 0 1px 0 var(--_rg-canvas-subtle);
      font-family: var(--rg-font-mono, ui-monospace, SFMono-Regular, Consolas, monospace);
      font-size: 0.78em;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }
    .separator { color: var(--_rg-text-subtle); font-size: 0.75em; }
  `;

  get keys(): string {
    return this.getString('keys');
  }

  set keys(value: string) {
    this.setString('keys', value);
  }

  get label(): string {
    return this.getString('label');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get separator(): string {
    return this.getString('separator', '+');
  }

  set separator(value: string) {
    this.setString('separator', value);
  }

  protected update(): void {
    const root = this.query<HTMLElement>('.keys');
    const target = this.query<HTMLElement>('[data-keys]');
    const fallback = this.query<HTMLElement>('.fallback');
    const keys = this.keys
      .split('+')
      .map((key) => key.trim())
      .filter(Boolean);
    fallback.hidden = keys.length > 0;
    target.hidden = keys.length === 0;
    if (this.label) root.setAttribute('aria-label', this.label);
    else if (keys.length > 0) root.setAttribute('aria-label', keys.join(' plus '));
    else root.removeAttribute('aria-label');

    const fragment = document.createDocumentFragment();
    keys.forEach((key, index) => {
      if (index > 0) {
        const separator = document.createElement('span');
        separator.className = 'separator';
        separator.textContent = this.separator;
        separator.setAttribute('aria-hidden', 'true');
        fragment.append(separator);
      }
      const element = document.createElement('kbd');
      element.textContent = key;
      element.setAttribute('part', 'key');
      element.setAttribute('aria-hidden', 'true');
      fragment.append(element);
    });
    target.replaceChildren(fragment);
  }
}
