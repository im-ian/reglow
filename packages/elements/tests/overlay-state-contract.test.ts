import { fireEvent } from '@testing-library/dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  RgDialogElement,
  RgDrawerElement,
  RgMenuElement,
  RgPopoverElement,
  RgToastElement,
  RgTooltipElement,
} from '../src/index.js';
import '../src/register.js';

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe('overlay interaction state contract', () => {
  it('declares preventable open interaction state on every overlay primitive', () => {
    const constructors = [
      RgDialogElement,
      RgDrawerElement,
      RgPopoverElement,
      RgMenuElement,
      RgTooltipElement,
      RgToastElement,
    ];

    constructors.forEach((constructor) => {
      expect(constructor.interactionState).toEqual({
        open: {
          events: ['rg-before-open', 'rg-before-close'],
          strategy: 'prevent',
        },
      });
    });
  });

  it('keeps dialog native state unchanged when close is canceled', () => {
    const dialog = document.createElement('rg-dialog') as RgDialogElement;
    dialog.innerHTML = '<button slot="trigger">Open</button><button data-inside>Inside</button>';
    document.body.append(dialog);
    dialog.open = true;
    const nativeDialog = dialog.shadowRoot!.querySelector('dialog')!;
    const inside = dialog.querySelector<HTMLButtonElement>('[data-inside]')!;
    inside.focus();
    const order: string[] = [];
    let cancelClose = true;
    const preventClose = (event: Event) => {
      const customEvent = event as CustomEvent<{ open: boolean; returnValue: string }>;
      order.push(`before:${String(dialog.open)}:${String(customEvent.detail.open)}`);
      expect(event.cancelable).toBe(true);
      if (cancelClose) event.preventDefault();
    };
    dialog.addEventListener('rg-before-close', preventClose);
    dialog.addEventListener('rg-open-change', (event) => {
      const customEvent = event as CustomEvent<{ open: boolean }>;
      order.push(`change:${String(dialog.open)}:${String(customEvent.detail.open)}`);
      expect(event.cancelable).toBe(false);
    });
    dialog.addEventListener('rg-close', () => order.push('close'));

    dialog.close('cancelled');

    expect(dialog.open).toBe(true);
    expect(nativeDialog.open).toBe(true);
    expect(document.activeElement).toBe(inside);
    expect(order).toEqual(['before:true:false']);

    cancelClose = false;
    dialog.close('accepted');

    expect(dialog.open).toBe(false);
    expect(nativeDialog.open).toBe(false);
    expect(order).toEqual([
      'before:true:false',
      'before:true:false',
      'change:false:false',
      'close',
    ]);
    expect(dialog.returnValue).toBe('accepted');
  });

  it('ignores a stale native dialog close event after the dialog has reopened', () => {
    const dialog = document.createElement('rg-dialog') as RgDialogElement;
    document.body.append(dialog);
    dialog.open = true;
    const nativeDialog = dialog.shadowRoot!.querySelector('dialog')!;
    const close = vi.fn();
    const openChange = vi.fn();
    dialog.addEventListener('rg-close', close);
    dialog.addEventListener('rg-open-change', openChange);

    nativeDialog.dispatchEvent(new Event('close'));

    expect(nativeDialog.open).toBe(true);
    expect(dialog.open).toBe(true);
    expect(close).not.toHaveBeenCalled();
    expect(openChange).not.toHaveBeenCalled();
  });

  it('does not finish a synchronous native close after an open-change listener reopens', () => {
    const dialog = document.createElement('rg-dialog') as RgDialogElement;
    document.body.append(dialog);
    dialog.open = true;
    const nativeDialog = dialog.shadowRoot!.querySelector('dialog')!;
    const close = vi.fn();
    const openChange = vi.fn((event: Event) => {
      const detail = (event as CustomEvent<{ open: boolean }>).detail;
      if (!detail.open) dialog.open = true;
    });
    dialog.addEventListener('rg-close', close);
    dialog.addEventListener('rg-open-change', openChange);

    dialog.close();

    expect(dialog.open).toBe(true);
    expect(nativeDialog.open).toBe(true);
    expect(openChange).toHaveBeenCalledOnce();
    expect(close).not.toHaveBeenCalled();
  });

  it('does not move popover focus when an escape close is canceled', () => {
    const popover = document.createElement('rg-popover') as RgPopoverElement;
    popover.innerHTML = '<button slot="trigger">Open</button><button>Inside</button>';
    document.body.append(popover);
    const trigger = popover.querySelector<HTMLButtonElement>('[slot="trigger"]')!;
    const panel = popover.shadowRoot!.querySelector<HTMLElement>('.panel')!;
    popover.open = true;
    panel.focus();
    const openChange = vi.fn();
    popover.addEventListener('rg-open-change', openChange);
    popover.addEventListener('rg-before-close', (event) => event.preventDefault());

    fireEvent.keyDown(panel, { key: 'Escape' });

    expect(popover.open).toBe(true);
    expect(panel.hidden).toBe(false);
    expect(popover.shadowRoot!.activeElement).toBe(panel);
    expect(document.activeElement).not.toBe(trigger);
    expect(openChange).not.toHaveBeenCalled();
  });

  it('restores popover focus after a parent-owned escape close commit', async () => {
    const popover = document.createElement('rg-popover') as RgPopoverElement;
    popover.innerHTML = '<button slot="trigger">Open</button><button>Inside</button>';
    document.body.append(popover);
    const trigger = popover.querySelector<HTMLButtonElement>('[slot="trigger"]')!;
    const panel = popover.shadowRoot!.querySelector<HTMLElement>('.panel')!;
    popover.open = true;
    panel.focus();
    popover.addEventListener('rg-before-close', (event) => {
      event.preventDefault();
      popover.open = false;
    });

    fireEvent.keyDown(panel, { key: 'Escape' });
    await Promise.resolve();

    expect(popover.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('does not apply stale popover focus after a close notification reopens it', async () => {
    const popover = document.createElement('rg-popover') as RgPopoverElement;
    popover.innerHTML = '<button slot="trigger">Open</button><button>Inside</button>';
    document.body.append(popover);
    const trigger = popover.querySelector<HTMLButtonElement>('[slot="trigger"]')!;
    const panel = popover.shadowRoot!.querySelector<HTMLElement>('.panel')!;
    popover.open = true;
    panel.focus();
    popover.addEventListener('rg-open-change', (event) => {
      const detail = (event as CustomEvent<{ open: boolean }>).detail;
      if (!detail.open) popover.open = true;
    });

    fireEvent.keyDown(panel, { key: 'Escape' });
    await Promise.resolve();

    expect(popover.open).toBe(true);
    expect(document.activeElement).not.toBe(trigger);
    expect(popover.shadowRoot!.activeElement).toBe(panel);
  });

  it('focuses a menu only after an open commit and retains focus on canceled close', async () => {
    const menu = document.createElement('rg-menu') as RgMenuElement;
    menu.innerHTML = `
      <button slot="trigger">Open</button>
      <rg-menu-item value="one">One</rg-menu-item>
      <rg-menu-item value="two">Two</rg-menu-item>
    `;
    document.body.append(menu);
    const trigger = menu.querySelector<HTMLButtonElement>('[slot="trigger"]')!;
    const firstItem = menu.querySelector<HTMLElement>('rg-menu-item')!;
    const preventOpen = (event: Event) => event.preventDefault();
    menu.addEventListener('rg-before-open', preventOpen);
    trigger.focus();

    trigger.click();

    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(trigger);

    menu.removeEventListener('rg-before-open', preventOpen);
    menu.open = true;
    await Promise.resolve();

    expect(document.activeElement).toBe(firstItem);
    menu.addEventListener('rg-before-close', (event) => event.preventDefault());
    fireEvent.keyDown(firstItem, { key: 'Escape' });

    expect(menu.open).toBe(true);
    expect(document.activeElement).toBe(firstItem);
  });

  it('preserves menu keyboard focus intent across parent-owned commits', async () => {
    const menu = document.createElement('rg-menu') as RgMenuElement;
    menu.innerHTML = `
      <button slot="trigger">Open</button>
      <rg-menu-item value="one">One</rg-menu-item>
      <rg-menu-item value="two">Two</rg-menu-item>
    `;
    document.body.append(menu);
    const trigger = menu.querySelector<HTMLButtonElement>('[slot="trigger"]')!;
    const items = menu.querySelectorAll<HTMLElement>('rg-menu-item');
    menu.addEventListener('rg-before-open', (event) => {
      event.preventDefault();
      menu.open = true;
    });
    trigger.focus();

    fireEvent.keyDown(trigger, { key: 'ArrowUp' });
    await Promise.resolve();

    expect(menu.open).toBe(true);
    expect(document.activeElement).toBe(items[1]);

    menu.addEventListener('rg-before-close', (event) => {
      event.preventDefault();
      menu.open = false;
    });
    fireEvent.keyDown(items[1]!, { key: 'Escape' });
    await Promise.resolve();

    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('does not focus a hidden menu item after an open notification recloses it', async () => {
    const menu = document.createElement('rg-menu') as RgMenuElement;
    menu.innerHTML = `
      <button slot="trigger">Open</button>
      <rg-menu-item value="one">One</rg-menu-item>
    `;
    document.body.append(menu);
    const trigger = menu.querySelector<HTMLButtonElement>('[slot="trigger"]')!;
    menu.addEventListener('rg-open-change', (event) => {
      const detail = (event as CustomEvent<{ open: boolean }>).detail;
      if (detail.open) menu.open = false;
    });
    trigger.focus();

    trigger.click();
    await Promise.resolve();

    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('does not reveal a tooltip when its delayed open request is canceled', () => {
    vi.useFakeTimers();
    const tooltip = document.createElement('rg-tooltip') as RgTooltipElement;
    tooltip.content = 'Details';
    tooltip.delay = 0;
    tooltip.innerHTML = '<button slot="trigger">Info</button>';
    document.body.append(tooltip);
    const trigger = tooltip.querySelector<HTMLButtonElement>('button')!;
    const bubble = tooltip.shadowRoot!.querySelector<HTMLElement>('.bubble')!;
    const openChange = vi.fn();
    tooltip.addEventListener('rg-before-open', (event) => event.preventDefault());
    tooltip.addEventListener('rg-open-change', openChange);

    fireEvent.focusIn(trigger);
    vi.runAllTimers();

    expect(tooltip.open).toBe(false);
    expect(bubble.hidden).toBe(true);
    expect(openChange).not.toHaveBeenCalled();
  });

  it('keeps tooltip rendering in sync with a controlled property commit', () => {
    const tooltip = document.createElement('rg-tooltip') as RgTooltipElement;
    tooltip.content = 'Details';
    tooltip.innerHTML = '<button slot="trigger">Info</button>';
    document.body.append(tooltip);
    const trigger = tooltip.querySelector<HTMLButtonElement>('button')!;
    const bubble = tooltip.shadowRoot!.querySelector<HTMLElement>('.bubble')!;

    tooltip.open = true;

    expect(bubble.hidden).toBe(false);
    tooltip.addEventListener('rg-before-close', (event) => event.preventDefault());
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(tooltip.open).toBe(true);
    expect(bubble.hidden).toBe(false);
  });

  it('separates toast dismissal requests from committed close notifications', () => {
    const toast = document.createElement('rg-toast') as RgToastElement;
    toast.duration = 0;
    toast.dismissible = true;
    toast.open = true;
    document.body.append(toast);
    const order: string[] = [];
    const preventClose = (event: Event) => {
      const customEvent = event as CustomEvent<{ open: boolean }>;
      order.push(`before:${String(toast.open)}:${String(customEvent.detail.open)}`);
      event.preventDefault();
    };
    toast.addEventListener('rg-dismiss', () => order.push('dismiss'));
    toast.addEventListener('rg-before-close', preventClose);
    toast.addEventListener('rg-open-change', (event) => {
      const customEvent = event as CustomEvent<{ open: boolean }>;
      order.push(`change:${String(toast.open)}:${String(customEvent.detail.open)}`);
      expect(event.cancelable).toBe(false);
    });

    expect(toast.dismiss('api')).toBe(false);
    expect(toast.open).toBe(true);
    expect(order).toEqual(['dismiss', 'before:true:false']);

    toast.removeEventListener('rg-before-close', preventClose);
    expect(toast.dismiss('api')).toBe(true);
    expect(toast.open).toBe(false);
    expect(order).toEqual(['dismiss', 'before:true:false', 'dismiss', 'change:false:false']);
  });
});
