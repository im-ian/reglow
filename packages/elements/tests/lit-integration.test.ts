import { html, render } from 'lit';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type {
  RgButtonElement,
  RgPressDetail,
  RgSelectElement,
  RgSelectOption,
} from '../src/index.js';
import '../src/register.js';

afterEach(() => {
  document.body.replaceChildren();
});

function createContainer(): HTMLDivElement {
  const container = document.createElement('div');
  document.body.append(container);
  return container;
}

describe('Lit integration', () => {
  it('assigns structured properties and toggles boolean attributes', () => {
    const container = createContainer();
    const options: readonly RgSelectOption[] = [
      { value: 'seoul', label: 'Seoul' },
      { value: 'london', label: 'London', disabled: true },
    ];
    const template = (disabled: boolean) =>
      html`<rg-select .options=${options} ?disabled=${disabled}></rg-select>`;

    render(template(true), container);

    const select = container.querySelector('rg-select') as RgSelectElement;
    expect(select.options).toEqual([
      { value: 'seoul', label: 'Seoul', disabled: false, selected: false },
      { value: 'london', label: 'London', disabled: true, selected: false },
    ]);
    expect(select.disabled).toBe(true);
    expect(select.hasAttribute('disabled')).toBe(true);
    expect(select.shadowRoot!.querySelector('select')!.options).toHaveLength(2);

    render(template(false), container);

    expect(container.querySelector('rg-select')).toBe(select);
    expect(select.disabled).toBe(false);
    expect(select.hasAttribute('disabled')).toBe(false);
  });

  it('handles composed custom events and preserves named slots', () => {
    const container = createContainer();
    const onPress = vi.fn((event: CustomEvent<RgPressDetail>) => event.detail.pressed);

    render(
      html`
        <rg-button @rg-press=${onPress}>
          <span slot="start">+</span>
          Create workspace
        </rg-button>
      `,
      container,
    );

    const button = container.querySelector('rg-button') as RgButtonElement;
    button.shadowRoot!.querySelector('button')!.click();

    expect(onPress).toHaveBeenCalledOnce();
    expect(onPress.mock.calls[0]![0]).toBeInstanceOf(CustomEvent);
    expect(onPress.mock.calls[0]![0].bubbles).toBe(true);
    expect(onPress.mock.calls[0]![0].composed).toBe(true);
    expect(button.querySelector('[slot="start"]')?.textContent).toBe('+');
  });
});
