import { fireEvent } from '@testing-library/dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  RgAccordionElement,
  RgAlertElement,
  RgButtonElement,
  RgCheckboxElement,
  RgDialogElement,
  RgInputElement,
  RgProgressElement,
  RgRadioGroupElement,
  RgSelectElement,
  RgTabsElement,
  RgToastElement,
  RgToastRegionElement,
  RgTooltipElement,
  reglowElementTags,
} from '../src/index.js';
import '../src/register.js';

afterEach(() => {
  document.body.replaceChildren();
});

describe('custom element platform contract', () => {
  it('registers every element idempotently', async () => {
    await import('../src/register.js');
    expect(reglowElementTags).toHaveLength(57);
    reglowElementTags.forEach((tag) => expect(customElements.get(tag)).toBeTypeOf('function'));
  });

  it('keeps the module import safe when registration is explicit', () => {
    expect(RgButtonElement.tagName).toBe('rg-button');
    expect(new RgButtonElement()).toBeInstanceOf(HTMLElement);
  });
});

describe('actions and form controls', () => {
  it('emits a composed, cancelable press event and blocks loading actions', () => {
    const button = document.createElement('rg-button') as RgButtonElement;
    button.textContent = 'Save';
    document.body.append(button);
    const press = vi.fn();
    button.addEventListener('rg-press', press);

    button.shadowRoot!.querySelector('button')!.click();
    expect(press).toHaveBeenCalledOnce();
    const event = press.mock.calls[0]![0] as CustomEvent;
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
    expect(event.cancelable).toBe(true);

    button.loading = true;
    button.shadowRoot!.querySelector('button')!.click();
    expect(press).toHaveBeenCalledOnce();
  });

  it('synchronizes input value, validity, form state, and clear events', () => {
    const input = document.createElement('rg-input') as RgInputElement;
    input.name = 'project';
    input.label = 'Project';
    input.required = true;
    input.clearable = true;
    input.value = 'Reglow';
    document.body.append(input);

    const control = input.shadowRoot!.querySelector('input')!;
    expect(control.value).toBe('Reglow');
    expect(control.required).toBe(true);
    expect(control.getAttribute('aria-invalid')).toBe('false');

    const hostInput = vi.fn();
    input.addEventListener('input', hostInput);
    control.value = 'Reglow UI';
    fireEvent.input(control);
    expect(input.value).toBe('Reglow UI');
    expect(hostInput).toHaveBeenCalledOnce();

    const cleared = vi.fn();
    input.addEventListener('rg-clear', cleared);
    input.shadowRoot!.querySelector<HTMLButtonElement>('.clear')!.click();
    expect(input.value).toBe('');
    expect(cleared).toHaveBeenCalledOnce();
  });

  it('supports checked, indeterminate, and switch-style form state', () => {
    const checkbox = document.createElement('rg-checkbox') as RgCheckboxElement;
    checkbox.label = 'Include archived';
    checkbox.indeterminate = true;
    document.body.append(checkbox);

    const native = checkbox.shadowRoot!.querySelector('input')!;
    expect(native.indeterminate).toBe(true);
    native.click();
    expect(checkbox.checked).toBe(true);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('maps declarative options into a native select', async () => {
    const select = document.createElement('rg-select') as RgSelectElement;
    select.innerHTML = `
      <rg-option value="seoul" selected>Seoul</rg-option>
      <rg-option value="london">London</rg-option>
    `;
    document.body.append(select);
    await Promise.resolve();

    const native = select.shadowRoot!.querySelector('select')!;
    expect(native.options).toHaveLength(2);
    expect(native.value).toBe('seoul');
    native.value = 'london';
    fireEvent.change(native);
    expect(select.value).toBe('london');
  });

  it('coordinates radio selection and arrow-key navigation', () => {
    const group = document.createElement('rg-radio-group') as RgRadioGroupElement;
    group.innerHTML = '<rg-radio value="one">One</rg-radio><rg-radio value="two">Two</rg-radio>';
    group.value = 'one';
    document.body.append(group);
    const radios = Array.from(group.querySelectorAll('rg-radio'));

    fireEvent.keyDown(radios[0]!, { key: 'ArrowDown' });
    expect(group.value).toBe('two');
  });
});

describe('disclosure and overlay behavior', () => {
  it('gives progress indicators a visible, authored, or safe default accessible name', () => {
    const progress = document.createElement('rg-progress') as RgProgressElement;
    progress.label = 'Uploading assets';
    document.body.append(progress);

    const progressbar = progress.shadowRoot!.querySelector<HTMLElement>('.progress')!;
    expect(progressbar.getAttribute('aria-label')).toBe('Uploading assets');

    progress.setAttribute('aria-label', 'Asset upload progress');
    expect(progressbar.getAttribute('aria-label')).toBe('Asset upload progress');

    const unnamed = document.createElement('rg-progress') as RgProgressElement;
    document.body.append(unnamed);
    expect(unnamed.shadowRoot!.querySelector('.progress')!.getAttribute('aria-label')).toBe(
      'Progress',
    );
  });

  it('uses valid live-region semantics for toast status and alert tones', () => {
    const toast = document.createElement('rg-toast') as RgToastElement;
    toast.open = true;
    document.body.append(toast);
    const liveRegion = toast.shadowRoot!.querySelector<HTMLElement>('.toast')!;

    expect(liveRegion.localName).toBe('div');
    expect(liveRegion.getAttribute('role')).toBe('status');
    toast.tone = 'danger';
    expect(liveRegion.getAttribute('role')).toBe('alert');
  });

  it('reapplies the toast region limit when an existing toast opens', async () => {
    const region = document.createElement('rg-toast-region') as RgToastRegionElement;
    region.maxVisible = 1;
    const first = document.createElement('rg-toast') as RgToastElement;
    const second = document.createElement('rg-toast') as RgToastElement;
    region.append(first, second);
    document.body.append(region);

    first.open = true;
    second.open = true;
    await Promise.resolve();

    expect(first.open).toBe(false);
    expect(second.open).toBe(true);
  });

  it('keeps optional feedback slots in explicit layout states', async () => {
    const alert = document.createElement('rg-alert') as RgAlertElement;
    alert.dismissible = true;
    alert.innerHTML = '<span slot="title">Update</span>Message';
    document.body.append(alert);

    const alertLayout = alert.shadowRoot!.querySelector<HTMLElement>('.alert')!;
    expect(alertLayout.hasAttribute('data-icon-empty')).toBe(true);
    expect(alertLayout.hasAttribute('data-close-empty')).toBe(false);

    const toast = document.createElement('rg-toast') as RgToastElement;
    toast.open = true;
    toast.innerHTML = '<span slot="title">Saved</span>Message';
    document.body.append(toast);

    const toastLayout = toast.shadowRoot!.querySelector<HTMLElement>('.layout')!;
    expect(toastLayout.hasAttribute('data-icon-empty')).toBe(true);

    const icon = document.createElement('span');
    icon.slot = 'icon';
    toast.append(icon);
    await Promise.resolve();

    expect(toastLayout.hasAttribute('data-icon-empty')).toBe(false);
  });

  it('selects tabs with pointer and keyboard input', () => {
    const tabs = document.createElement('rg-tabs') as RgTabsElement;
    tabs.innerHTML = `
      <rg-tab value="one">One</rg-tab><rg-tab value="two">Two</rg-tab>
      <rg-tab-panel value="one">First</rg-tab-panel><rg-tab-panel value="two">Second</rg-tab-panel>
    `;
    tabs.value = 'one';
    document.body.append(tabs);
    const tabElements = Array.from(tabs.querySelectorAll('rg-tab'));

    expect(tabElements.map((tab) => tab.getAttribute('aria-label'))).toEqual(['One', 'Two']);

    fireEvent.click(tabElements[1]!);
    expect(tabs.value).toBe('two');
    tabElements[1]!.focus();
    expect(document.activeElement).toBe(tabElements[1]);
    fireEvent.keyDown(tabElements[1]!, { key: 'ArrowLeft' });
    expect(tabs.value).toBe('one');
  });

  it('enforces single-open accordion state', () => {
    const accordion = document.createElement('rg-accordion') as RgAccordionElement;
    accordion.innerHTML = `
      <rg-accordion-item value="one" open><span slot="heading">One</span>First</rg-accordion-item>
      <rg-accordion-item value="two"><span slot="heading">Two</span>Second</rg-accordion-item>
    `;
    document.body.append(accordion);
    const items = Array.from(accordion.querySelectorAll('rg-accordion-item'));

    fireEvent.click(items[1]!.shadowRoot!.querySelector('summary')!);
    expect(items[1]!.hasAttribute('open')).toBe(true);
    expect(items[0]!.hasAttribute('open')).toBe(false);
  });

  it('opens a native dialog from its trigger and restores closed state', () => {
    const dialog = document.createElement('rg-dialog') as RgDialogElement;
    dialog.innerHTML = '<button slot="trigger">Open</button><span slot="title">Title</span>Body';
    document.body.append(dialog);
    const trigger = dialog.querySelector('button')!;

    trigger.click();
    expect(dialog.open).toBe(true);
    expect(dialog.shadowRoot!.querySelector('dialog')!.open).toBe(true);
    dialog.close('done');
    expect(dialog.open).toBe(false);
    expect(dialog.returnValue).toBe('done');
  });

  it('closes a dialog from a declarative slotted close control', () => {
    const dialog = document.createElement('rg-dialog') as RgDialogElement;
    dialog.innerHTML = `
      <button slot="trigger">Open</button>
      <span slot="title">Title</span>
      <button slot="footer" data-rg-close data-rg-return-value="cancelled">Cancel</button>
    `;
    document.body.append(dialog);

    dialog.querySelector<HTMLButtonElement>('[slot="trigger"]')!.click();
    dialog.querySelector<HTMLButtonElement>('[data-rg-close]')!.click();

    expect(dialog.open).toBe(false);
    expect(dialog.returnValue).toBe('cancelled');
  });

  it('opens tooltip on focus and exposes an accessible description', () => {
    vi.useFakeTimers();
    const tooltip = document.createElement('rg-tooltip') as RgTooltipElement;
    tooltip.content = 'Add a new item';
    tooltip.innerHTML = '<button slot="trigger">+</button>';
    document.body.append(tooltip);
    const trigger = tooltip.querySelector('button')!;

    fireEvent.focusIn(trigger);
    vi.runAllTimers();
    expect(tooltip.open).toBe(true);
    expect(trigger.getAttribute('aria-description')).toBe('Add a new item');
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(tooltip.open).toBe(false);
    vi.useRealTimers();
  });
});
