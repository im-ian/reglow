import { ReglowElement, type InteractionStateDescriptor } from './reglow-element.js';

export abstract class FormAssociatedElement extends ReglowElement {
  static readonly formAssociated = true;
  static readonly interactionState: InteractionStateDescriptor = {
    value: {
      events: ['input', 'change'],
      strategy: 'restore',
    },
  };

  protected readonly internals: ElementInternals | null;
  protected initialValue = '';

  constructor() {
    super();
    this.internals = typeof this.attachInternals === 'function' ? this.attachInternals() : null;
  }

  get form(): HTMLFormElement | null {
    return this.internals?.form ?? null;
  }

  get labels(): readonly HTMLLabelElement[] {
    return Array.from(this.internals?.labels ?? []) as HTMLLabelElement[];
  }

  get name(): string {
    return this.getAttribute('name') ?? '';
  }

  set name(value: string) {
    this.setString('name', value);
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  get required(): boolean {
    return this.getBoolean('required');
  }

  set required(value: boolean) {
    this.setBoolean('required', value);
  }

  get validity(): ValidityState | undefined {
    return this.internals?.validity;
  }

  get validationMessage(): string {
    return this.internals?.validationMessage ?? '';
  }

  checkValidity(): boolean {
    return this.internals?.checkValidity() ?? true;
  }

  reportValidity(): boolean {
    return this.internals?.reportValidity() ?? true;
  }

  protected setFormValue(
    value: string | File | FormData | null,
    state?: string | File | FormData,
  ): void {
    this.internals?.setFormValue(value, state);
  }

  protected mirrorValidity(
    control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ): void {
    if (!this.internals) return;
    if (control.validity.valid) this.internals.setValidity({});
    else this.internals.setValidity(control.validity, control.validationMessage, control);
  }

  formDisabledCallback(disabled: boolean): void {
    this.toggleAttribute('data-form-disabled', disabled);
    if (this.shadowRoot?.querySelector('[data-rg-shadow-root]')) this.update('disabled');
  }

  formResetCallback(): void {
    this.restoreFormValue(this.initialValue);
  }

  formStateRestoreCallback(state: string | File | FormData | null): void {
    this.restoreFormValue(typeof state === 'string' ? state : this.initialValue);
  }

  protected abstract restoreFormValue(value: string): void;
}
