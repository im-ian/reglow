import { ReglowElement } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';

export interface RgCopyDetail {
  readonly value: string;
  readonly source: 'value' | 'from';
}

export interface RgCopyErrorDetail extends RgCopyDetail {
  readonly error: unknown;
}

type CopyState = 'idle' | 'success' | 'error';

export class RgCopyButtonElement extends ReglowElement {
  static readonly tagName = 'rg-copy-button' as const;
  static readonly observedAttributes = [
    'copy-label',
    'disabled',
    'error-label',
    'feedback-duration',
    'from',
    'success-label',
    'value',
  ] as const;
  static readonly template = String.raw`
    <button class="button" part="base button" type="button">
      <span class="icon" part="icon" aria-hidden="true">
        <slot name="copy-icon"><span data-copy-icon>⧉</span></slot>
        <slot name="success-icon"><span data-success-icon>✓</span></slot>
        <slot name="error-icon"><span data-error-icon>!</span></slot>
      </span>
      <span class="label" part="label"><slot><span data-label></span></slot></span>
    </button>
    <span class="status" part="status" role="status" aria-live="polite"></span>
  `;
  static readonly styles = String.raw`
    ${motionStyles}

    :host { display: inline-flex; vertical-align: middle; }
    .button {
      display: inline-flex;
      min-height: var(--rg-control-height-sm, 2.25rem);
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0 0.75rem;
      border: 1px solid var(--_rg-border);
      border-radius: var(--rg-radius-md, 0.875rem);
      color: var(--_rg-text);
      background: var(--_rg-surface);
      box-shadow: none;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 720;
      transition: border-color var(--_rg-base) var(--_rg-ease), color var(--_rg-base) var(--_rg-ease),
        background var(--_rg-base) var(--_rg-ease), transform var(--_rg-base) var(--_rg-spring);
    }
    .button:hover:not(:disabled) { border-color: var(--_rg-brand); color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
    .button:active:not(:disabled) {
      transform: scale(0.95);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    .button:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
    .button:disabled { cursor: not-allowed; opacity: 0.52; }
    .icon { display: inline-grid; width: 1em; height: 1em; place-items: center; line-height: 1; }
    .icon slot { grid-area: 1 / 1; }
    .status { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    :host([data-copy-state='success']) .button { color: var(--_rg-success); border-color: color-mix(in srgb, var(--_rg-success) 48%, var(--_rg-border)); background: var(--_rg-success-soft); }
    :host([data-copy-state='error']) .button { color: var(--_rg-danger); border-color: color-mix(in srgb, var(--_rg-danger) 48%, var(--_rg-border)); background: var(--_rg-danger-soft); }
  `;

  #state: CopyState = 'idle';
  #feedbackTimer = 0;

  get value(): string {
    return this.getString('value');
  }

  set value(value: string) {
    this.setString('value', value);
  }

  get from(): string {
    return this.getString('from');
  }

  set from(value: string) {
    this.setString('from', value);
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  get copyLabel(): string {
    return this.getString('copy-label', 'Copy');
  }

  set copyLabel(value: string) {
    this.setString('copy-label', value);
  }

  get successLabel(): string {
    return this.getString('success-label', 'Copied');
  }

  set successLabel(value: string) {
    this.setString('success-label', value);
  }

  get errorLabel(): string {
    return this.getString('error-label', 'Copy failed');
  }

  set errorLabel(value: string) {
    this.setString('error-label', value);
  }

  get feedbackDuration(): number {
    return Math.max(0, this.getNumber('feedback-duration', 2000));
  }

  set feedbackDuration(value: number) {
    this.setNumber('feedback-duration', Math.max(0, value));
  }

  protected onConnect(signal: AbortSignal): void {
    this.listen(this.query<HTMLButtonElement>('.button'), 'click', () => void this.copy(), signal);
  }

  protected onDisconnect(): void {
    if (this.#feedbackTimer) window.clearTimeout(this.#feedbackTimer);
    this.#feedbackTimer = 0;
  }

  protected update(): void {
    const button = this.query<HTMLButtonElement>('.button');
    const copyIcon = this.query<HTMLSlotElement>('slot[name="copy-icon"]');
    const successIcon = this.query<HTMLSlotElement>('slot[name="success-icon"]');
    const errorIcon = this.query<HTMLSlotElement>('slot[name="error-icon"]');
    const label =
      this.#state === 'success'
        ? this.successLabel
        : this.#state === 'error'
          ? this.errorLabel
          : this.copyLabel;
    button.disabled = this.disabled;
    button.setAttribute('aria-label', label);
    this.query<HTMLElement>('[data-label]').textContent = label;
    copyIcon.hidden = this.#state !== 'idle';
    successIcon.hidden = this.#state !== 'success';
    errorIcon.hidden = this.#state !== 'error';
    this.query<HTMLElement>('[data-copy-icon]').hidden = this.#state !== 'idle';
    this.query<HTMLElement>('[data-success-icon]').hidden = this.#state !== 'success';
    this.query<HTMLElement>('[data-error-icon]').hidden = this.#state !== 'error';
    if (this.#state === 'idle') this.removeAttribute('data-copy-state');
    else this.setAttribute('data-copy-state', this.#state);
  }

  async copy(): Promise<void> {
    if (this.disabled) return;
    const source = this.from ? 'from' : 'value';
    const value = this.#resolveValue();

    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API is unavailable.');
      await navigator.clipboard.writeText(value);
      this.#showFeedback('success');
      this.emit<RgCopyDetail>('rg-copy', { value, source });
    } catch (error) {
      this.#showFeedback('error');
      this.emit<RgCopyErrorDetail>('rg-error', { value, source, error });
    }
  }

  #resolveValue(): string {
    if (!this.from) return this.value;
    let source: Element | null = null;
    try {
      const root = this.getRootNode();
      source =
        root instanceof Document || root instanceof ShadowRoot
          ? root.querySelector(this.from)
          : this.ownerDocument.querySelector(this.from);
    } catch {
      source = null;
    }
    if (source instanceof HTMLInputElement || source instanceof HTMLTextAreaElement) {
      return source.value;
    }
    return source?.textContent ?? '';
  }

  #showFeedback(state: Exclude<CopyState, 'idle'>): void {
    if (this.#feedbackTimer) window.clearTimeout(this.#feedbackTimer);
    this.#state = state;
    this.query<HTMLElement>('.status').textContent =
      state === 'success' ? this.successLabel : this.errorLabel;
    this.update();
    if (this.feedbackDuration === 0) return;
    this.#feedbackTimer = window.setTimeout(() => {
      this.#feedbackTimer = 0;
      this.#state = 'idle';
      this.query<HTMLElement>('.status').textContent = '';
      this.update();
    }, this.feedbackDuration);
  }
}
