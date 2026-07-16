import type { RgAvatarElement, RgAvatarSize } from './avatar.js';
import { ReglowElement } from '../core/reglow-element.js';

const avatarSizes = new Set<RgAvatarSize>(['sm', 'md', 'lg', 'xl']);

export class RgAvatarGroupElement extends ReglowElement {
  static readonly tagName = 'rg-avatar-group' as const;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = ['label', 'max', 'more-label', 'size'] as const;
  static readonly template = String.raw`
    <span class="group" part="base list" role="group">
      <slot></slot>
      <span class="overflow" part="overflow"></span>
    </span>
  `;
  static readonly styles = String.raw`
    :host {
      --_rg-avatar-group-size: 2.5rem;
      display: inline-flex;
      max-width: 100%;
      vertical-align: middle;
    }

    :host([size='sm']) { --_rg-avatar-group-size: 2rem; }
    :host([size='lg']) { --_rg-avatar-group-size: 3.25rem; }
    :host([size='xl']) { --_rg-avatar-group-size: 4.25rem; }

    .group {
      display: inline-flex;
      max-width: 100%;
      align-items: center;
      isolation: isolate;
    }

    ::slotted(rg-avatar),
    .overflow {
      flex: 0 0 var(--_rg-avatar-group-size);
      width: var(--_rg-avatar-group-size);
      height: var(--_rg-avatar-group-size);
      border-radius: 50%;
      box-shadow: var(--_rg-shadow-xs);
    }

    ::slotted(rg-avatar) { margin-inline-start: -0.65rem; }
    ::slotted(rg-avatar:first-child) { margin-inline-start: 0; }
    ::slotted([data-rg-overflow-hidden]) { display: none !important; }

    .overflow {
      display: inline-grid;
      margin-inline-start: -0.65rem;
      place-items: center;
      color: var(--_rg-brand-text);
      background: color-mix(in srgb, var(--_rg-brand-soft) 82%, var(--_rg-surface));
      font-size: max(0.68rem, calc(var(--_rg-avatar-group-size) * 0.27));
      font-weight: 780;
      font-variant-numeric: tabular-nums;
      line-height: 1;
      z-index: 2;
    }

    .overflow[hidden] { display: none; }

    @media (forced-colors: active) {
      .overflow { outline: 1px solid CanvasText; }
    }
  `;

  #originalAriaHidden = new WeakMap<RgAvatarElement, string | null>();
  #originalSizes = new WeakMap<RgAvatarElement, string | null>();

  get label(): string {
    return this.getString('label', 'Avatar group');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get max(): number {
    return Math.max(0, Math.trunc(this.getNumber('max', 0)));
  }

  set max(value: number) {
    this.setNumber('max', Math.max(0, Math.trunc(value)));
  }

  get moreLabel(): string {
    return this.getString('more-label', 'more avatars');
  }

  set moreLabel(value: string) {
    this.setString('more-label', value);
  }

  get size(): RgAvatarSize {
    const value = this.getString('size', 'md') as RgAvatarSize;
    return avatarSizes.has(value) ? value : 'md';
  }

  set size(value: RgAvatarSize) {
    this.setString('size', avatarSizes.has(value) ? value : 'md');
  }

  protected onConnect(signal: AbortSignal): void {
    this.listen(this.query<HTMLSlotElement>('slot'), 'slotchange', () => this.update(), signal);
  }

  protected onDisconnect(): void {
    this.#avatars().forEach((avatar) => {
      this.#setOverflowHidden(avatar, false);
      this.#restoreSize(avatar);
    });
  }

  protected update(): void {
    const base = this.shadowRoot?.querySelector<HTMLElement>('.group');
    const overflow = this.shadowRoot?.querySelector<HTMLElement>('.overflow');
    if (!base || !overflow) return;

    base.setAttribute('aria-label', this.label);
    const avatars = this.#avatars();
    const visibleCount = this.max === 0 ? avatars.length : Math.min(this.max, avatars.length);
    const hiddenCount = avatars.length - visibleCount;

    avatars.forEach((avatar, index) => {
      this.#syncSize(avatar);
      this.#setOverflowHidden(avatar, index >= visibleCount);
    });

    overflow.hidden = hiddenCount === 0;
    overflow.textContent = hiddenCount === 0 ? '' : `+${hiddenCount}`;
    if (hiddenCount === 0) overflow.removeAttribute('aria-label');
    else overflow.setAttribute('aria-label', `${hiddenCount} ${this.moreLabel}`);
  }

  #avatars(): RgAvatarElement[] {
    return Array.from(this.children).filter(
      (child): child is RgAvatarElement => child.localName === 'rg-avatar',
    );
  }

  #setOverflowHidden(avatar: RgAvatarElement, hidden: boolean): void {
    const wasHidden = avatar.hasAttribute('data-rg-overflow-hidden');
    if (hidden && !wasHidden) {
      this.#originalAriaHidden.set(avatar, avatar.getAttribute('aria-hidden'));
      avatar.setAttribute('data-rg-overflow-hidden', '');
      avatar.setAttribute('aria-hidden', 'true');
      return;
    }

    if (!hidden && wasHidden) {
      avatar.removeAttribute('data-rg-overflow-hidden');
      const original = this.#originalAriaHidden.get(avatar);
      if (original === null || original === undefined) avatar.removeAttribute('aria-hidden');
      else avatar.setAttribute('aria-hidden', original);
      this.#originalAriaHidden.delete(avatar);
    }
  }

  #syncSize(avatar: RgAvatarElement): void {
    if (!this.hasAttribute('size')) {
      this.#restoreSize(avatar);
      return;
    }

    if (!this.#originalSizes.has(avatar)) {
      this.#originalSizes.set(avatar, avatar.getAttribute('size'));
    }
    avatar.setAttribute('size', this.size);
  }

  #restoreSize(avatar: RgAvatarElement): void {
    if (!this.#originalSizes.has(avatar)) return;
    const original = this.#originalSizes.get(avatar);
    if (original === null || original === undefined) avatar.removeAttribute('size');
    else avatar.setAttribute('size', original);
    this.#originalSizes.delete(avatar);
  }
}
