import { ReglowElement } from '../core/reglow-element.js';

export type PaginationChangeReason = 'page' | 'previous' | 'next' | 'api';

export interface PaginationPageChangeDetail {
  readonly page: number;
  readonly previousPage: number;
  readonly reason: PaginationChangeReason;
}

type PaginationToken = number | 'ellipsis';

interface PaginationLayout {
  readonly boundaryStart: readonly number[];
  readonly gapStart: PaginationToken | null;
  readonly window: readonly number[];
  readonly gapEnd: PaginationToken | null;
  readonly boundaryEnd: readonly number[];
}

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
}

function pageLayout(
  page: number,
  pageCount: number,
  siblingCount: number,
  boundaryCount: number,
): PaginationLayout {
  const visibleBudget = boundaryCount * 2 + siblingCount * 2 + 3;
  const boundaryStartEnd = Math.min(boundaryCount, pageCount);
  const boundaryEndStart = Math.max(boundaryStartEnd + 1, pageCount - boundaryCount + 1);

  if (pageCount <= visibleBudget) {
    return {
      boundaryStart: range(1, boundaryStartEnd),
      gapStart: null,
      window: range(boundaryStartEnd + 1, boundaryEndStart - 1),
      gapEnd: null,
      boundaryEnd: range(boundaryEndStart, pageCount),
    };
  }

  const windowSize = siblingCount * 2 + 1;
  const firstWindowPage = boundaryCount + 2;
  const lastWindowPage = pageCount - boundaryCount - 1;
  const latestWindowStart = lastWindowPage - windowSize + 1;
  const windowStart = Math.min(latestWindowStart, Math.max(firstWindowPage, page - siblingCount));
  const windowEnd = windowStart + windowSize - 1;

  return {
    boundaryStart: range(1, boundaryCount),
    gapStart: windowStart === firstWindowPage ? boundaryCount + 1 : 'ellipsis',
    window: range(windowStart, windowEnd),
    gapEnd: windowEnd === lastWindowPage ? pageCount - boundaryCount : 'ellipsis',
    boundaryEnd: range(pageCount - boundaryCount + 1, pageCount),
  };
}

export class RgPaginationElement extends ReglowElement {
  static readonly tagName = 'rg-pagination' as const;
  static readonly observedAttributes = [
    'boundary-count',
    'disabled',
    'label',
    'next-label',
    'page',
    'page-count',
    'previous-label',
    'sibling-count',
  ] as const;
  static readonly template = String.raw`
    <nav class="pagination" part="base nav">
      <button class="direction" part="button previous" type="button" data-action="previous">
        <span aria-hidden="true">‹</span><span class="direction-label" data-previous-label></span>
      </button>
      <span class="pages-frame" part="pages">
        <span class="pages-boundary pages-boundary-start"></span>
        <span class="page-gap page-gap-start"></span>
        <span class="pages-viewport"><span class="pages-window"></span></span>
        <span class="page-gap page-gap-end"></span>
        <span class="pages-boundary pages-boundary-end"></span>
      </span>
      <button class="direction" part="button next" type="button" data-action="next">
        <span class="direction-label" data-next-label></span><span aria-hidden="true">›</span>
      </button>
    </nav>
  `;
  static readonly styles = String.raw`
    :host { display: block; }
    .pagination,
    .pages-frame,
    .pages-boundary,
    .pages-window {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .pages-frame {
      --_rg-pagination-page-size: var(--rg-pagination-page-size, 2.5rem);
      flex: none;
    }
    .pages-boundary:empty,
    .page-gap:empty,
    .pages-viewport[hidden] { display: none; }
    .page-gap {
      display: inline-grid;
      inline-size: var(--_rg-pagination-page-size);
      min-inline-size: var(--_rg-pagination-page-size);
      min-height: 2.25rem;
      place-items: center;
    }
    .pages-viewport {
      --_rg-pagination-enter-x: calc(var(--_rg-pagination-page-size) + 0.3rem);
      --_rg-pagination-leave-x: calc(0rem - var(--_rg-pagination-page-size) - 0.3rem);
      display: grid;
      padding: 0.22rem;
      overflow: hidden;
      margin: -0.22rem;
    }
    .pages-viewport[data-direction='backward'] {
      --_rg-pagination-enter-x: calc(0rem - var(--_rg-pagination-page-size) - 0.3rem);
      --_rg-pagination-leave-x: calc(var(--_rg-pagination-page-size) + 0.3rem);
    }
    :host(:dir(rtl)) .pages-viewport[data-direction='forward'] {
      --_rg-pagination-enter-x: calc(0rem - var(--_rg-pagination-page-size) - 0.3rem);
      --_rg-pagination-leave-x: calc(var(--_rg-pagination-page-size) + 0.3rem);
    }
    :host(:dir(rtl)) .pages-viewport[data-direction='backward'] {
      --_rg-pagination-enter-x: calc(var(--_rg-pagination-page-size) + 0.3rem);
      --_rg-pagination-leave-x: calc(0rem - var(--_rg-pagination-page-size) - 0.3rem);
    }
    .pages-window { grid-area: 1 / 1; }
    .pages-window-outgoing { pointer-events: none; }
    .pages-window.is-entering-forward,
    .pages-window.is-entering-backward {
      animation: rg-pagination-window-enter var(--_rg-slow) var(--_rg-spring) both;
    }
    .pages-window-outgoing.is-leaving-forward,
    .pages-window-outgoing.is-leaving-backward {
      animation: rg-pagination-window-leave var(--_rg-slow) var(--_rg-ease) both;
    }
    .pages-window.is-entering-forward button[aria-current='page'],
    .pages-window.is-entering-backward button[aria-current='page'] {
      animation: rg-pagination-current-in var(--_rg-expressive) var(--_rg-spring) both;
    }
    .page-gap.is-revealing > * {
      animation: rg-pagination-gap-reveal var(--_rg-expressive) var(--_rg-spring) both;
    }
    .page-gap.is-condensing > * {
      animation: rg-pagination-gap-condense var(--_rg-base) var(--_rg-ease) both;
    }
    button {
      display: inline-grid;
      min-width: 2.25rem;
      min-height: 2.25rem;
      padding: 0.4rem 0.65rem;
      place-items: center;
      border: 1px solid transparent;
      border-radius: var(--rg-radius-sm, 0.7rem);
      color: var(--_rg-text-muted);
      background: transparent;
      font-weight: 700;
      cursor: pointer;
      transition: color var(--_rg-fast) var(--_rg-ease), background var(--_rg-fast) var(--_rg-ease),
        border-color var(--_rg-fast) var(--_rg-ease), transform var(--_rg-base) var(--_rg-spring);
    }
    .pages-frame button {
      inline-size: var(--_rg-pagination-page-size);
      min-inline-size: var(--_rg-pagination-page-size);
      padding-inline: 0.25rem;
    }
    button:hover:not(:disabled) { color: var(--_rg-text); background: var(--_rg-canvas-subtle); }
    button:active:not(:disabled) {
      transform: scale(0.92);
      transition-duration: var(--_rg-fast);
      transition-timing-function: var(--_rg-ease);
    }
    button:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
    button[aria-current='page'] {
      border-color: color-mix(in srgb, var(--_rg-brand) 32%, var(--_rg-border));
      color: var(--_rg-brand-text);
      background: var(--_rg-brand-soft);
      box-shadow: var(--_rg-shadow-xs);
    }
    button:disabled { opacity: 0.42; cursor: not-allowed; }
    .direction { display: inline-flex; gap: 0.35rem; }
    .ellipsis { display: inline-grid; min-width: 1.6rem; place-items: center; color: var(--_rg-text-subtle); }
    @keyframes rg-pagination-window-enter {
      from { opacity: 0.18; transform: translateX(var(--_rg-pagination-enter-x)); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes rg-pagination-window-leave {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(var(--_rg-pagination-leave-x)); }
    }
    @keyframes rg-pagination-current-in {
      0%, 35% { transform: scale(0.88); }
      100% { transform: scale(1); }
    }
    @keyframes rg-pagination-gap-reveal {
      from { opacity: 0.2; transform: scale(0.72); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes rg-pagination-gap-condense {
      from { opacity: 0.35; transform: scale(0.82); }
      to { opacity: 1; transform: scale(1); }
    }
    @media (max-width: 36rem) { .direction-label { display: none; } }
  `;

  #renderedPage: number | null = null;
  #renderedWindow = '';
  #renderedGapStart: PaginationToken | null = null;
  #renderedGapEnd: PaginationToken | null = null;
  #focusPageAfterRender = false;

  get page(): number {
    return Math.min(this.pageCount, Math.max(1, Math.trunc(this.getNumber('page', 1))));
  }

  set page(value: number) {
    this.setNumber('page', Math.trunc(value));
  }

  get pageCount(): number {
    return Math.max(1, Math.trunc(this.getNumber('page-count', 1)));
  }

  set pageCount(value: number) {
    this.setNumber('page-count', Math.max(1, Math.trunc(value)));
  }

  get siblingCount(): number {
    return Math.max(0, Math.trunc(this.getNumber('sibling-count', 1)));
  }

  set siblingCount(value: number) {
    if (!Number.isFinite(value)) {
      this.removeAttribute('sibling-count');
      return;
    }
    this.setNumber('sibling-count', Math.max(0, Math.trunc(value)));
  }

  get boundaryCount(): number {
    return Math.max(1, Math.trunc(this.getNumber('boundary-count', 1)));
  }

  set boundaryCount(value: number) {
    this.setNumber('boundary-count', Math.max(1, Math.trunc(value)));
  }

  get disabled(): boolean {
    return this.getBoolean('disabled');
  }

  set disabled(value: boolean) {
    this.setBoolean('disabled', value);
  }

  get label(): string {
    return this.getString('label', 'Pagination');
  }

  set label(value: string) {
    this.setString('label', value);
  }

  get previousLabel(): string {
    return this.getString('previous-label', 'Previous');
  }

  set previousLabel(value: string) {
    this.setString('previous-label', value);
  }

  get nextLabel(): string {
    return this.getString('next-label', 'Next');
  }

  set nextLabel(value: string) {
    this.setString('next-label', value);
  }

  protected onConnect(signal: AbortSignal): void {
    this.listen(this.shadowRoot!, 'click', (event) => this.#onClick(event as MouseEvent), signal);
    const pages = this.query<HTMLElement>('.pages-window');
    const finishAnimation = (event: Event) => {
      if (event.target === pages) this.#finishPageAnimation();
    };
    this.listen(pages, 'animationend', finishAnimation, signal);
    this.listen(pages, 'animationcancel', finishAnimation, signal);
  }

  protected update(): void {
    if (this.getNumber('page', 1) !== this.page) this.setNumber('page', this.page);
    const nav = this.query<HTMLElement>('nav');
    const previous = this.query<HTMLButtonElement>('[data-action="previous"]');
    const next = this.query<HTMLButtonElement>('[data-action="next"]');
    nav.setAttribute('aria-label', this.label);
    previous.disabled = this.disabled || this.page <= 1;
    next.disabled = this.disabled || this.page >= this.pageCount;
    previous.setAttribute('aria-label', this.previousLabel);
    next.setAttribute('aria-label', this.nextLabel);
    this.query<HTMLElement>('[data-previous-label]').textContent = this.previousLabel;
    this.query<HTMLElement>('[data-next-label]').textContent = this.nextLabel;

    const layout = pageLayout(this.page, this.pageCount, this.siblingCount, this.boundaryCount);
    const pages = this.query<HTMLElement>('.pages-window');
    const viewport = this.query<HTMLElement>('.pages-viewport');
    const previousRenderedPage = this.#renderedPage;
    const renderedWindow = layout.window.join(',');
    const direction =
      previousRenderedPage === null ||
      previousRenderedPage === this.page ||
      this.#renderedWindow === renderedWindow
        ? null
        : this.page > previousRenderedPage
          ? 'forward'
          : 'backward';
    this.#finishPageAnimation();

    let outgoing: HTMLElement | null = null;
    if (direction && pages.childElementCount > 0) {
      outgoing = pages.cloneNode(true) as HTMLElement;
      outgoing.className = 'pages-window pages-window-outgoing';
      outgoing.setAttribute('aria-hidden', 'true');
      outgoing.setAttribute('inert', '');
      outgoing.querySelectorAll<HTMLElement>('button').forEach((button) => {
        button.tabIndex = -1;
      });
    }

    this.#renderPages(this.query<HTMLElement>('.pages-boundary-start'), layout.boundaryStart);
    this.#renderGap(
      this.query<HTMLElement>('.page-gap-start'),
      layout.gapStart,
      this.#renderedGapStart,
    );
    this.#renderPages(pages, layout.window);
    this.#renderGap(this.query<HTMLElement>('.page-gap-end'), layout.gapEnd, this.#renderedGapEnd);
    this.#renderPages(this.query<HTMLElement>('.pages-boundary-end'), layout.boundaryEnd);
    viewport.hidden = layout.window.length === 0;
    if (outgoing && direction) {
      viewport.hidden = false;
      viewport.dataset['direction'] = direction;
      viewport.append(outgoing);
      void viewport.offsetWidth;
      pages.classList.add(`is-entering-${direction}`);
      outgoing.classList.add(`is-leaving-${direction}`);
    }
    this.#renderedPage = this.page;
    this.#renderedWindow = renderedWindow;
    this.#renderedGapStart = layout.gapStart;
    this.#renderedGapEnd = layout.gapEnd;

    if (this.#focusPageAfterRender) {
      this.query<HTMLElement>('.pages-frame')
        .querySelector<HTMLButtonElement>('[aria-current="page"]')
        ?.focus();
      this.#focusPageAfterRender = false;
    }
  }

  goTo(page: number, reason: PaginationChangeReason = 'api'): boolean {
    const nextPage = Math.min(this.pageCount, Math.max(1, Math.trunc(page)));
    const previousPage = this.page;
    if (this.disabled || nextPage === previousPage) return false;
    const accepted = this.emit<PaginationPageChangeDetail>(
      'rg-page-change',
      { page: nextPage, previousPage, reason },
      { cancelable: true },
    );
    if (!accepted) return false;
    this.#focusPageAfterRender = Boolean(this.shadowRoot?.activeElement?.matches('[data-page]'));
    this.page = nextPage;
    return true;
  }

  #finishPageAnimation(): void {
    const pages = this.shadowRoot?.querySelector<HTMLElement>('.pages-window');
    const viewport = this.shadowRoot?.querySelector<HTMLElement>('.pages-viewport');
    pages?.classList.remove('is-entering-forward', 'is-entering-backward');
    viewport?.querySelector('.pages-window-outgoing')?.remove();
    if (viewport) delete viewport.dataset['direction'];
  }

  #renderPages(container: HTMLElement, pages: readonly number[]): void {
    container.replaceChildren(...pages.map((page) => this.#createPageButton(page)));
  }

  #renderGap(
    container: HTMLElement,
    token: PaginationToken | null,
    previousToken: PaginationToken | null,
  ): void {
    container.classList.remove('is-revealing', 'is-condensing');
    if (token === null) {
      container.replaceChildren();
      return;
    }

    if (token === 'ellipsis') {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'ellipsis';
      ellipsis.textContent = '…';
      ellipsis.setAttribute('aria-hidden', 'true');
      container.replaceChildren(ellipsis);
    } else {
      container.replaceChildren(this.#createPageButton(token));
    }

    if (previousToken === 'ellipsis' && typeof token === 'number') {
      container.classList.add('is-revealing');
    } else if (typeof previousToken === 'number' && token === 'ellipsis') {
      container.classList.add('is-condensing');
    }
  }

  #createPageButton(page: number): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset['page'] = String(page);
    button.textContent = String(page);
    button.disabled = this.disabled;
    button.setAttribute('aria-label', `Page ${page}`);
    button.setAttribute('part', 'button page');
    if (page === this.page) button.setAttribute('aria-current', 'page');
    return button;
  }

  #onClick(event: MouseEvent): void {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('button');
    if (!button || button.disabled) return;
    if (button.dataset['action'] === 'previous') this.goTo(this.page - 1, 'previous');
    else if (button.dataset['action'] === 'next') this.goTo(this.page + 1, 'next');
    else if (button.dataset['page']) this.goTo(Number(button.dataset['page']), 'page');
  }
}
