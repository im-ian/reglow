import { ReglowElement } from '../core/reglow-element.js';

export type RgTimelineTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

const timelineTones = new Set<RgTimelineTone>(['neutral', 'brand', 'success', 'warning', 'danger']);

export class RgTimelineItemElement extends ReglowElement {
  static readonly tagName = 'rg-timeline-item' as const;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = [
    'datetime',
    'description',
    'heading',
    'timestamp',
    'tone',
  ] as const;
  static readonly template = `
    <article class="item" part="base">
      <span class="rail" part="rail" aria-hidden="true">
        <span class="marker" part="marker"><slot name="icon"><span class="dot"></span></slot></span>
        <span class="line" part="line"></span>
      </span>
      <span class="content" part="content">
        <time part="time"><slot name="time"></slot><span data-timestamp></span></time>
        <span class="title" part="title"><slot></slot><span data-heading></span></span>
        <span class="description" part="description"><slot name="description"></slot><span data-description></span></span>
      </span>
    </article>
  `;
  static readonly styles = `
    :host {
      --_rg-timeline-color: var(--_rg-brand);
      display: block;
      min-width: 0;
    }

    :host([tone='neutral']) { --_rg-timeline-color: var(--_rg-text-subtle); }
    :host([tone='success']) { --_rg-timeline-color: var(--_rg-success); }
    :host([tone='warning']) { --_rg-timeline-color: var(--_rg-warning); }
    :host([tone='danger']) { --_rg-timeline-color: var(--_rg-danger); }

    .item {
      display: grid;
      min-width: 0;
      grid-template-columns: 1.125rem minmax(0, 1fr);
      gap: 0.8rem;
    }

    .rail {
      position: relative;
      display: flex;
      min-height: 4.65rem;
      justify-content: center;
    }

    .marker {
      position: relative;
      display: inline-grid;
      width: 1.125rem;
      height: 1.125rem;
      margin-block-start: 0.3rem;
      place-items: center;
      border: 2px solid var(--_rg-timeline-color);
      border-radius: 50%;
      color: var(--_rg-timeline-color);
      background: var(--_rg-surface);
      z-index: 1;
    }

    .dot {
      width: 0.28rem;
      height: 0.28rem;
      border-radius: 50%;
      background: currentColor;
    }

    ::slotted([slot='icon']) {
      display: inline-flex;
      width: 0.625rem;
      height: 0.625rem;
      font-size: 0.625rem;
      line-height: 0;
      align-items: center;
      justify-content: center;
    }

    .line {
      position: absolute;
      inset-block: 1.2rem 0;
      inset-inline-start: calc(50% - 1px);
      width: 2px;
      background: color-mix(in srgb, var(--_rg-timeline-color) 42%, var(--_rg-border));
    }

    :host([data-last]) .line { display: none; }

    .content {
      display: flex;
      min-width: 0;
      padding-block-end: 1.5rem;
      flex-direction: column;
      align-items: flex-start;
    }

    time {
      color: var(--_rg-text-subtle);
      font-size: 0.7rem;
      font-weight: 670;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.025em;
      line-height: 1.45;
    }

    time[hidden] { display: none; }

    .title {
      color: var(--_rg-text);
      font-size: 0.88rem;
      font-weight: 780;
      line-height: 1.4;
    }

    .title[hidden] { display: none; }

    .description {
      margin-block-start: 0.18rem;
      color: var(--_rg-text-muted);
      font-size: 0.77rem;
      line-height: 1.5;
    }

    .description[hidden] { display: none; }

    @media (forced-colors: active) {
      .marker { border-color: CanvasText; color: CanvasText; }
      .line { background: CanvasText; }
    }
  `;

  get heading(): string {
    return this.getString('heading');
  }

  set heading(value: string) {
    this.setString('heading', value);
  }

  get description(): string {
    return this.getString('description');
  }

  set description(value: string) {
    this.setString('description', value);
  }

  get timestamp(): string {
    return this.getString('timestamp');
  }

  set timestamp(value: string) {
    this.setString('timestamp', value);
  }

  get dateTime(): string {
    return this.getString('datetime');
  }

  set dateTime(value: string) {
    this.setString('datetime', value);
  }

  get tone(): RgTimelineTone {
    const value = this.getString('tone', 'brand') as RgTimelineTone;
    return timelineTones.has(value) ? value : 'brand';
  }

  set tone(value: RgTimelineTone) {
    this.setString('tone', timelineTones.has(value) ? value : 'brand');
  }

  protected onConnect(signal: AbortSignal): void {
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.update(), signal);
    });
  }

  protected update(): void {
    const defaultSlot = this.query<HTMLSlotElement>('slot:not([name])');
    const descriptionSlot = this.query<HTMLSlotElement>('slot[name="description"]');
    const timeSlot = this.query<HTMLSlotElement>('slot[name="time"]');
    const hasHeading = this.#hasContent(defaultSlot) || Boolean(this.heading);
    const hasDescription = this.#hasContent(descriptionSlot) || Boolean(this.description);
    const hasTime = this.#hasContent(timeSlot) || Boolean(this.timestamp || this.dateTime);

    this.query<HTMLElement>('[data-heading]').textContent = this.#hasContent(defaultSlot)
      ? ''
      : this.heading;
    this.query<HTMLElement>('[data-description]').textContent = this.#hasContent(descriptionSlot)
      ? ''
      : this.description;
    this.query<HTMLElement>('[data-timestamp]').textContent = this.#hasContent(timeSlot)
      ? ''
      : this.timestamp || this.dateTime;

    this.query<HTMLElement>('.title').hidden = !hasHeading;
    this.query<HTMLElement>('.description').hidden = !hasDescription;
    const time = this.query<HTMLTimeElement>('time');
    time.hidden = !hasTime;
    if (this.dateTime) time.setAttribute('datetime', this.dateTime);
    else time.removeAttribute('datetime');
  }

  syncPresentation(isLast: boolean): void {
    this.mount();
    this.setAttribute('role', 'listitem');
    this.toggleAttribute('data-last', isLast);
    this.update();
  }

  #hasContent(slot: HTMLSlotElement): boolean {
    return slot.assignedNodes({ flatten: true }).some((node) => {
      return node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim());
    });
  }
}

export class RgTimelineElement extends ReglowElement {
  static readonly tagName = 'rg-timeline' as const;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = ['label'] as const;
  static readonly template = `
    <ol part="base list" role="list"><slot></slot></ol>
  `;
  static readonly styles = `
    :host { display: block; min-width: 0; }
    ol { min-width: 0; margin: 0; padding: 0; list-style: none; }
  `;

  get label(): string {
    return this.getString('label', 'Timeline');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  protected onConnect(signal: AbortSignal): void {
    this.listen(this.query<HTMLSlotElement>('slot'), 'slotchange', () => this.update(), signal);
  }

  protected update(): void {
    const list = this.shadowRoot?.querySelector<HTMLOListElement>('ol');
    if (!list) return;
    list.setAttribute('aria-label', this.label);

    const items = Array.from(this.children).filter(
      (child): child is RgTimelineItemElement => child.localName === 'rg-timeline-item',
    );
    items.forEach((item, index) => item.syncPresentation(index === items.length - 1));
  }
}
