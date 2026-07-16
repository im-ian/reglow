import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import type { RgInputElement } from '@reglow/elements';
import InputBinding from './fixtures/input-binding.svelte';

describe('@reglow/svelte', () => {
  it('updates the binding before invoking the typed value callback', async () => {
    render(InputBinding);
    const host = document.querySelector('rg-input') as RgInputElement;
    const input = host.shadowRoot!.querySelector('input')!;

    input.value = 'Reglow UI';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await tick();

    expect(screen.getByTestId('bound').textContent).toBe('Reglow UI');
    expect(screen.getByTestId('event').textContent).toBe('Reglow UI');
  });
});
