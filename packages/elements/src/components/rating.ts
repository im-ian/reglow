import { FormAssociatedElement } from '../core/form-associated.js';
import { fieldStyles } from '../styles/base.js';

export type RgRatingSize = 'sm' | 'md' | 'lg';

export interface RgRatingValueChangeDetail {
  readonly value: number;
  readonly previousValue: number;
}

export class RgRatingElement extends FormAssociatedElement {
  static readonly tagName = 'rg-rating' as const;
  static readonly observedAttributes = [
    'description',
    'disabled',
    'error',
    'invalid',
    'label',
    'max',
    'name',
    'readonly',
    'required',
    'size',
    'value',
  ] as const;
  static readonly template = String.raw`
    <div class="field" part="field">
      <span class="label" part="label"></span>
      <div class="stars" part="control"></div>
      <span class="hint" part="description"></span>
      <span class="error" part="error" role="alert"></span>
    </div>
  `;
  static readonly styles = String.raw`
    ${fieldStyles}

    .stars { display: inline-flex; width: fit-content; gap: 0.12rem; color: var(--_rg-border-strong); }
    .star {
      display: inline-grid;
      width: 2rem;
      height: 2rem;
      padding: 0;
      border: 0;
      border-radius: 50%;
      color: inherit;
      background: transparent;
      cursor: pointer;
      font-size: 1.55rem;
      line-height: 1;
      place-items: center;
      transition: color var(--_rg-base) var(--_rg-ease), background var(--_rg-base) var(--_rg-ease),
        transform var(--_rg-base) var(--_rg-spring);
    }
    :host(:not([readonly])) .star:hover:not(:disabled) { color: var(--_rg-brand); background: var(--_rg-brand-soft); transform: scale(1.09) rotate(-2deg); }
    :host(:not([readonly])) .star:active:not(:disabled) {
      transform: scale(0.88);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    .star:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
    .star[aria-checked='true'], .star[data-filled] { color: var(--_rg-brand); text-shadow: none; }
    .star:disabled { cursor: not-allowed; }
    :host([readonly]) .star { cursor: default; }
    :host([disabled]), :host([data-form-disabled]) { opacity: 0.52; }
    :host([size='sm']) .star { width: 1.65rem; height: 1.65rem; font-size: 1.25rem; }
    :host([size='lg']) .star { width: 2.45rem; height: 2.45rem; font-size: 1.95rem; }
    .stars[aria-invalid='true'] { padding: 0.2rem; border-radius: var(--rg-radius-md, 0.875rem); box-shadow: 0 0 0 1px var(--_rg-danger); }
  `;

  #labelId = '';
  #descriptionId = '';
  #errorId = '';
  #renderedMax = 0;

  get value(): number {
    const value = Math.round(this.getNumber('value', 0));
    return Math.min(this.max, Math.max(0, value));
  }

  set value(value: number) {
    this.setNumber('value', Math.round(value));
  }

  get max(): number {
    const max = Math.round(this.getNumber('max', 5));
    return Math.min(20, Math.max(1, max));
  }

  set max(value: number) {
    if (!Number.isFinite(value)) {
      this.removeAttribute('max');
      return;
    }
    this.setNumber('max', Math.min(20, Math.max(1, Math.round(value))));
  }

  get label(): string {
    return this.getString('label');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get description(): string {
    return this.getString('description');
  }

  set description(value: string) {
    this.setString('description', value);
  }

  get error(): string {
    return this.getString('error');
  }

  set error(value: string) {
    this.setString('error', value);
  }

  get invalid(): boolean {
    return this.getBoolean('invalid');
  }

  set invalid(value: boolean) {
    this.setBoolean('invalid', value);
  }

  get readOnly(): boolean {
    return this.getBoolean('readonly');
  }

  set readOnly(value: boolean) {
    this.setBoolean('readonly', value);
  }

  get size(): RgRatingSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgRatingSize) {
    this.setString('size', value === 'md' ? null : value);
  }

  protected onMount(): void {
    this.#labelId = this.createId('rg-rating-label');
    this.#descriptionId = `${this.#labelId}-description`;
    this.#errorId = `${this.#labelId}-error`;
    this.query<HTMLElement>('.label').id = this.#labelId;
    this.query<HTMLElement>('.hint').id = this.#descriptionId;
    this.query<HTMLElement>('.error').id = this.#errorId;
    this.initialValue = String(this.value);
  }

  protected onConnect(signal: AbortSignal): void {
    const stars = this.query<HTMLElement>('.stars');
    this.listen(stars, 'click', (event) => this.#handleClick(event as MouseEvent), signal);
    this.listen(stars, 'keydown', (event) => this.#handleKeydown(event as KeyboardEvent), signal);
  }

  protected update(): void {
    if (!this.shadowRoot) return;
    if (this.#renderedMax !== this.max) this.#renderStars();
    const stars = this.query<HTMLElement>('.stars');
    const buttons = this.#buttons();
    const disabled = this.disabled || this.hasAttribute('data-form-disabled');
    const value = this.value;
    const label = this.query<HTMLElement>('.label');
    const hint = this.query<HTMLElement>('.hint');
    const error = this.query<HTMLElement>('.error');
    const errorMessage = this.error || (this.invalid ? 'Invalid rating.' : '');

    label.textContent = this.label;
    label.hidden = !this.label;
    hint.textContent = this.description;
    hint.hidden = !this.description;
    error.textContent = this.error;
    error.hidden = !this.error;

    stars.setAttribute('role', 'radiogroup');
    stars.setAttribute('aria-label', this.label || 'Rating');
    stars.setAttribute('aria-required', String(this.required));
    stars.setAttribute('aria-disabled', String(disabled));
    stars.setAttribute('aria-readonly', String(this.readOnly));
    const describedBy = [
      this.description ? this.#descriptionId : '',
      this.error ? this.#errorId : '',
    ]
      .filter(Boolean)
      .join(' ');
    if (describedBy) stars.setAttribute('aria-describedby', describedBy);
    else stars.removeAttribute('aria-describedby');

    buttons.forEach((button, index) => {
      const ratingValue = index + 1;
      button.disabled = disabled;
      button.setAttribute('aria-checked', String(value === ratingValue));
      button.toggleAttribute('data-filled', value >= ratingValue);
      button.tabIndex = !disabled && ratingValue === (value || 1) ? 0 : -1;
    });

    const valueMissing = !disabled && this.required && value === 0;
    const customError = Boolean(errorMessage);
    if (valueMissing)
      this.internals?.setValidity({ valueMissing: true }, this.error || 'Please provide a rating.');
    else if (customError) this.internals?.setValidity({ customError: true }, errorMessage);
    else this.internals?.setValidity({});
    const isInvalid = valueMissing || customError;
    stars.setAttribute('aria-invalid', String(isInvalid));
    if (this.error && isInvalid) stars.setAttribute('aria-errormessage', this.#errorId);
    else stars.removeAttribute('aria-errormessage');
    this.setFormValue(disabled || value === 0 ? null : String(value), String(value));
  }

  protected restoreFormValue(value: string): void {
    this.value = Number(value);
  }

  #renderStars(): void {
    const stars = this.query<HTMLElement>('.stars');
    stars.replaceChildren();
    for (let value = 1; value <= this.max; value += 1) {
      const button = document.createElement('button');
      button.className = 'star';
      button.type = 'button';
      button.dataset.ratingValue = String(value);
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-label', `${value} of ${this.max}`);
      button.textContent = '★';
      stars.append(button);
    }
    this.#renderedMax = this.max;
  }

  #handleClick(event: MouseEvent): void {
    if (this.disabled || this.readOnly || this.hasAttribute('data-form-disabled')) return;
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-rating-value]');
    if (button) this.#select(Number(button.dataset.ratingValue), true);
  }

  #handleKeydown(event: KeyboardEvent): void {
    if (this.disabled || this.readOnly || this.hasAttribute('data-form-disabled')) return;
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-rating-value]');
    if (!button) return;
    let next = this.value || Number(button.dataset.ratingValue);
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next -= 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next += 1;
    else if (event.key === 'Home') next = 1;
    else if (event.key === 'End') next = this.max;
    else return;
    event.preventDefault();
    next = Math.min(this.max, Math.max(1, next));
    this.#select(next, true);
    this.#buttons()[next - 1]?.focus();
  }

  #select(value: number, notify: boolean): void {
    const previousValue = this.value;
    const next = Math.min(this.max, Math.max(0, Math.round(value)));
    if (next === previousValue) return;
    this.value = next;
    this.update();
    if (!notify) return;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    this.emit<RgRatingValueChangeDetail>('rg-value-change', { value: next, previousValue });
  }

  #buttons(): HTMLButtonElement[] {
    return Array.from(
      this.shadowRoot?.querySelectorAll<HTMLButtonElement>('[data-rating-value]') ?? [],
    );
  }
}
