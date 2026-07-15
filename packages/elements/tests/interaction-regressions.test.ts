import { fireEvent } from '@testing-library/dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  RgAccordionElement,
  RgAccordionItemElement,
  RgDialogElement,
  RgTabElement,
  RgTabPanelElement,
  RgTabsElement,
} from '../src/index.js';
import '../src/register.js';

const settleMutations = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

afterEach(() => {
  document.body.replaceChildren();
});

describe('dynamic interaction regressions', () => {
  it('keeps a separate roving tab stop in manual activation mode', () => {
    const tabs = document.createElement('rg-tabs') as RgTabsElement;
    tabs.activation = 'manual';
    tabs.value = 'one';
    tabs.innerHTML = `
      <rg-tab value="one">One</rg-tab>
      <rg-tab value="two">Two</rg-tab>
      <rg-tab-panel value="one">First</rg-tab-panel>
      <rg-tab-panel value="two">Second</rg-tab-panel>
    `;
    document.body.append(tabs);
    const tabElements = Array.from(tabs.querySelectorAll('rg-tab')) as RgTabElement[];

    tabElements[0]!.focus();
    fireEvent.keyDown(tabElements[0]!, { key: 'ArrowRight' });

    expect(tabs.value).toBe('one');
    expect(document.activeElement).toBe(tabElements[1]);
    expect(tabElements.map((tab) => tab.tabIndex)).toEqual([-1, 0]);
  });

  it('aligns the shared tab indicator to the selected tab inside its border', async () => {
    const tabs = document.createElement('rg-tabs') as RgTabsElement;
    tabs.value = 'two';
    tabs.innerHTML = `
      <rg-tab value="one">One</rg-tab>
      <rg-tab value="two">Two</rg-tab>
      <rg-tab-panel value="one">First</rg-tab-panel>
      <rg-tab-panel value="two">Second</rg-tab-panel>
    `;
    document.body.append(tabs);
    const tablist = tabs.shadowRoot!.querySelector<HTMLElement>('.tablist')!;
    const indicator = tabs.shadowRoot!.querySelector<HTMLElement>('.indicator')!;
    const tabElements = Array.from(tabs.querySelectorAll('rg-tab')) as RgTabElement[];
    const tabStyles = tabElements[1]!.shadowRoot!.querySelector('style')!.textContent!;
    Object.defineProperties(tablist, {
      clientLeft: { configurable: true, value: 1 },
      clientTop: { configurable: true, value: 1 },
    });
    vi.spyOn(tablist, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      top: 20,
    } as DOMRect);
    vi.spyOn(tabElements[0]!, 'getBoundingClientRect').mockReturnValue({
      left: 14,
      top: 24,
      width: 100,
      height: 36,
    } as DOMRect);
    vi.spyOn(tabElements[1]!, 'getBoundingClientRect').mockReturnValue({
      left: 118,
      top: 24,
      width: 100,
      height: 36,
    } as DOMRect);
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    expect(indicator.style.width).toBe('100px');
    expect(indicator.style.height).toBe('36px');
    expect(indicator.style.transform).toBe('translate(107px, 3px)');
    expect(tabStyles).toContain(':host(:hover:not([selected]):not([disabled])) .tab');
  });

  it('moves selection when the selected tab becomes disabled', async () => {
    const tabs = document.createElement('rg-tabs') as RgTabsElement;
    tabs.value = 'one';
    tabs.innerHTML = `
      <rg-tab value="one">One</rg-tab>
      <rg-tab value="two">Two</rg-tab>
      <rg-tab-panel value="one">First</rg-tab-panel>
      <rg-tab-panel value="two">Second</rg-tab-panel>
    `;
    document.body.append(tabs);
    const tabElements = Array.from(tabs.querySelectorAll('rg-tab')) as RgTabElement[];
    const panels = Array.from(tabs.querySelectorAll('rg-tab-panel')) as RgTabPanelElement[];

    tabElements[0]!.disabled = true;
    await settleMutations();

    expect(tabs.value).toBe('two');
    expect(tabElements.map((tab) => [tab.selected, tab.tabIndex])).toEqual([
      [false, -1],
      [true, 0],
    ]);
    expect(panels.map((panel) => panel.active)).toEqual([false, true]);
  });

  it('renormalizes a single accordion after a programmatic open', async () => {
    const accordion = document.createElement('rg-accordion') as RgAccordionElement;
    accordion.innerHTML = `
      <rg-accordion-item value="one" open><span slot="heading">One</span>First</rg-accordion-item>
      <rg-accordion-item value="two"><span slot="heading">Two</span>Second</rg-accordion-item>
    `;
    document.body.append(accordion);
    const items = Array.from(
      accordion.querySelectorAll('rg-accordion-item'),
    ) as RgAccordionItemElement[];

    items[1]!.open = true;
    await settleMutations();

    expect(accordion.value).toBe('two');
    expect(items.map((item) => item.open)).toEqual([false, true]);
  });

  it('restarts the accordion entrance animation every time an item opens', () => {
    const item = document.createElement('rg-accordion-item') as RgAccordionItemElement;
    item.innerHTML = '<span slot="heading">Motion</span>Animated content';
    document.body.append(item);
    const summary = item.shadowRoot!.querySelector<HTMLElement>('summary')!;
    const panel = item.shadowRoot!.querySelector<HTMLElement>('.panel')!;
    const content = item.shadowRoot!.querySelector<HTMLElement>('.content')!;

    summary.click();
    expect(item.open).toBe(true);
    expect(panel.classList.contains('is-opening')).toBe(true);

    fireEvent.animationEnd(content);
    expect(panel.classList.contains('is-opening')).toBe(true);

    fireEvent.animationEnd(panel);
    expect(panel.classList.contains('is-opening')).toBe(false);

    summary.click();
    summary.click();
    expect(item.open).toBe(true);
    expect(panel.classList.contains('is-opening')).toBe(true);
  });

  it('animates the accordion layout track instead of reserving full-height blank space', () => {
    const styles = RgAccordionItemElement.styles;

    expect(styles).toMatch(
      /\.panel\s*\{[^}]*display:\s*grid;[^}]*grid-template-rows:\s*1fr;[^}]*overflow:\s*hidden;/s,
    );
    expect(styles).toMatch(/\.content\s*\{[^}]*min-height:\s*0;/s);
    expect(styles).toMatch(
      /@keyframes rg-accordion-panel-open\s*\{[\s\S]*?from\s*\{[^}]*grid-template-rows:\s*0fr;[\s\S]*?to\s*\{[^}]*grid-template-rows:\s*1fr;/,
    );
    expect(styles).toMatch(
      /@keyframes rg-accordion-panel-close\s*\{[\s\S]*?from\s*\{[^}]*grid-template-rows:\s*1fr;[\s\S]*?to\s*\{[^}]*grid-template-rows:\s*0fr;/,
    );
  });

  it('enters the opening layout state before revealing native details content', () => {
    const item = document.createElement('rg-accordion-item') as RgAccordionItemElement;
    item.innerHTML = '<span slot="heading">Motion</span>Animated content';
    document.body.append(item);
    const details = item.shadowRoot!.querySelector<HTMLDetailsElement>('details')!;
    const panel = item.shadowRoot!.querySelector<HTMLElement>('.panel')!;
    let nativeOpen = false;
    let openingStateWhenRevealed = false;
    Object.defineProperty(details, 'open', {
      configurable: true,
      get: () => nativeOpen,
      set: (open: boolean) => {
        nativeOpen = open;
        if (open) openingStateWhenRevealed = panel.classList.contains('is-opening');
      },
    });

    item.open = true;

    expect(openingStateWhenRevealed).toBe(true);
  });

  it('keeps native accordion content visible until the closing animation finishes', () => {
    const item = document.createElement('rg-accordion-item') as RgAccordionItemElement;
    item.open = true;
    item.innerHTML = '<span slot="heading">Motion</span>Animated content';
    document.body.append(item);
    const summary = item.shadowRoot!.querySelector<HTMLElement>('summary')!;
    const details = item.shadowRoot!.querySelector<HTMLDetailsElement>('details')!;
    const panel = item.shadowRoot!.querySelector<HTMLElement>('.panel')!;

    summary.click();
    expect(item.open).toBe(false);
    expect(details.open).toBe(true);
    expect(panel.classList.contains('is-closing')).toBe(true);

    fireEvent.animationEnd(panel);
    expect(details.open).toBe(false);
    expect(panel.classList.contains('is-closing')).toBe(false);
  });

  it('does not force synchronous layout while accordion motion changes direction', () => {
    const item = document.createElement('rg-accordion-item') as RgAccordionItemElement;
    item.innerHTML = '<span slot="heading">Motion</span>Animated content';
    document.body.append(item);
    const summary = item.shadowRoot!.querySelector<HTMLElement>('summary')!;
    const panel = item.shadowRoot!.querySelector<HTMLElement>('.panel')!;
    const layoutRead = vi.fn(() => 240);
    Object.defineProperty(panel, 'offsetWidth', {
      configurable: true,
      get: layoutRead,
    });

    summary.click();
    summary.click();
    summary.click();

    expect(item.open).toBe(true);
    expect(panel.classList.contains('is-opening')).toBe(true);
    expect(layoutRead).not.toHaveBeenCalled();
  });

  it('only closes the nearest dialog for nested declarative controls', () => {
    const outer = document.createElement('rg-dialog') as RgDialogElement;
    const inner = document.createElement('rg-dialog') as RgDialogElement;
    const closeInner = document.createElement('button');
    closeInner.setAttribute('data-rg-close', '');
    closeInner.textContent = 'Close inner';
    inner.append(closeInner);
    outer.append(inner);
    document.body.append(outer);

    outer.showModal();
    inner.showModal();
    closeInner.click();

    expect(inner.open).toBe(false);
    expect(outer.open).toBe(true);
  });
});
