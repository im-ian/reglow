import { fireEvent } from '@testing-library/dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/register.js';

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});

describe('navigation and grouping components', () => {
  it('exposes breadcrumb navigation and marks only the current item', async () => {
    const breadcrumb = document.createElement('rg-breadcrumb');
    breadcrumb.setAttribute('label', 'Project path');
    breadcrumb.innerHTML = `
      <rg-breadcrumb-item href="/projects">Projects</rg-breadcrumb-item>
      <rg-breadcrumb-item current>Reglow</rg-breadcrumb-item>
    `;
    document.body.append(breadcrumb);
    await Promise.resolve();

    const nav = breadcrumb.shadowRoot!.querySelector('nav')!;
    const items = breadcrumb.querySelectorAll('rg-breadcrumb-item');
    expect(nav.getAttribute('aria-label')).toBe('Project path');
    expect(items[0]!.shadowRoot!.querySelector('a')!.getAttribute('aria-current')).toBeNull();
    expect(items[1]!.shadowRoot!.querySelector('[aria-current="page"]')).not.toBeNull();
  });

  it('changes pages while keeping boundary controls disabled', () => {
    const pagination = document.createElement('rg-pagination') as HTMLElement & {
      page: number;
      pageCount: number;
    };
    pagination.page = 1;
    pagination.pageCount = 8;
    document.body.append(pagination);
    const changed = vi.fn();
    pagination.addEventListener('rg-page-change', changed);

    const previous = pagination.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="previous"]',
    )!;
    const pageTwo = pagination.shadowRoot!.querySelector<HTMLButtonElement>('[data-page="2"]')!;
    expect(previous.disabled).toBe(true);
    pageTwo.click();
    expect(pagination.page).toBe(2);
    expect(changed).toHaveBeenCalledOnce();
    expect((changed.mock.calls[0]![0] as CustomEvent).detail).toMatchObject({
      page: 2,
      previousPage: 1,
    });
  });

  it('cross-slides only the moving page window while boundary pages stay anchored', () => {
    const pagination = document.createElement('rg-pagination') as HTMLElement & {
      page: number;
      pageCount: number;
    };
    pagination.page = 5;
    pagination.pageCount = 12;
    document.body.append(pagination);
    const pages = pagination.shadowRoot!.querySelector<HTMLElement>('.pages-window')!;
    const paginationStyles = pagination.shadowRoot!.querySelector('style')!.textContent!;

    expect(paginationStyles).toContain('inline-size: var(--_rg-pagination-page-size)');

    pagination.shadowRoot!.querySelector<HTMLButtonElement>('[data-page="6"]')!.click();

    const outgoing = pagination.shadowRoot!.querySelector<HTMLElement>('.pages-window-outgoing')!;
    expect(pagination.page).toBe(6);
    expect(pages.classList.contains('is-entering-forward')).toBe(true);
    expect(outgoing.classList.contains('is-leaving-forward')).toBe(true);
    expect(outgoing.querySelector('[data-page="1"]')).toBeNull();
    expect(outgoing.querySelector('[data-page="12"]')).toBeNull();
    expect(
      pagination.shadowRoot!.querySelector('.pages-boundary-start [data-page="1"]'),
    ).not.toBeNull();
    expect(
      pagination.shadowRoot!.querySelector('.pages-boundary-end [data-page="12"]'),
    ).not.toBeNull();
    expect(outgoing.querySelector('[aria-current="page"]')!.textContent).toBe('5');
    expect(pages.querySelector('[aria-current="page"]')!.textContent).toBe('6');

    fireEvent.animationEnd(pages);
    expect(pagination.shadowRoot!.querySelector('.pages-window-outgoing')).toBeNull();
    expect(pages.classList.contains('is-entering-forward')).toBe(false);
  });

  it('releases the trailing ellipsis into the adjacent page without moving the last page', () => {
    const pagination = document.createElement('rg-pagination') as HTMLElement & {
      page: number;
      pageCount: number;
    };
    pagination.page = 8;
    pagination.pageCount = 12;
    document.body.append(pagination);

    const endGap = pagination.shadowRoot!.querySelector<HTMLElement>('.page-gap-end')!;
    expect(endGap.querySelector('.ellipsis')).not.toBeNull();
    expect(
      pagination.shadowRoot!.querySelector('.pages-boundary-end [data-page="12"]'),
    ).not.toBeNull();

    pagination.shadowRoot!.querySelector<HTMLButtonElement>('[data-page="9"]')!.click();

    expect(endGap.classList.contains('is-revealing')).toBe(true);
    expect(endGap.querySelector('[data-page="11"]')).not.toBeNull();
    expect(
      pagination.shadowRoot!.querySelector('.pages-boundary-end [data-page="12"]'),
    ).not.toBeNull();
  });

  it('labels a button group and exposes its orientation', () => {
    const group = document.createElement('rg-button-group');
    group.setAttribute('label', 'Text alignment');
    group.setAttribute('orientation', 'vertical');
    group.innerHTML = '<rg-button>Left</rg-button><rg-button>Right</rg-button>';
    document.body.append(group);

    const control = group.shadowRoot!.querySelector('[role="group"]')!;
    expect(control.getAttribute('aria-label')).toBe('Text alignment');
    expect(control.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('joins attached button outlines with only the group outer corners rounded', () => {
    const group = document.createElement('rg-button-group');
    group.setAttribute('attached', '');
    group.innerHTML =
      '<rg-button variant="outline">Draft</rg-button><rg-button variant="outline">Preview</rg-button><rg-button variant="outline">Publish</rg-button>';
    document.body.append(group);

    const groupStyles = group.shadowRoot!.querySelector('style')!.textContent!;
    const buttonStyles = group
      .querySelector('rg-button')!
      .shadowRoot!.querySelector('style')!.textContent!;

    expect(groupStyles).toContain('--rg-button-border-radius: 0');
    expect(groupStyles).toContain(
      ":host([attached]:not([orientation='vertical'])) ::slotted(:first-child)",
    );
    expect(groupStyles).toContain(
      ":host([attached]:not([orientation='vertical'])) ::slotted(:last-child)",
    );
    expect(groupStyles).toContain(
      ":host([orientation='vertical'][attached]) ::slotted(:first-child)",
    );
    expect(buttonStyles).toMatch(
      /border-start-start-radius:\s*var\(\s*--rg-button-border-start-start-radius/,
    );
    expect(buttonStyles).toMatch(
      /border-end-end-radius:\s*var\(\s*--rg-button-border-end-end-radius/,
    );
  });
});

describe('display and form composition components', () => {
  it('renders keyboard input with an accessible spoken label', () => {
    const keyboard = document.createElement('rg-kbd');
    keyboard.setAttribute('keys', 'Meta+K');
    keyboard.setAttribute('label', 'Command K');
    document.body.append(keyboard);

    expect(keyboard.shadowRoot!.querySelector('[aria-label="Command K"]')).not.toBeNull();
    expect(keyboard.shadowRoot!.querySelectorAll('kbd')).toHaveLength(2);
  });

  it('provides native fieldset semantics and cascades its disabled state', async () => {
    const fieldset = document.createElement('rg-fieldset');
    fieldset.setAttribute('legend', 'Notifications');
    fieldset.setAttribute('description', 'Choose how we contact you.');
    fieldset.setAttribute('disabled', '');
    fieldset.innerHTML = '<rg-checkbox label="Email"></rg-checkbox>';
    document.body.append(fieldset);
    await Promise.resolve();

    const native = fieldset.shadowRoot!.querySelector('fieldset')!;
    const checkbox = fieldset.querySelector('rg-checkbox')!;
    expect(native.disabled).toBe(true);
    expect(native.querySelector('legend')!.textContent).toContain('Notifications');
    expect(checkbox.hasAttribute('disabled')).toBe(true);
  });

  it('hides unused empty-state regions and identifies its title', () => {
    const empty = document.createElement('rg-empty-state');
    empty.setAttribute('title', 'No projects yet');
    empty.setAttribute('description', 'Create a project to get started.');
    document.body.append(empty);

    const region = empty.shadowRoot!.querySelector('[role="region"]')!;
    const title = empty.shadowRoot!.querySelector('[data-title]')!;
    expect(region.getAttribute('aria-labelledby')).toBe(title.id);
    expect(empty.shadowRoot!.querySelector<HTMLElement>('.actions')!.hidden).toBe(true);
  });

  it('uses the visible slotted empty-state heading as its accessible name', () => {
    const empty = document.createElement('rg-empty-state');
    empty.innerHTML = '<strong slot="title">Nothing scheduled</strong>';
    document.body.append(empty);

    const region = empty.shadowRoot!.querySelector<HTMLElement>('[role="region"]')!;
    const labelledBy = region.getAttribute('aria-labelledby')!;
    const heading = empty.shadowRoot!.getElementById(labelledBy)!;
    const assignedTitle = heading.querySelector('slot')!.assignedElements()[0]!;
    expect(heading.localName).toBe('h2');
    expect(assignedTitle.textContent).toBe('Nothing scheduled');
  });

  it('participates in forms with a native date value and constraints', () => {
    const form = document.createElement('form');
    const picker = document.createElement('rg-date-picker') as HTMLElement & {
      value: string;
    };
    picker.setAttribute('name', 'launch');
    picker.setAttribute('label', 'Launch date');
    picker.setAttribute('min', '2026-01-01');
    picker.value = '2026-07-15';
    form.append(picker);
    document.body.append(form);

    const control = picker.shadowRoot!.querySelector<HTMLInputElement>('input[type="date"]')!;
    expect(control.value).toBe('2026-07-15');
    expect(control.min).toBe('2026-01-01');
    expect(control.name).toBe('launch');
  });

  it('normalizes a malformed date to the native control value', () => {
    const picker = document.createElement('rg-date-picker') as HTMLElement & { value: string };
    picker.value = 'not-a-date';
    document.body.append(picker);

    expect(picker.shadowRoot!.querySelector<HTMLInputElement>('input')!.value).toBe('');
    expect(picker.value).toBe('');
  });
});

describe('popup selection components', () => {
  it('opens a popover from its trigger and closes it with Escape', () => {
    const popover = document.createElement('rg-popover') as HTMLElement & { open: boolean };
    popover.innerHTML = '<button slot="trigger">Open</button><p>Popover content</p>';
    document.body.append(popover);
    const trigger = popover.querySelector<HTMLButtonElement>('button')!;

    trigger.click();
    expect(popover.open).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(popover, { key: 'Escape' });
    expect(popover.open).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('navigates a menu with arrow keys and emits the selected value', () => {
    const menu = document.createElement('rg-menu') as HTMLElement & { open: boolean };
    menu.innerHTML = `
      <button slot="trigger">Actions</button>
      <rg-menu-item value="rename">Rename</rg-menu-item>
      <rg-menu-item value="archive">Archive</rg-menu-item>
    `;
    document.body.append(menu);
    const selected = vi.fn();
    menu.addEventListener('rg-select', selected);

    menu.querySelector<HTMLButtonElement>('button')!.click();
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    fireEvent.keyDown(menu, { key: 'Enter' });

    expect(selected).toHaveBeenCalledOnce();
    expect((selected.mock.calls[0]![0] as CustomEvent).detail.value).toBe('archive');
    expect(menu.open).toBe(false);
  });

  it('filters combobox options and commits keyboard selection to a form', () => {
    const form = document.createElement('form');
    const combo = document.createElement('rg-combobox') as HTMLElement & { value: string };
    combo.setAttribute('name', 'city');
    combo.setAttribute('label', 'City');
    combo.innerHTML = `
      <rg-option value="seoul">Seoul</rg-option>
      <rg-option value="london">London</rg-option>
      <rg-option value="tokyo">Tokyo</rg-option>
    `;
    form.append(combo);
    document.body.append(form);
    const input = combo.shadowRoot!.querySelector<HTMLInputElement>('[role="combobox"]')!;

    input.value = 'lon';
    fireEvent.input(input);
    const visibleOptions = Array.from(
      combo.shadowRoot!.querySelectorAll<HTMLElement>('[role="option"]:not([hidden])'),
    );
    expect(visibleOptions.map((option) => option.textContent?.trim())).toEqual(['London']);

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(combo.value).toBe('london');
    expect(combo.getAttribute('name')).toBe('city');
  });

  it('skips disabled combobox options when setting active descendant', () => {
    const combo = document.createElement('rg-combobox');
    combo.innerHTML = `
      <rg-option value="seoul" disabled>Seoul</rg-option>
      <rg-option value="london">London</rg-option>
    `;
    document.body.append(combo);
    const input = combo.shadowRoot!.querySelector<HTMLInputElement>('[role="combobox"]')!;

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const activeId = input.getAttribute('aria-activedescendant')!;
    const active = combo.shadowRoot!.getElementById(activeId)!;
    expect(active.textContent).toBe('London');
    expect(active.getAttribute('aria-disabled')).toBeNull();
  });
});
