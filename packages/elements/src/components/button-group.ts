import { ReglowElement } from '../core/reglow-element.js';

export type RgButtonGroupOrientation = 'horizontal' | 'vertical';

export class RgButtonGroupElement extends ReglowElement {
  static readonly tagName = 'rg-button-group' as const;
  static readonly observedAttributes = ['attached', 'label', 'orientation'] as const;
  static readonly delegatesFocus = false;
  static readonly template = String.raw`
    <div class="group" part="base group" role="group"><slot></slot></div>
  `;
  static readonly styles = String.raw`
    :host {
      --_rg-button-group-radius: var(
        --rg-button-group-border-radius,
        var(--rg-radius-pill, 999px)
      );
      display: inline-flex;
    }
    .group {
      display: inline-flex;
      align-items: stretch;
      gap: var(--rg-button-group-gap, 0.4rem);
    }
    :host([orientation='vertical']) .group { flex-direction: column; }
    :host([attached]) .group { gap: 0; }
    :host([attached]) ::slotted(*) {
      --rg-button-border-radius: 0;
      position: relative;
      margin-inline-start: -1px;
    }
    :host([attached]:not([orientation='vertical'])) ::slotted(:first-child) {
      --rg-button-border-start-start-radius: var(--_rg-button-group-radius);
      --rg-button-border-end-start-radius: var(--_rg-button-group-radius);
      margin-inline-start: 0;
    }
    :host([attached]:not([orientation='vertical'])) ::slotted(:last-child) {
      --rg-button-border-start-end-radius: var(--_rg-button-group-radius);
      --rg-button-border-end-end-radius: var(--_rg-button-group-radius);
    }
    :host([attached]) ::slotted(:focus-within),
    :host([attached]) ::slotted(:hover) { z-index: 1; }
    :host([orientation='vertical'][attached]) ::slotted(*) {
      margin-block-start: -1px;
      margin-inline-start: 0;
    }
    :host([orientation='vertical'][attached]) ::slotted(:first-child) {
      --rg-button-border-start-start-radius: var(--_rg-button-group-radius);
      --rg-button-border-start-end-radius: var(--_rg-button-group-radius);
      margin-block-start: 0;
    }
    :host([orientation='vertical'][attached]) ::slotted(:last-child) {
      --rg-button-border-end-start-radius: var(--_rg-button-group-radius);
      --rg-button-border-end-end-radius: var(--_rg-button-group-radius);
    }
  `;

  get label(): string {
    return this.getString('label');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get orientation(): RgButtonGroupOrientation {
    return this.getString('orientation') === 'vertical' ? 'vertical' : 'horizontal';
  }

  set orientation(value: RgButtonGroupOrientation) {
    this.setString('orientation', value === 'horizontal' ? null : value);
  }

  get attached(): boolean {
    return this.getBoolean('attached');
  }

  set attached(value: boolean) {
    this.setBoolean('attached', value);
  }

  protected update(): void {
    const group = this.query<HTMLElement>('.group');
    group.setAttribute('aria-orientation', this.orientation);
    if (this.label) group.setAttribute('aria-label', this.label);
    else group.removeAttribute('aria-label');
  }
}
