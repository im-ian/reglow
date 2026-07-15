import { baseStyles } from '../styles/base.js';

const HTMLElementBase = (
  typeof HTMLElement === 'undefined' ? class {} : HTMLElement
) as typeof HTMLElement;

let idCount = 0;

export abstract class ReglowElement extends HTMLElementBase {
  static readonly tagName: `rg-${string}`;
  static readonly delegatesFocus: boolean = true;
  static readonly styles: string = '';
  static readonly template: string = '<slot></slot>';

  #mounted = false;
  #connection?: AbortController;

  connectedCallback(): void {
    this.mount();
    this.#connection?.abort();
    this.#connection = new AbortController();
    this.onConnect(this.#connection.signal);
    this.update();
  }

  disconnectedCallback(): void {
    this.#connection?.abort();
    this.#connection = undefined;
    this.onDisconnect();
  }

  attributeChangedCallback(name: string, previous: string | null, next: string | null): void {
    if (previous !== next && this.#mounted) this.update(name);
  }

  protected mount(): void {
    if (this.#mounted) return;

    const constructor = this.constructor as typeof ReglowElement;
    const root =
      this.shadowRoot ??
      this.attachShadow({ mode: 'open', delegatesFocus: constructor.delegatesFocus });

    if (!root.querySelector('[data-rg-shadow-root]')) {
      root.innerHTML = `<style>${baseStyles}${constructor.styles}</style><span data-rg-shadow-root hidden></span>${constructor.template}`;
    }

    this.#mounted = true;
    this.onMount(root);
  }

  protected onMount(_root: ShadowRoot): void {}
  protected onConnect(_signal: AbortSignal): void {}
  protected onDisconnect(): void {}
  protected update(_changedAttribute?: string): void {}

  protected query<T extends Element>(selector: string): T {
    const match = this.shadowRoot?.querySelector<T>(selector);
    if (!match) throw new Error(`${this.localName || 'ReglowElement'} is missing ${selector}`);
    return match;
  }

  protected listen(
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    signal: AbortSignal,
    options: Omit<AddEventListenerOptions, 'signal'> = {},
  ): void {
    target.addEventListener(type, listener, { ...options, signal });
  }

  protected emit<T>(name: `rg-${string}`, detail: T, options: CustomEventInit<T> = {}): boolean {
    return this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
        ...options,
      }),
    );
  }

  protected getString(name: string, fallback = ''): string {
    return this.getAttribute(name) ?? fallback;
  }

  protected setString(name: string, value: string | null | undefined): void {
    if (value === null || value === undefined || value === '') this.removeAttribute(name);
    else this.setAttribute(name, value);
  }

  protected getBoolean(name: string): boolean {
    return this.hasAttribute(name);
  }

  protected setBoolean(name: string, value: boolean): void {
    this.toggleAttribute(name, Boolean(value));
  }

  protected getNumber(name: string, fallback = 0): number {
    const raw = this.getAttribute(name);
    if (raw === null) return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }

  protected setNumber(name: string, value: number | null | undefined): void {
    if (value === null || value === undefined || !Number.isFinite(value))
      this.removeAttribute(name);
    else this.setAttribute(name, String(value));
  }

  protected createId(prefix: string): string {
    idCount += 1;
    return `${prefix}-${idCount}`;
  }
}
