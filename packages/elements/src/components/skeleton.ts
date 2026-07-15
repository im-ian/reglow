import { ReglowElement } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';

export type SkeletonShape = 'text' | 'rect' | 'circle';

export class RgSkeletonElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-skeleton';
  static readonly observedAttributes = ['shape', 'width', 'height', 'animated'];
  static readonly styles = String.raw`
    ${motionStyles}

    :host { display: inline-block; width: 100%; }
    :host([shape='circle']) { width: fit-content; }
    .skeleton {
      position: relative;
      display: block;
      width: 100%;
      height: 1em;
      overflow: hidden;
      border-radius: var(--rg-radius-sm, 0.6rem);
      background: var(--_rg-surface-sunken);
    }
    :host([shape='circle']) .skeleton { width: 2.5rem; height: 2.5rem; border-radius: 999px; }
    :host([shape='rect']) .skeleton { height: 5rem; border-radius: var(--rg-radius-lg, 1.125rem); }
    :host([animated]) .skeleton::after {
      position: absolute;
      inset: 0;
      content: '';
      background: linear-gradient(90deg, transparent, rgb(255 255 255 / 58%), transparent);
      transform: translateX(-100%);
      animation: rg-shimmer 1.45s var(--_rg-ease) infinite;
    }
  `;
  static readonly template = '<span class="skeleton" part="base" aria-hidden="true"></span>';

  get shape(): SkeletonShape {
    const value = this.getString('shape', 'text');
    return value === 'circle' || value === 'rect' ? value : 'text';
  }

  set shape(value: SkeletonShape) {
    this.setString('shape', value === 'text' ? null : value);
  }

  get animated(): boolean {
    return this.getBoolean('animated');
  }

  set animated(value: boolean) {
    this.setBoolean('animated', value);
  }

  protected update(): void {
    const skeleton = this.query<HTMLElement>('.skeleton');
    const defaultWidth = this.shape === 'circle' ? '2.5rem' : '100%';
    const defaultHeight =
      this.shape === 'circle' ? '2.5rem' : this.shape === 'rect' ? '5rem' : '1em';

    skeleton.style.width = this.getString('width', defaultWidth);
    skeleton.style.height = this.getString('height', defaultHeight);
  }
}
