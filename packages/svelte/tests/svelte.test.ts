import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import { componentMetadata, type RgInputElement, type RgSelectElement } from '@reglow/elements';
import * as Reglow from '../src/index.js';
import InputBinding from './fixtures/input-binding.svelte';
import SelectOptions from './fixtures/select-options.svelte';

describe('@reglow/svelte', () => {
  it('exports one Svelte component for every public Reglow element', () => {
    const exports = Reglow as unknown as Record<string, unknown>;
    const expectedNames = componentMetadata.map(
      ({ className }) => `Rg${className.replace(/^Rg/, '').replace(/Element$/, '')}`,
    );

    expect(expectedNames.filter((name) => exports[name] === undefined)).toEqual([]);
  });

  it('updates the binding before invoking the typed value callback', async () => {
    render(InputBinding);
    const host = document.querySelector('rg-input') as RgInputElement;
    const input = host.shadowRoot!.querySelector('input')!;

    input.value = 'Reglow UI';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await tick();

    expect(screen.getByTestId('bound').textContent).toBe('Reglow UI');
    expect(screen.getByTestId('event').textContent).toBe('Reglow UI');
    expect(host.getAttribute('autocomplete')).toBe('name');
  });

  it('forwards complex values as element properties', () => {
    render(SelectOptions);
    const host = document.querySelector('rg-select') as RgSelectElement;

    expect(host.options).toEqual([
      { value: 'alpha', label: 'Alpha', disabled: false, selected: false },
      { value: 'beta', label: 'Beta', disabled: true, selected: false },
    ]);
    expect(host.shadowRoot!.querySelectorAll('option')).toHaveLength(2);
  });
});
