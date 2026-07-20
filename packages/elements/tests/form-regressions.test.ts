import { afterEach, describe, expect, it } from 'vitest';
import {
  RgAccordionElement,
  RgChipGroupElement,
  RgInputElement,
  RgRadioGroupElement,
  RgSelectElement,
} from '../src/index.js';
import { FormAssociatedElement } from '../src/core/form-associated.js';
import '../src/register.js';

class FormDisabledProbeElement extends FormAssociatedElement {
  static readonly tagName = 'rg-form-disabled-probe' as const;

  updateCount = 0;

  protected update(): void {
    this.updateCount += 1;
  }

  protected restoreFormValue(): void {}
}

if (!customElements.get(FormDisabledProbeElement.tagName)) {
  customElements.define(FormDisabledProbeElement.tagName, FormDisabledProbeElement);
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('form control regressions', () => {
  it('defers form-disabled rendering until the element is mounted', () => {
    const probe = document.createElement(
      FormDisabledProbeElement.tagName,
    ) as FormDisabledProbeElement;

    probe.formDisabledCallback(true);

    expect(probe.hasAttribute('data-form-disabled')).toBe(true);
    expect(probe.updateCount).toBe(0);

    document.body.append(probe);
    expect(probe.updateCount).toBe(1);
  });

  it('normalizes an invalid number value to the native input value', () => {
    const input = document.createElement('rg-input') as RgInputElement;
    input.type = 'number';
    document.body.append(input);

    input.value = 'not-a-number';

    expect(input.shadowRoot!.querySelector('input')!.value).toBe('');
    expect(input.value).toBe('');
    expect(input.getAttribute('value')).toBe('');
  });

  it('clears an unmatched select value instead of reporting stale state', () => {
    const select = document.createElement('rg-select') as RgSelectElement;
    select.options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
    ];
    document.body.append(select);

    select.value = 'missing';

    const control = select.shadowRoot!.querySelector('select')!;
    expect(control.selectedIndex).toBe(-1);
    expect(control.value).toBe('');
    expect(select.value).toBe('');
    expect(select.hasAttribute('value')).toBe(false);
  });

  it('clears an unmatched radio-group value instead of reporting stale state', async () => {
    const form = document.createElement('form');
    const group = document.createElement('rg-radio-group') as RgRadioGroupElement;
    group.name = 'plan';
    group.innerHTML = `
      <rg-radio value="one">One</rg-radio>
      <rg-radio value="two">Two</rg-radio>
    `;
    form.append(group);
    document.body.append(form);

    group.value = 'missing';
    await Promise.resolve();

    expect(group.value).toBe('');
    expect(group.hasAttribute('value')).toBe(false);
    expect(Array.from(group.querySelectorAll('rg-radio')).some((radio) => radio.checked)).toBe(
      false,
    );
    expect(new FormData(form).has('plan')).toBe(false);
  });

  it('preserves explicit empty group values instead of adopting leaf state', () => {
    const accordion = document.createElement('rg-accordion') as RgAccordionElement;
    accordion.collapsible = true;
    accordion.value = '';
    accordion.innerHTML = '<rg-accordion-item value="one" open>One</rg-accordion-item>';
    const chips = document.createElement('rg-chip-group') as RgChipGroupElement;
    chips.selection = 'single';
    chips.value = '';
    chips.innerHTML = '<rg-chip value="one" selected>One</rg-chip>';
    document.body.append(accordion, chips);

    expect(accordion.getAttribute('value')).toBe('');
    expect(accordion.querySelector('rg-accordion-item')!.open).toBe(false);
    expect(chips.getAttribute('value')).toBe('');
    expect(chips.querySelector('rg-chip')!.selected).toBe(false);
  });

  it('treats an explicit empty radio-group value as a no-selection sentinel', () => {
    const group = document.createElement('rg-radio-group') as RgRadioGroupElement;
    group.value = '';
    group.innerHTML = '<rg-radio value="one" checked>One</rg-radio>';
    document.body.append(group);

    expect(group.getAttribute('value')).toBe('');
    expect(group.value).toBe('');
    expect(group.querySelector('rg-radio')!.checked).toBe(false);
  });

  it('refreshes validity when assigned error text changes without slotchange', async () => {
    const input = document.createElement('rg-input') as RgInputElement;
    const error = document.createElement('span');
    error.slot = 'error';
    error.textContent = 'First error';
    input.append(error);
    document.body.append(input);
    await Promise.resolve();

    const control = input.shadowRoot!.querySelector('input')!;
    expect(control.validationMessage).toBe('First error');

    error.textContent = 'Updated error';
    await Promise.resolve();

    expect(control.validationMessage).toBe('Updated error');
  });
});
