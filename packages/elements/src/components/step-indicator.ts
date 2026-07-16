import { ReglowElement } from '../core/reglow-element.js';

export type RgStepState = 'complete' | 'current' | 'upcoming';
export type RgStepIndicatorOrientation = 'horizontal' | 'vertical';

export class RgStepElement extends ReglowElement {
  static readonly tagName = 'rg-step' as const;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = [
    'description',
    'label',
    'optional',
    'optional-label',
    'value',
  ] as const;
  static readonly template = String.raw`
    <div class="step" part="base">
      <span class="rail" part="rail" aria-hidden="true">
        <span class="line" part="line"></span>
        <span class="marker" part="marker">
          <span data-index></span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3.5 8.25 2.7 2.7 6.3-6.3"></path>
          </svg>
        </span>
      </span>
      <span class="content" part="content">
        <span class="label" part="label"><slot></slot><span data-label></span></span>
        <span class="description" part="description"><slot name="description"></slot><span data-description></span></span>
        <span class="optional" part="optional" data-optional></span>
        <span class="status" data-status></span>
      </span>
    </div>
  `;
  static readonly styles = String.raw`
    :host { display: block; min-width: 0; }
    .step { display: grid; min-width: 0; gap: 0.55rem; }
    .rail { position: relative; display: grid; min-height: 2rem; place-items: center; }
    .line {
      position: absolute;
      z-index: 0;
      inset-block-start: calc(50% - 1px);
      inset-inline-start: 50%;
      width: 100%;
      height: 2px;
      background: var(--_rg-border);
      transition: background var(--_rg-base) var(--_rg-ease);
    }
    :host([data-state='complete']) .line { background: var(--_rg-brand); }
    :host([data-last]) .line { display: none; }
    .marker {
      position: relative;
      z-index: 1;
      display: inline-grid;
      width: 2rem;
      height: 2rem;
      place-items: center;
      border: 2px solid var(--_rg-border-strong);
      border-radius: 50%;
      color: var(--_rg-text-muted);
      background: var(--_rg-surface);
      font-size: 0.75rem;
      font-weight: 780;
      font-variant-numeric: tabular-nums;
      transition: color var(--_rg-base) var(--_rg-ease), border-color var(--_rg-base) var(--_rg-ease), background var(--_rg-base) var(--_rg-ease), transform var(--_rg-base) var(--_rg-spring);
    }
    .marker svg { display: none; width: 1rem; height: 1rem; }
    :host([data-state='complete']) .marker {
      border-color: var(--_rg-brand);
      color: var(--_rg-brand);
      background: var(--_rg-surface);
    }
    :host([data-state='complete']) .marker svg { display: block; }
    :host([data-state='complete']) [data-index] { display: none; }
    :host([data-state='current']) .marker {
      border-color: var(--_rg-brand);
      color: var(--_rg-brand-text);
      background: var(--_rg-brand-soft);
      transform: scale(1.06);
    }
    .content { display: flex; min-width: 0; flex-wrap: wrap; align-items: baseline; justify-content: center; gap: 0.18rem 0.4rem; text-align: center; }
    .label { min-width: 0; color: var(--_rg-text-muted); font-size: 0.8rem; font-weight: 680; line-height: 1.35; }
    :host([data-state='current']) .label { color: var(--_rg-text); font-weight: 780; }
    :host([data-state='complete']) .label { color: var(--_rg-brand-text); }
    .description { display: none; flex-basis: 100%; color: var(--_rg-text-muted); font-size: 0.72rem; line-height: 1.4; }
    .description[data-has-content] { display: block; }
    .optional { color: var(--_rg-text-subtle); font-size: 0.68rem; font-weight: 620; }
    .status { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

    :host([data-orientation='vertical']) .step { grid-template-columns: 2rem minmax(0, 1fr); gap: 0.8rem; }
    :host([data-orientation='vertical']) .rail { min-height: 4rem; align-items: start; }
    :host([data-orientation='vertical']) .line {
      inset-block-start: 2rem;
      inset-inline-start: calc(50% - 1px);
      width: 2px;
      height: calc(100% - 2rem);
    }
    :host([data-orientation='vertical']) .content { display: flex; padding-block: 0.28rem 1.5rem; justify-content: flex-start; text-align: start; }
    :host([data-orientation='vertical']) .description { display: none; }
    :host([data-orientation='vertical']) .description[data-has-content] { display: block; }

    @media (forced-colors: active) {
      .marker { border-color: CanvasText; }
      :host([data-state='complete']) .marker { color: HighlightText; background: Highlight; }
      :host([data-state='current']) .marker { border-color: Highlight; }
    }
  `;

  get value(): string {
    return this.getString('value');
  }

  set value(value: string) {
    this.setString('value', value);
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

  get optional(): boolean {
    return this.getBoolean('optional');
  }

  set optional(value: boolean) {
    this.setBoolean('optional', value);
  }

  get optionalLabel(): string {
    return this.getString('optional-label', 'Optional');
  }

  set optionalLabel(value: string) {
    this.setString('optional-label', value);
  }

  protected onConnect(signal: AbortSignal): void {
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.update(), signal);
    });
  }

  protected update(): void {
    const labelSlot = this.query<HTMLSlotElement>('slot:not([name])');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const hasSlottedLabel = labelSlot.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
    });
    const hasSlottedDescription = descriptionSlot
      .assignedNodes({ flatten: true })
      .some((node) => node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim()));
    this.query<HTMLElement>('[data-label]').textContent = hasSlottedLabel ? '' : this.label;
    this.query<HTMLElement>('[data-description]').textContent = hasSlottedDescription
      ? ''
      : this.description;
    this.query<HTMLElement>('.description').toggleAttribute(
      'data-has-content',
      hasSlottedDescription || Boolean(this.description),
    );
    const optional = this.query<HTMLElement>('[data-optional]');
    optional.hidden = !this.optional;
    optional.textContent = this.optional ? this.optionalLabel : '';
  }

  syncPresentation(
    state: RgStepState,
    orientation: RgStepIndicatorOrientation,
    statusLabel: string,
    index: number,
    isLast: boolean,
  ): void {
    this.mount();
    this.setAttribute('role', 'listitem');
    this.setAttribute('data-state', state);
    this.setAttribute('data-orientation', orientation);
    this.toggleAttribute('data-last', isLast);
    this.query<HTMLElement>('[data-index]').textContent = String(index + 1);
    this.query<HTMLElement>('[data-status]').textContent = statusLabel;
    if (state === 'current') this.setAttribute('aria-current', 'step');
    else this.removeAttribute('aria-current');
  }
}

export class RgStepIndicatorElement extends ReglowElement {
  static readonly tagName = 'rg-step-indicator' as const;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = [
    'complete-label',
    'current-label',
    'label',
    'orientation',
    'upcoming-label',
    'value',
  ] as const;
  static readonly template = String.raw`
    <nav part="base nav">
      <ol part="list" role="list"><slot></slot></ol>
    </nav>
  `;
  static readonly styles = String.raw`
    :host { display: block; min-width: 0; }
    ol {
      display: grid;
      grid-template-columns: repeat(var(--_rg-step-count, 1), minmax(0, 1fr));
      min-width: 0;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    :host([orientation='vertical']) ol { grid-template-columns: minmax(0, 1fr); }
  `;

  #observer?: MutationObserver;

  get value(): string {
    return this.getString('value');
  }

  set value(value: string) {
    this.setString('value', value);
  }

  get label(): string {
    return this.getString('label', 'Progress');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get orientation(): RgStepIndicatorOrientation {
    return this.getString('orientation') === 'vertical' ? 'vertical' : 'horizontal';
  }

  set orientation(value: RgStepIndicatorOrientation) {
    this.setString('orientation', value === 'horizontal' ? null : value);
  }

  get completeLabel(): string {
    return this.getString('complete-label', 'Completed');
  }

  set completeLabel(value: string) {
    this.setString('complete-label', value);
  }

  get currentLabel(): string {
    return this.getString('current-label', 'Current step');
  }

  set currentLabel(value: string) {
    this.setString('current-label', value);
  }

  get upcomingLabel(): string {
    return this.getString('upcoming-label', 'Upcoming');
  }

  set upcomingLabel(value: string) {
    this.setString('upcoming-label', value);
  }

  protected onConnect(signal: AbortSignal): void {
    const slot = this.query<HTMLSlotElement>('slot');
    this.listen(slot, 'slotchange', () => this.update(), signal);
    this.#observer = new MutationObserver(() => this.update());
    this.#observer.observe(this, {
      attributes: true,
      attributeFilter: ['value'],
      childList: true,
      subtree: true,
    });
  }

  protected onDisconnect(): void {
    this.#observer?.disconnect();
    this.#observer = undefined;
  }

  protected update(): void {
    const nav = this.shadowRoot?.querySelector<HTMLElement>('nav');
    if (!nav) return;
    nav.setAttribute('aria-label', this.label);

    const steps = Array.from(this.children).filter(
      (child): child is RgStepElement => child.localName === RgStepElement.tagName,
    );
    this.style.setProperty('--_rg-step-count', String(Math.max(1, steps.length)));
    if (steps.length === 0) return;

    const values = steps.map((step, index) => step.value || String(index + 1));
    let currentIndex = values.indexOf(this.value);
    if (currentIndex === -1) {
      currentIndex = 0;
      this.setString('value', values[0]);
    }

    steps.forEach((step, index) => {
      const state: RgStepState =
        index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming';
      const statusLabel =
        state === 'complete'
          ? this.completeLabel
          : state === 'current'
            ? this.currentLabel
            : this.upcomingLabel;
      step.syncPresentation(
        state,
        this.orientation,
        statusLabel,
        index,
        index === steps.length - 1,
      );
    });
  }
}
