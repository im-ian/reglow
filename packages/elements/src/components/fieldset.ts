import { ReglowElement } from '../core/reglow-element.js';

function hasAssignedContent(slot: HTMLSlotElement): boolean {
  return slot.assignedNodes({ flatten: true }).some((node) => {
    return node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim());
  });
}

export class RgFieldsetElement extends ReglowElement {
  static readonly tagName = 'rg-fieldset' as const;
  static readonly observedAttributes = [
    'description',
    'disabled',
    'error',
    'invalid',
    'legend',
  ] as const;
  static readonly delegatesFocus = false;
  static readonly template = String.raw`
    <fieldset part="base fieldset">
      <legend part="legend"><slot name="legend"><span data-legend></span></slot></legend>
      <div class="description" part="description">
        <slot name="description"><span data-description></span></slot>
      </div>
      <div class="content" part="content"><slot></slot></div>
      <div class="error" part="error" role="alert">
        <slot name="error"><span data-error></span></slot>
      </div>
    </fieldset>
  `;
  static readonly styles = String.raw`
    :host { display: block; }
    fieldset {
      display: grid;
      min-width: 0;
      gap: 0.75rem;
      margin: 0;
      padding: 1rem;
      border: 1px solid var(--_rg-border);
      border-radius: var(--rg-radius-lg, 1.125rem);
      background: color-mix(in srgb, var(--_rg-surface) 72%, transparent);
    }
    legend {
      max-width: 100%;
      padding: 0 0.38rem;
      color: var(--_rg-text);
      font-size: 0.92rem;
      font-weight: 760;
      letter-spacing: -0.012em;
    }
    .description { color: var(--_rg-text-muted); font-size: 0.8rem; line-height: 1.45; }
    .content { display: grid; gap: var(--rg-fieldset-gap, 0.75rem); min-width: 0; }
    .error { color: var(--_rg-danger); font-size: 0.8rem; font-weight: 650; }
    :host([invalid]) fieldset { border-color: var(--_rg-danger); }
    :host([disabled]) fieldset { opacity: 0.64; }
  `;

  get legend(): string {
    return this.getString('legend');
  }

  set legend(value: string) {
    this.setString('legend', value);
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

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  get invalid(): boolean {
    return this.getBoolean('invalid');
  }

  set invalid(value: boolean) {
    this.setBoolean('invalid', value);
  }

  protected onConnect(signal: AbortSignal): void {
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.update(), signal);
    });
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => this.update());
      observer.observe(this, { childList: true, subtree: true });
      signal.addEventListener('abort', () => observer.disconnect(), { once: true });
    }
  }

  protected update(): void {
    const fieldset = this.query<HTMLFieldSetElement>('fieldset');
    const legendSlot = this.query<HTMLSlotElement>('slot[name="legend"]');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const errorSlot = this.query<HTMLSlotElement>('slot[name="error"]');
    const hasLegend = Boolean(this.legend) || hasAssignedContent(legendSlot);
    const hasDescription = Boolean(this.description) || hasAssignedContent(descriptionSlot);
    const hasError = Boolean(this.error) || hasAssignedContent(errorSlot);

    fieldset.disabled = this.disabled;
    this.query<HTMLElement>('[data-legend]').textContent = this.legend;
    this.query<HTMLElement>('[data-description]').textContent = this.description;
    this.query<HTMLElement>('[data-error]').textContent = this.error;
    this.query<HTMLElement>('legend').hidden = !hasLegend;
    this.query<HTMLElement>('.description').hidden = !hasDescription;
    this.query<HTMLElement>('.error').hidden = !hasError;
    fieldset.setAttribute('aria-invalid', String(this.invalid || hasError));
    this.#cascadeDisabled();
  }

  #cascadeDisabled(): void {
    const controls = Array.from(this.querySelectorAll<HTMLElement>('*')).filter(
      (element) => 'disabled' in element,
    );
    controls.forEach((control) => {
      if (this.disabled) {
        if (!control.hasAttribute('disabled')) {
          control.setAttribute('data-rg-fieldset-disabled', '');
          control.setAttribute('disabled', '');
        }
      } else if (control.hasAttribute('data-rg-fieldset-disabled')) {
        control.removeAttribute('data-rg-fieldset-disabled');
        control.removeAttribute('disabled');
      }
    });
  }
}
