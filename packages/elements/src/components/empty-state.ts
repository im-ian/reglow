import { ReglowElement } from '../core/reglow-element.js';

function hasAssignedContent(slot: HTMLSlotElement): boolean {
  return slot.assignedNodes({ flatten: true }).some((node) => {
    return node.nodeType !== Node.TEXT_NODE || Boolean(node.textContent?.trim());
  });
}

export type RgEmptyStateSize = 'sm' | 'md' | 'lg';
export type RgEmptyStateTone = 'neutral' | 'brand';

export class RgEmptyStateElement extends ReglowElement {
  static readonly tagName = 'rg-empty-state' as const;
  static readonly observedAttributes = ['description', 'size', 'title', 'tone'] as const;
  static readonly delegatesFocus = false;
  static readonly template = String.raw`
    <section class="empty" part="base" role="region">
      <div class="icon" part="icon"><slot name="icon"></slot></div>
      <div class="copy" part="copy">
        <h2 part="title" data-title><slot name="title"><span data-title-text></span></slot></h2>
        <div class="description" part="description">
          <slot><span data-description></span></slot>
        </div>
      </div>
      <div class="actions" part="actions"><slot name="actions"></slot></div>
    </section>
  `;
  static readonly styles = String.raw`
    :host { display: block; }
    .empty {
      display: grid;
      min-height: 14rem;
      padding: 2rem;
      place-items: center;
      align-content: center;
      gap: 1rem;
      border: 1px dashed var(--_rg-border-strong);
      border-radius: var(--rg-radius-xl, 1.5rem);
      text-align: center;
      background: color-mix(in srgb, var(--_rg-canvas-subtle) 66%, transparent);
    }
    .icon {
      display: grid;
      width: 3.75rem;
      height: 3.75rem;
      place-items: center;
      border-radius: 1.2rem;
      color: var(--_rg-text-muted);
      background: var(--_rg-surface);
      box-shadow: var(--_rg-shadow-sm);
    }
    :host([tone='brand']) .icon { color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
    .copy { display: grid; max-width: 32rem; gap: 0.4rem; }
    h2 { margin: 0; color: var(--_rg-text); font-size: 1.15rem; letter-spacing: -0.025em; }
    .description { color: var(--_rg-text-muted); font-size: 0.9rem; }
    .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem; }
    :host([size='sm']) .empty { min-height: 10rem; padding: 1.35rem; }
    :host([size='sm']) .icon { width: 3rem; height: 3rem; }
    :host([size='lg']) .empty { min-height: 18rem; padding: 3rem; }
    ::slotted([slot='icon']) { width: 1.75rem; height: 1.75rem; }
  `;

  #titleId = '';

  get title(): string {
    return this.getString('title');
  }

  set title(value: string) {
    this.setString('title', value);
  }

  get description(): string {
    return this.getString('description');
  }

  set description(value: string) {
    this.setString('description', value);
  }

  get size(): RgEmptyStateSize {
    const value = this.getString('size', 'md');
    return value === 'sm' || value === 'lg' ? value : 'md';
  }

  set size(value: RgEmptyStateSize) {
    this.setString('size', value === 'md' ? null : value);
  }

  get tone(): RgEmptyStateTone {
    return this.getString('tone') === 'brand' ? 'brand' : 'neutral';
  }

  set tone(value: RgEmptyStateTone) {
    this.setString('tone', value === 'neutral' ? null : value);
  }

  protected onMount(): void {
    this.#titleId = this.createId('rg-empty-state-title');
    this.query<HTMLElement>('[data-title]').id = this.#titleId;
  }

  protected onConnect(signal: AbortSignal): void {
    this.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot').forEach((slot) => {
      this.listen(slot, 'slotchange', () => this.update(), signal);
    });
  }

  protected update(): void {
    const titleSlot = this.query<HTMLSlotElement>('slot[name="title"]');
    const iconSlot = this.query<HTMLSlotElement>('slot[name="icon"]');
    const actionsSlot = this.query<HTMLSlotElement>('slot[name="actions"]');
    const defaultSlot = this.query<HTMLSlotElement>('slot:not([name])');
    const hasTitle = Boolean(this.title) || hasAssignedContent(titleSlot);
    const hasDescription = Boolean(this.description) || hasAssignedContent(defaultSlot);
    this.query<HTMLElement>('[data-title-text]').textContent = this.title;
    this.query<HTMLElement>('[data-description]').textContent = this.description;
    this.query<HTMLElement>('h2').hidden = !hasTitle;
    this.query<HTMLElement>('.description').hidden = !hasDescription;
    this.query<HTMLElement>('.icon').hidden = !hasAssignedContent(iconSlot);
    this.query<HTMLElement>('.actions').hidden = !hasAssignedContent(actionsSlot);
    const region = this.query<HTMLElement>('[role="region"]');
    if (hasTitle) region.setAttribute('aria-labelledby', this.#titleId);
    else region.removeAttribute('aria-labelledby');
  }
}
