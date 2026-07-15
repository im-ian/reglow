import { afterEach, describe, expect, it, vi } from 'vitest';
import { RgCopyButtonElement, RgSegmentElement, RgSegmentedControlElement } from '../src/index.js';
import '../src/register.js';

afterEach(() => {
  document.body.replaceChildren();
  Reflect.deleteProperty(navigator, 'clipboard');
});

describe('catalog component regressions', () => {
  it('keeps removable chip actions out of the option accessible name', () => {
    const group = document.createElement('rg-chip-group');
    group.setAttribute('selection', 'multiple');
    group.innerHTML = '<rg-chip value="design" removable>Design</rg-chip>';
    document.body.append(group);

    const chip = group.querySelector('rg-chip')!;
    const remove = chip.shadowRoot!.querySelector<HTMLButtonElement>('.remove')!;
    expect(chip.getAttribute('aria-label')).toBe('Design');
    expect(remove.getAttribute('aria-label')).toBe('Remove Design');
  });

  it('resolves copy sources within its shadow root and shows only the active custom icon', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const fixture = document.createElement('div');
    const root = fixture.attachShadow({ mode: 'open' });
    const source = document.createElement('code');
    source.id = 'shadow-install-command';
    source.textContent = 'pnpm add @reglow/elements';
    const copy = document.createElement('rg-copy-button') as RgCopyButtonElement;
    copy.from = '#shadow-install-command';
    copy.feedbackDuration = 0;
    copy.innerHTML = `
      <span slot="copy-icon">copy</span>
      <span slot="success-icon">done</span>
      <span slot="error-icon">error</span>
    `;
    root.append(source, copy);
    document.body.append(fixture);

    const iconSlots = Array.from(copy.shadowRoot!.querySelectorAll<HTMLSlotElement>('.icon slot'));
    expect(iconSlots.map((slot) => slot.hidden)).toEqual([false, true, true]);

    copy.shadowRoot!.querySelector<HTMLButtonElement>('.button')!.click();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith('pnpm add @reglow/elements');
    expect(iconSlots.map((slot) => slot.hidden)).toEqual([true, false, true]);
  });

  it('normalizes unmatched and newly disabled segmented values', async () => {
    const control = document.createElement('rg-segmented-control') as RgSegmentedControlElement;
    control.innerHTML = `
      <rg-segment value="grid">Grid</rg-segment>
      <rg-segment value="list">List</rg-segment>
    `;
    control.value = 'missing';
    document.body.append(control);
    const segments = Array.from(control.querySelectorAll('rg-segment')) as RgSegmentElement[];

    expect(control.value).toBe('grid');
    expect(segments.map((segment) => segment.selected)).toEqual([true, false]);

    segments[0]!.disabled = true;
    await Promise.resolve();

    expect(control.value).toBe('list');
    expect(segments.map((segment) => segment.selected)).toEqual([false, true]);
  });
});
