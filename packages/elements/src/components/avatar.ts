import { ReglowElement } from '../core/reglow-element.js';

export type RgAvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type RgAvatarShape = 'circle' | 'rounded';
export type RgAvatarStatus = 'none' | 'online' | 'away' | 'busy' | 'offline';
export type RgAvatarLoading = 'eager' | 'lazy';

export interface RgAvatarLoadDetail {
  readonly src: string;
  readonly originalEvent: Event;
}

export interface RgAvatarErrorDetail extends RgAvatarLoadDetail {}

const avatarSizes = new Set<RgAvatarSize>(['sm', 'md', 'lg', 'xl']);
const avatarShapes = new Set<RgAvatarShape>(['circle', 'rounded']);
const avatarStatuses = new Set<RgAvatarStatus>(['none', 'online', 'away', 'busy', 'offline']);
const avatarLoadingModes = new Set<RgAvatarLoading>(['eager', 'lazy']);

export class RgAvatarElement extends ReglowElement {
  static readonly tagName = 'rg-avatar' as const;
  static readonly observedAttributes = [
    'alt',
    'crossorigin',
    'decoding',
    'initials',
    'loading',
    'name',
    'referrerpolicy',
    'shape',
    'size',
    'sizes',
    'src',
    'srcset',
    'status',
    'status-label',
  ] as const;

  static readonly template = String.raw`
    <span class="avatar" part="base avatar">
      <img class="image" part="image" alt="" />
      <span class="fallback" part="fallback">
        <slot name="fallback"><span class="initials" part="initials"></span></slot>
      </span>
      <span class="status" part="status"><slot name="status"></slot></span>
    </span>
  `;

  static readonly styles = String.raw`
    :host {
      --_rg-avatar-size: 2.5rem;
      display: inline-flex;
      width: var(--_rg-avatar-size);
      height: var(--_rg-avatar-size);
      flex: 0 0 var(--_rg-avatar-size);
      vertical-align: middle;
    }

    :host([size='sm']) { --_rg-avatar-size: 2rem; }
    :host([size='lg']) { --_rg-avatar-size: 3.25rem; }
    :host([size='xl']) { --_rg-avatar-size: 4.25rem; }

    .avatar {
      position: relative;
      display: inline-grid;
      width: 100%;
      height: 100%;
      overflow: visible;
      place-items: center;
      border-radius: 50%;
      isolation: isolate;
    }

    .avatar::after {
      position: absolute;
      inset: 0;
      border: 1px solid color-mix(in srgb, var(--_rg-border-strong) 34%, transparent);
      border-radius: inherit;
      box-shadow: inset 0 1px 0 rgb(255 255 255 / 32%);
      content: '';
      pointer-events: none;
      z-index: 2;
    }

    :host([shape='rounded']) .avatar {
      border-radius: var(--rg-radius-md, 0.875rem);
    }

    .image,
    .fallback {
      grid-area: 1 / 1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }

    .image {
      display: block;
      object-fit: cover;
      background: var(--_rg-surface-sunken);
      animation: rg-avatar-reveal var(--_rg-slow) var(--_rg-ease) both;
    }

    .fallback {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: var(--_rg-brand-text);
      background:
        radial-gradient(circle at 28% 22%, rgb(255 255 255 / 58%), transparent 34%),
        linear-gradient(145deg, var(--_rg-brand-soft), color-mix(in srgb, var(--_rg-brand-soft) 64%, var(--_rg-accent-soft)));
      font-size: calc(var(--_rg-avatar-size) * 0.34);
      font-weight: 800;
      letter-spacing: -0.035em;
      line-height: 1;
      text-transform: uppercase;
    }

    ::slotted([slot='fallback']) {
      display: inline-flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      border-radius: inherit;
    }

    .status {
      position: absolute;
      right: 1.5%;
      bottom: 1.5%;
      display: none;
      width: 25%;
      min-width: 0.55rem;
      aspect-ratio: 1;
      border: max(2px, calc(var(--_rg-avatar-size) * 0.055)) solid var(--_rg-surface);
      border-radius: 50%;
      background: var(--_rg-text-subtle);
      box-shadow: var(--_rg-shadow-xs);
      z-index: 3;
    }

    :host([status='online']) .status,
    :host([status='away']) .status,
    :host([status='busy']) .status,
    :host([status='offline']) .status,
    :host([data-has-status]) .status { display: block; }

    :host([status='online']) .status { background: var(--_rg-success); }
    :host([status='away']) .status { background: var(--_rg-warning); }
    :host([status='busy']) .status { background: var(--_rg-danger); }
    :host([status='offline']) .status { background: var(--_rg-text-subtle); }

    :host([data-has-status]) .status {
      width: auto;
      min-width: 0;
      aspect-ratio: auto;
      border: 0;
      background: transparent;
      box-shadow: none;
    }

    ::slotted([slot='status']) {
      display: inline-flex;
      max-width: calc(var(--_rg-avatar-size) * 0.8);
    }

    @keyframes rg-avatar-reveal {
      from { opacity: 0; transform: scale(0.94); }
      to { opacity: 1; transform: scale(1); }
    }

    @media (forced-colors: active) {
      .avatar::after,
      .status { border-color: CanvasText; }
    }
  `;

  #currentSource = '';
  #imageLoaded = false;
  #imageFailed = false;
  #connectionSignal?: AbortSignal;
  #imageListenerController?: AbortController;

  get src(): string {
    return this.getString('src');
  }

  set src(value: string) {
    this.setString('src', value);
  }

  get alt(): string {
    return this.hasAttribute('alt') ? this.getString('alt') : this.name;
  }

  set alt(value: string) {
    this.setAttribute('alt', value);
  }

  get name(): string {
    return this.getString('name');
  }

  set name(value: string) {
    this.setString('name', value);
  }

  get initials(): string {
    return this.getString('initials') || this.#initialsFromName(this.name);
  }

  set initials(value: string) {
    this.setString('initials', value);
  }

  get size(): RgAvatarSize {
    const value = this.getString('size', 'md') as RgAvatarSize;
    return avatarSizes.has(value) ? value : 'md';
  }

  set size(value: RgAvatarSize) {
    this.setString('size', avatarSizes.has(value) ? value : 'md');
  }

  get shape(): RgAvatarShape {
    const value = this.getString('shape', 'circle') as RgAvatarShape;
    return avatarShapes.has(value) ? value : 'circle';
  }

  set shape(value: RgAvatarShape) {
    this.setString('shape', avatarShapes.has(value) ? value : 'circle');
  }

  get status(): RgAvatarStatus {
    const value = this.getString('status', 'none') as RgAvatarStatus;
    return avatarStatuses.has(value) ? value : 'none';
  }

  set status(value: RgAvatarStatus) {
    this.setString('status', avatarStatuses.has(value) ? value : 'none');
  }

  get statusLabel(): string {
    return this.getString('status-label');
  }

  set statusLabel(value: string) {
    this.setString('status-label', value);
  }

  get loading(): RgAvatarLoading {
    const value = this.getString('loading', 'lazy') as RgAvatarLoading;
    return avatarLoadingModes.has(value) ? value : 'lazy';
  }

  set loading(value: RgAvatarLoading) {
    this.setString('loading', avatarLoadingModes.has(value) ? value : 'lazy');
  }

  protected onConnect(signal: AbortSignal): void {
    const image = this.query<HTMLImageElement>('.image');
    const statusSlot = this.query<HTMLSlotElement>('slot[name="status"]');
    this.#connectionSignal = signal;
    this.#listenToImage(image);
    this.listen(statusSlot, 'slotchange', () => this.#syncStatusSlot(statusSlot), signal);
    signal.addEventListener(
      'abort',
      () => {
        if (this.#connectionSignal !== signal) return;

        this.#connectionSignal = undefined;
        this.#imageListenerController?.abort();
        this.#imageListenerController = undefined;
      },
      { once: true },
    );
    this.#syncStatusSlot(statusSlot);
  }

  protected update(_changedAttribute?: string): void {
    let image = this.shadowRoot?.querySelector<HTMLImageElement>('.image');
    const fallback = this.shadowRoot?.querySelector<HTMLElement>('.fallback');
    const initials = this.shadowRoot?.querySelector<HTMLElement>('.initials');
    const status = this.shadowRoot?.querySelector<HTMLElement>('.status');
    if (!image || !fallback || !initials || !status) return;

    if (this.#currentSource !== this.src) {
      this.#currentSource = this.src;
      this.#imageLoaded = false;
      this.#imageFailed = false;
      image = this.#replaceImage(image);
    }

    this.#mirrorImageAttribute(image, 'crossorigin');
    this.#mirrorImageAttribute(image, 'decoding');
    this.#mirrorImageAttribute(image, 'referrerpolicy');
    this.#mirrorImageAttribute(image, 'sizes');
    this.#mirrorImageAttribute(image, 'srcset');
    image.loading = this.loading;
    image.alt = this.alt;

    if (this.src) {
      if (image.getAttribute('src') !== this.src) image.setAttribute('src', this.src);
    } else {
      image.removeAttribute('src');
    }

    if (this.src && image.complete && image.naturalWidth > 0) {
      this.#imageLoaded = true;
      this.#imageFailed = false;
    }

    const showImage = Boolean(this.src) && this.#imageLoaded && !this.#imageFailed;
    image.hidden = !showImage;
    fallback.hidden = showImage;
    initials.textContent = this.initials;

    if (showImage || !this.alt) {
      fallback.setAttribute('aria-hidden', 'true');
      fallback.removeAttribute('aria-label');
      fallback.removeAttribute('role');
    } else {
      fallback.removeAttribute('aria-hidden');
      fallback.setAttribute('aria-label', this.alt);
      fallback.setAttribute('role', 'img');
    }

    if (this.hasAttribute('data-has-status')) {
      status.removeAttribute('aria-hidden');
      status.removeAttribute('aria-label');
      status.removeAttribute('role');
    } else if (this.status !== 'none' && this.statusLabel) {
      status.removeAttribute('aria-hidden');
      status.setAttribute('aria-label', this.statusLabel);
      status.setAttribute('role', 'img');
    } else {
      status.setAttribute('aria-hidden', 'true');
      status.removeAttribute('aria-label');
      status.removeAttribute('role');
    }
  }

  #handleLoad(event: Event): void {
    const image = event.currentTarget as HTMLImageElement;
    const currentImage = this.shadowRoot?.querySelector<HTMLImageElement>('.image');
    if (!this.src || image !== currentImage || image.getAttribute('src') !== this.src) return;

    this.#imageLoaded = true;
    this.#imageFailed = false;
    this.update('src');
    this.emit<RgAvatarLoadDetail>('rg-load', { src: this.src, originalEvent: event });
  }

  #handleError(event: Event): void {
    const image = event.currentTarget as HTMLImageElement;
    const currentImage = this.shadowRoot?.querySelector<HTMLImageElement>('.image');
    if (!this.src || image !== currentImage || image.getAttribute('src') !== this.src) return;

    this.#imageLoaded = false;
    this.#imageFailed = true;
    this.update('src');
    this.emit<RgAvatarErrorDetail>('rg-error', { src: this.src, originalEvent: event });
  }

  #listenToImage(image: HTMLImageElement): void {
    this.#imageListenerController?.abort();
    const controller = new AbortController();
    this.#imageListenerController = controller;
    this.listen(image, 'load', (event) => this.#handleLoad(event), controller.signal);
    this.listen(image, 'error', (event) => this.#handleError(event), controller.signal);
  }

  #replaceImage(image: HTMLImageElement): HTMLImageElement {
    const replacement = this.ownerDocument.createElement('img');
    replacement.className = 'image';
    replacement.setAttribute('part', 'image');
    replacement.alt = '';
    image.replaceWith(replacement);

    if (this.#connectionSignal) this.#listenToImage(replacement);
    return replacement;
  }

  #syncStatusSlot(slot: HTMLSlotElement): void {
    const hasStatus = slot.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
    });
    this.toggleAttribute('data-has-status', hasStatus);
    this.update('status');
  }

  #mirrorImageAttribute(image: HTMLImageElement, name: string): void {
    const value = this.getAttribute(name);
    if (value === null) image.removeAttribute(name);
    else image.setAttribute(name, value);
  }

  #initialsFromName(value: string): string {
    const words = value.trim().split(/\s+/u).filter(Boolean);
    if (words.length === 0) return '';

    const first = Array.from(words[0] ?? '')[0] ?? '';
    const last = words.length > 1 ? (Array.from(words.at(-1) ?? '')[0] ?? '') : '';
    return `${first}${last}`.toLocaleUpperCase();
  }
}
