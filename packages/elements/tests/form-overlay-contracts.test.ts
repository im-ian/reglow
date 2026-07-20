import { fireEvent } from '@testing-library/dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/register.js';

type OpenElement = HTMLElement & { open: boolean };

interface OverlayCase {
  readonly tag: 'rg-combobox' | 'rg-date-picker' | 'rg-time-picker' | 'rg-date-time-picker';
  readonly trigger: string;
  readonly reason: 'toggle' | 'trigger';
  readonly prepare?: (element: OpenElement) => void;
}

const overlayCases: readonly OverlayCase[] = [
  { tag: 'rg-combobox', trigger: '.toggle', reason: 'toggle' },
  {
    tag: 'rg-date-picker',
    trigger: '.custom-control',
    reason: 'trigger',
    prepare: (element) => element.setAttribute('picker', 'custom'),
  },
  { tag: 'rg-time-picker', trigger: '.picker-control', reason: 'trigger' },
  { tag: 'rg-date-time-picker', trigger: '.picker-control', reason: 'trigger' },
];

afterEach(() => {
  document.body.replaceChildren();
});

describe('form overlay request contracts', () => {
  for (const overlay of overlayCases) {
    it(`${overlay.tag} separates cancelable requests from committed notifications`, () => {
      const element = document.createElement(overlay.tag) as OpenElement;
      overlay.prepare?.(element);
      document.body.append(element);
      const trigger = element.shadowRoot!.querySelector<HTMLButtonElement>(overlay.trigger)!;
      const order: string[] = [];
      const recordBefore = (event: Event) => {
        const detail = (event as CustomEvent<{ open: boolean; reason: string }>).detail;
        order.push(
          `before:${String(element.open)}:${String(detail.open)}:${detail.reason}:${String(event.cancelable)}`,
        );
      };
      const prevent = (event: Event) => event.preventDefault();
      const recordChange = (event: Event) => {
        const detail = (event as CustomEvent<{ open: boolean; reason: string }>).detail;
        order.push(
          `change:${String(element.open)}:${String(detail.open)}:${detail.reason}:${String(event.cancelable)}`,
        );
      };
      element.addEventListener('rg-before-open', recordBefore);
      element.addEventListener('rg-before-open', prevent);
      element.addEventListener('rg-open-change', recordChange);

      trigger.click();
      expect(element.open).toBe(false);

      element.removeEventListener('rg-before-open', prevent);
      trigger.click();
      expect(element.open).toBe(true);

      element.addEventListener('rg-before-close', recordBefore);
      element.addEventListener('rg-before-close', prevent);
      trigger.click();
      expect(element.open).toBe(true);

      element.removeEventListener('rg-before-close', prevent);
      trigger.click();
      expect(element.open).toBe(false);
      expect(order).toEqual([
        `before:false:true:${overlay.reason}:true`,
        `before:false:true:${overlay.reason}:true`,
        `change:true:true:${overlay.reason}:false`,
        `before:true:false:${overlay.reason}:true`,
        `before:true:false:${overlay.reason}:true`,
        `change:false:false:${overlay.reason}:false`,
      ]);
    });
  }

  it('merges controlled open prevention with form value restoration metadata', () => {
    for (const overlay of overlayCases) {
      const constructor = customElements.get(overlay.tag) as CustomElementConstructor & {
        interactionState: Record<string, { events: readonly string[]; strategy: string }>;
      };

      expect(constructor.interactionState).toMatchObject({
        value: { events: ['input', 'change'], strategy: 'restore' },
        open: { events: ['rg-before-open', 'rg-before-close'], strategy: 'prevent' },
      });
    }
  });

  it('preserves combobox arrow navigation across a parent-owned open commit', async () => {
    const element = document.createElement('rg-combobox') as OpenElement & {
      options: readonly { value: string; label: string }[];
    };
    element.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
    ];
    document.body.append(element);
    element.addEventListener('rg-before-open', (event) => {
      event.preventDefault();
      element.open = true;
    });
    const control = element.shadowRoot!.querySelector<HTMLInputElement>('.control')!;

    fireEvent.keyDown(control, { key: 'ArrowUp' });
    await Promise.resolve();

    const active = element.shadowRoot!.querySelector<HTMLElement>('[data-active]')!;
    expect(element.open).toBe(true);
    expect(active.textContent).toBe('Two');
    expect(control.getAttribute('aria-activedescendant')).toBe(active.id);
  });

  it.each([
    ['rg-date-picker', '.custom-control', '2026-07-20', '.calendar-day[tabindex="0"]'],
    ['rg-time-picker', '.picker-control', '15:30', '.period-list [aria-selected="true"]'],
    ['rg-date-time-picker', '.picker-control', '2026-07-20T15:30', '.calendar-day[tabindex="0"]'],
  ] as const)(
    '%s applies opening effects after a parent-owned open commit',
    async (tag, triggerSelector, value, focusedSelector) => {
      const element = document.createElement(tag) as OpenElement & { value: string };
      if (tag === 'rg-date-picker') element.setAttribute('picker', 'custom');
      element.value = value;
      document.body.append(element);
      const beforeOpen = vi.fn();
      const openChange = vi.fn();
      element.addEventListener('rg-before-open', beforeOpen);
      element.addEventListener('rg-open-change', openChange);

      element.open = true;
      await Promise.resolve();

      const root = element.shadowRoot!;
      expect(root.querySelector<HTMLElement>('.picker-panel')!.hidden).toBe(false);
      expect(root.activeElement).toBe(root.querySelector(focusedSelector));
      expect(beforeOpen).not.toHaveBeenCalled();
      expect(openChange).not.toHaveBeenCalled();

      const focused = root.activeElement;
      element.addEventListener('rg-before-close', (event) => event.preventDefault());
      fireEvent.keyDown(element, { key: 'Escape' });

      expect(element.open).toBe(true);
      expect(root.activeElement).toBe(focused);
      expect(root.activeElement).not.toBe(root.querySelector(triggerSelector));
    },
  );

  it.each([
    ['rg-date-picker', '.custom-control', '2026-07-20'],
    ['rg-time-picker', '.picker-control', '15:30'],
    ['rg-date-time-picker', '.picker-control', '2026-07-20T15:30'],
  ] as const)(
    '%s restores trigger focus after a parent-owned close commit',
    async (tag, triggerSelector, value) => {
      const element = document.createElement(tag) as OpenElement & { value: string };
      if (tag === 'rg-date-picker') element.setAttribute('picker', 'custom');
      element.value = value;
      document.body.append(element);
      element.open = true;
      await Promise.resolve();

      const root = element.shadowRoot!;
      const trigger = root.querySelector<HTMLButtonElement>(triggerSelector)!;
      expect(root.activeElement).not.toBe(trigger);

      element.addEventListener('rg-before-close', (event) => {
        event.preventDefault();
        element.open = false;
      });
      fireEvent.keyDown(element, { key: 'Escape' });
      await Promise.resolve();

      expect(element.open).toBe(false);
      expect(root.activeElement).toBe(trigger);
    },
  );

  it.each([
    ['rg-date-picker', '.custom-control', '2026-07-20'],
    ['rg-time-picker', '.picker-control', '15:30'],
    ['rg-date-time-picker', '.picker-control', '2026-07-20T15:30'],
  ] as const)(
    '%s ignores stale close focus after an open-change listener reopens it',
    async (tag, triggerSelector, value) => {
      const element = document.createElement(tag) as OpenElement & { value: string };
      if (tag === 'rg-date-picker') element.setAttribute('picker', 'custom');
      element.value = value;
      document.body.append(element);
      element.open = true;
      await Promise.resolve();

      const root = element.shadowRoot!;
      const trigger = root.querySelector<HTMLButtonElement>(triggerSelector)!;
      element.addEventListener('rg-open-change', (event) => {
        const detail = (event as CustomEvent<{ open: boolean }>).detail;
        if (!detail.open) element.open = true;
      });

      fireEvent.keyDown(element, { key: 'Escape' });

      expect(element.open).toBe(true);
      expect(root.activeElement).not.toBe(trigger);
      await Promise.resolve();
      expect(root.activeElement).not.toBe(trigger);
    },
  );
});
