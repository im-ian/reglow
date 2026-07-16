/** @jsxImportSource preact */

import { fireEvent, render } from '@testing-library/preact';
import { createRef } from 'preact';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  RgButtonElement,
  RgSelectElement,
  defineElement,
  type RgPressDetail,
} from '@reglow/elements';
import '../src/index.js';

afterEach(() => {
  document.body.replaceChildren();
});

describe('@reglow/preact', () => {
  it('types and renders native Reglow properties, refs, and slots', () => {
    defineElement({ tagName: RgButtonElement.tagName, constructor: RgButtonElement });
    const ref = createRef<RgButtonElement>();
    const { container } = render(
      <rg-button ref={ref} variant="soft" fullWidth>
        <span slot="start">+</span>
        Create
      </rg-button>,
    );

    const host = container.querySelector('rg-button');
    expect(ref.current).toBe(host);
    expect(host?.variant).toBe('soft');
    expect(host?.fullWidth).toBe(true);
    expect(host?.querySelector('[slot="start"]')?.textContent).toBe('+');
  });

  it('assigns complex values through custom-element properties', () => {
    defineElement({ tagName: RgSelectElement.tagName, constructor: RgSelectElement });
    const options = [{ value: 'private', label: 'Private' }];
    const { container } = render(<rg-select options={options} value="private" />);
    const host = container.querySelector('rg-select');

    expect(host?.options).toEqual([
      { value: 'private', label: 'Private', disabled: false, selected: false },
    ]);
    expect(host?.value).toBe('private');
  });

  it('listens to cancelable hyphenated custom events without an adapter runtime', () => {
    defineElement({ tagName: RgButtonElement.tagName, constructor: RgButtonElement });
    const onPress = vi.fn((event: CustomEvent<RgPressDetail>) => event.preventDefault());
    const { container } = render(<rg-button onrg-press={onPress}>Create</rg-button>);
    const control = container.querySelector('rg-button')?.shadowRoot?.querySelector('button');

    fireEvent.click(control!);
    expect(onPress).toHaveBeenCalledOnce();
    expect(onPress.mock.calls[0]![0].detail.pressed).toBeNull();
    expect(onPress.mock.calls[0]![0].defaultPrevented).toBe(true);
  });

  it('rejects invalid component property values at compile time', () => {
    // @ts-expect-error Reglow button variants are intentionally closed.
    const invalid = <rg-button variant="glossy" />;
    expect(invalid.props.variant).toBe('glossy');
  });
});
