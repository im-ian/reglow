import { ReglowElement } from '../core/reglow-element.js';
import { motionStyles } from '../styles/base.js';

export interface AccordionItemOpenChangeDetail {
  readonly value: string;
  readonly open: boolean;
}

export interface AccordionValueChangeDetail {
  readonly value: string | readonly string[];
  readonly previousValue: string | readonly string[];
}

export class RgAccordionItemElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-accordion-item';
  static readonly observedAttributes = ['value', 'open', 'disabled', 'heading-level'];
  static readonly styles = String.raw`
    ${motionStyles}

    :host { display: block; border-block-end: 1px solid var(--_rg-border); }
    :host(:first-of-type) { border-block-start: 1px solid var(--_rg-border); }
    details { color: var(--_rg-text); }
    summary {
      display: flex;
      min-height: 3.5rem;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.8rem 0.2rem;
      border-radius: var(--rg-radius-md, 0.875rem);
      cursor: pointer;
      list-style: none;
      font-size: 0.925rem;
      font-weight: 730;
      letter-spacing: -0.012em;
      transition: color var(--_rg-base) var(--_rg-ease), background var(--_rg-base) var(--_rg-ease),
        padding var(--_rg-base) var(--_rg-ease);
    }
    summary::-webkit-details-marker { display: none; }
    :host(:not([disabled])) summary:hover {
      color: var(--_rg-brand-text);
      background: rgb(83 103 248 / 6%);
      padding-inline: 0.75rem;
    }
    summary:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
    :host([disabled]) summary { opacity: 0.45; cursor: not-allowed; }
    .icon {
      display: inline-grid;
      width: 1.75rem;
      height: 1.75rem;
      flex: 0 0 auto;
      place-items: center;
      border-radius: 999px;
      color: var(--_rg-text-muted);
      background: var(--_rg-canvas-subtle);
      transition: color var(--_rg-base) var(--_rg-ease), background var(--_rg-base) var(--_rg-ease),
        transform var(--_rg-slow) var(--_rg-spring);
    }
    :host([open]) .icon { color: var(--_rg-on-brand); background: var(--_rg-brand); transform: rotate(45deg); }
    .icon svg { width: 0.95rem; height: 0.95rem; stroke: currentColor; }
    .panel {
      display: grid;
      grid-template-rows: 1fr;
      overflow: hidden;
      transform-origin: top center;
    }
    .panel-clip { min-height: 0; overflow: hidden; }
    .panel.is-opening,
    .panel.is-closing {
      contain: layout paint;
      will-change: grid-template-rows, opacity, transform;
    }
    .panel.is-opening {
      animation: rg-accordion-panel-open var(--_rg-slow) var(--_rg-ease) both;
    }
    .panel.is-opening .content {
      animation: rg-accordion-content-open var(--_rg-slow) var(--_rg-ease) both;
    }
    .panel.is-closing {
      pointer-events: none;
      animation: rg-accordion-panel-close var(--_rg-slow) var(--_rg-ease) both;
    }
    .panel.is-closing .content {
      animation: rg-accordion-content-close var(--_rg-fast) var(--_rg-ease) both;
    }
    .content {
      padding: 0.15rem 0.2rem 1rem;
      color: var(--_rg-text-muted);
      font-size: 0.875rem;
      line-height: 1.65;
    }
    @keyframes rg-accordion-panel-open {
      from {
        grid-template-rows: 0fr;
        opacity: 0;
        transform: translateY(-0.45rem) scaleY(0.96);
      }
      70% { opacity: 1; }
      to {
        grid-template-rows: 1fr;
        opacity: 1;
        transform: translateY(0) scaleY(1);
      }
    }
    @keyframes rg-accordion-content-open {
      from { opacity: 0; transform: translateY(-0.3rem); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes rg-accordion-panel-close {
      from {
        grid-template-rows: 1fr;
        opacity: 1;
        transform: translateY(0) scaleY(1);
      }
      to {
        grid-template-rows: 0fr;
        opacity: 0;
        transform: translateY(-0.35rem) scaleY(0.97);
      }
    }
    @keyframes rg-accordion-content-close {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-0.2rem); }
    }
  `;

  #closing = false;
  static readonly template = String.raw`
    <details part="base">
      <summary part="trigger">
        <span class="heading" part="heading"><slot name="heading"></slot></span>
        <span class="icon" part="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </span>
      </summary>
      <div class="panel" part="panel">
        <div class="panel-clip"><div class="content" part="content"><slot></slot></div></div>
      </div>
    </details>
  `;

  get value(): string {
    return this.getString('value');
  }

  set value(value: string) {
    this.setString('value', value);
  }

  get open(): boolean {
    return this.getBoolean('open');
  }

  set open(value: boolean) {
    this.setBoolean('open', value);
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  override focus(options?: FocusOptions): void {
    this.query<HTMLElement>('summary').focus(options);
  }

  protected onConnect(signal: AbortSignal): void {
    const details = this.query<HTMLDetailsElement>('details');
    const summary = this.query<HTMLElement>('summary');
    const panel = this.query<HTMLElement>('.panel');
    this.listen(
      summary,
      'click',
      (event) => {
        if (this.disabled) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        if (details.open) {
          const reopening = this.#closing;
          this.#requestUserOpen(reopening);
          if (reopening) this.restartOpenAnimation(panel);
        } else {
          this.restartOpenAnimation(panel);
          this.#requestUserOpen(true);
        }
      },
      signal,
    );
    this.listen(
      summary,
      'keydown',
      (event) => {
        if (this.disabled && ['Enter', ' '].includes((event as KeyboardEvent).key)) {
          event.preventDefault();
        }
      },
      signal,
    );
    this.listen(
      details,
      'toggle',
      () => {
        if (details.open) this.restartOpenAnimation(panel);
        else panel.classList.remove('is-opening');
        if (details.open === this.open) return;
        this.open = details.open;
        this.emit<AccordionItemOpenChangeDetail>('rg-open-change', {
          value: this.value,
          open: this.open,
        });
      },
      signal,
    );
    const finishAnimation = (event: Event) => {
      if (event.target !== panel) return;
      if (this.#closing) this.#finishCloseAnimation(details, panel);
      else panel.classList.remove('is-opening');
    };
    this.listen(panel, 'animationend', finishAnimation, signal);
    this.listen(panel, 'animationcancel', finishAnimation, signal);
  }

  protected update(): void {
    const details = this.query<HTMLDetailsElement>('details');
    const panel = this.query<HTMLElement>('.panel');
    const summary = this.query<HTMLElement>('summary');
    const heading = this.query<HTMLElement>('.heading');
    const headingLevel = this.hasAttribute('heading-level')
      ? Math.max(1, Math.min(6, this.getNumber('heading-level', 3)))
      : 3;
    if (this.open) {
      this.#cancelCloseAnimation(panel);
      if (!details.open) this.restartOpenAnimation(panel);
      details.open = true;
    } else if (details.open) {
      this.#startCloseAnimation(panel);
    }
    summary.setAttribute('aria-disabled', String(this.disabled));
    summary.tabIndex = this.disabled ? -1 : 0;
    heading.setAttribute('role', 'heading');
    heading.setAttribute('aria-level', String(headingLevel));
  }

  private restartOpenAnimation(panel: HTMLElement): void {
    this.#cancelCloseAnimation(panel);
    panel.classList.add('is-opening');
  }

  #requestUserOpen(open: boolean): void {
    if (this.open === open) return;
    this.open = open;
    this.emit<AccordionItemOpenChangeDetail>('rg-open-change', {
      value: this.value,
      open,
    });
  }

  #startCloseAnimation(panel: HTMLElement): void {
    if (this.#closing) return;
    panel.classList.remove('is-opening');
    this.#closing = true;
    panel.classList.add('is-closing');
  }

  #cancelCloseAnimation(panel: HTMLElement): void {
    if (!this.#closing) return;
    this.#closing = false;
    panel.classList.remove('is-closing');
  }

  #finishCloseAnimation(details: HTMLDetailsElement, panel: HTMLElement): void {
    if (!this.#closing) return;
    this.#closing = false;
    panel.classList.remove('is-closing');
    if (!this.open) details.open = false;
  }
}

export class RgAccordionElement extends ReglowElement {
  static readonly tagName: `rg-${string}` = 'rg-accordion';
  static readonly observedAttributes = ['value', 'multiple', 'collapsible'];
  static readonly styles = String.raw`
    :host { display: block; }
    .accordion { display: grid; width: 100%; }
  `;
  static readonly template = '<div class="accordion" part="base"><slot></slot></div>';

  #syncing = false;

  get multiple(): boolean {
    return this.getBoolean('multiple');
  }

  set multiple(value: boolean) {
    this.setBoolean('multiple', value);
  }

  get collapsible(): boolean {
    return this.getBoolean('collapsible');
  }

  set collapsible(value: boolean) {
    this.setBoolean('collapsible', value);
  }

  get value(): string | string[] {
    const values = this.readValues();
    return this.multiple ? values : (values[0] ?? '');
  }

  set value(value: string | string[]) {
    const values = Array.isArray(value) ? value : value ? [value] : [];
    this.writeValues(this.multiple ? values : values.slice(0, 1));
  }

  protected onConnect(signal: AbortSignal): void {
    const slot = this.query<HTMLSlotElement>('slot');
    this.listen(slot, 'slotchange', () => this.update(), signal);
    this.listen(
      this,
      'rg-open-change',
      (event) => this.onItemOpenChange(event as CustomEvent<AccordionItemOpenChangeDetail>),
      signal,
    );
    this.listen(this, 'keydown', (event) => this.onKeyDown(event as KeyboardEvent), signal);
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((records) => this.onItemMutations(records));
      observer.observe(this, {
        attributes: true,
        attributeFilter: ['disabled', 'open', 'value'],
        childList: true,
        subtree: true,
      });
      signal.addEventListener('abort', () => observer.disconnect(), { once: true });
    }
  }

  protected update(): void {
    if (this.#syncing) return;
    this.#syncing = true;
    const items = this.items();
    items.forEach((item, index) => {
      if (!item.value) item.value = item.id || `item-${index + 1}`;
    });

    let values = this.hasAttribute('value')
      ? this.readValues()
      : items.filter((item) => item.open).map((item) => item.value);
    if (!this.multiple) values = values.slice(0, 1);
    if (!this.collapsible && values.length === 0 && items[0]) values = [items[0].value];
    const allowed = new Set(items.map((item) => item.value));
    values = values.filter((value) => allowed.has(value));

    items.forEach((item) => {
      item.open = values.includes(item.value);
    });
    this.writeValues(values);
    this.#syncing = false;
  }

  private items(): RgAccordionItemElement[] {
    return this.query<HTMLSlotElement>('slot')
      .assignedElements({ flatten: true })
      .filter(
        (element): element is RgAccordionItemElement =>
          element.localName === RgAccordionItemElement.tagName,
      );
  }

  private readValues(): string[] {
    return this.getString('value')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }

  private writeValues(values: readonly string[]): void {
    this.setString('value', values.length > 0 ? values.join(',') : null);
  }

  private onItemOpenChange(event: CustomEvent<AccordionItemOpenChangeDetail>): void {
    const item = event
      .composedPath()
      .find(
        (target): target is RgAccordionItemElement =>
          target instanceof HTMLElement && target.localName === RgAccordionItemElement.tagName,
      );
    if (!item || this.#syncing) return;

    const previousValues = this.readValues();
    let nextValues = [...previousValues];
    if (event.detail.open) {
      nextValues = this.multiple ? [...new Set([...nextValues, item.value])] : [item.value];
    } else {
      nextValues = nextValues.filter((value) => value !== item.value);
      if (!this.collapsible && nextValues.length === 0) {
        item.open = true;
        return;
      }
    }

    this.writeValues(nextValues);
    this.update();
    this.emit<AccordionValueChangeDetail>('rg-value-change', {
      value: this.multiple ? nextValues : (nextValues[0] ?? ''),
      previousValue: this.multiple ? previousValues : (previousValues[0] ?? ''),
    });
  }

  private onItemMutations(records: readonly MutationRecord[]): void {
    if (this.#syncing) return;
    const itemRecords = records.filter(
      (record): record is MutationRecord & { target: RgAccordionItemElement } =>
        record.target instanceof HTMLElement &&
        record.target.localName === RgAccordionItemElement.tagName,
    );
    if (itemRecords.length === 0) return;

    const items = this.items();
    const current = this.readValues();
    const newlyOpened = [...itemRecords]
      .reverse()
      .find((record) => record.attributeName === 'open' && record.target.open)?.target;
    let next = items.filter((item) => item.open).map((item) => item.value);
    if (!this.multiple) next = newlyOpened ? [newlyOpened.value] : next.slice(0, 1);
    if (!this.collapsible && next.length === 0 && items[0]) next = [items[0].value];
    if (current.join(',') === next.join(',')) return;

    this.writeValues(next);
    this.update();
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const item = event
      .composedPath()
      .find(
        (target): target is RgAccordionItemElement =>
          target instanceof HTMLElement && target.localName === RgAccordionItemElement.tagName,
      );
    if (!item) return;
    const enabled = this.items().filter((candidate) => !candidate.disabled);
    const index = enabled.indexOf(item);
    if (index < 0) return;

    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % enabled.length;
    else if (event.key === 'ArrowUp') nextIndex = (index - 1 + enabled.length) % enabled.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = enabled.length - 1;
    enabled[nextIndex]?.focus();
  }
}
