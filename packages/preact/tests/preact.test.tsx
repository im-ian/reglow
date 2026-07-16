/** @jsxImportSource preact */

import { fireEvent, render } from '@testing-library/preact';
import { createRef } from 'preact';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  RgButtonElement,
  RgCopyButtonElement,
  RgDialogElement,
  RgPaginationElement,
  RgRatingElement,
  RgSelectElement,
  defineElement,
  type ReglowElementTagName,
  type RgPressDetail,
} from '@reglow/elements';
import type { ReglowPreactIntrinsicElements } from '../src/index.js';
import '../src/index.js';

type Expect<TValue extends true> = TValue;
type HasKeys<TValue, TKeys extends PropertyKey> = [Exclude<TKeys, keyof TValue>] extends [never]
  ? true
  : false;

type CanonicalAttributeContract = [
  Expect<HasKeys<ReglowPreactIntrinsicElements['rg-button'], 'formnovalidate'>>,
  Expect<HasKeys<ReglowPreactIntrinsicElements['rg-link'], 'hreflang' | 'referrerpolicy' | 'type'>>,
  Expect<
    HasKeys<ReglowPreactIntrinsicElements['rg-input'], 'maxlength' | 'minlength' | 'readonly'>
  >,
  Expect<
    HasKeys<
      ReglowPreactIntrinsicElements['rg-avatar'],
      'crossorigin' | 'decoding' | 'referrerpolicy' | 'sizes' | 'srcset'
    >
  >,
  Expect<HasKeys<ReglowPreactIntrinsicElements['rg-alert'], 'dismiss-label'>>,
  Expect<HasKeys<ReglowPreactIntrinsicElements['rg-toast-region'], 'label' | 'pause-on-hover'>>,
  Expect<HasKeys<ReglowPreactIntrinsicElements['rg-accordion-item'], 'heading-level'>>,
  Expect<
    HasKeys<ReglowPreactIntrinsicElements['rg-dialog'], 'label' | 'hide-close' | 'close-label'>
  >,
  Expect<HasKeys<ReglowPreactIntrinsicElements['rg-format-date'], 'timeZone' | 'hourFormat'>>,
  Expect<HasKeys<ReglowPreactIntrinsicElements['rg-meter'], 'showValue' | 'valueText'>>,
  Expect<HasKeys<ReglowPreactIntrinsicElements['rg-step-indicator'], 'completeLabel' | 'value'>>,
  Expect<HasKeys<ReglowPreactIntrinsicElements['rg-avatar-group'], 'max' | 'moreLabel' | 'size'>>,
  Expect<
    HasKeys<ReglowPreactIntrinsicElements['rg-timeline-item'], 'dateTime' | 'timestamp' | 'tone'>
  >,
];

type CatalogContract = [
  Expect<
    Exclude<ReglowElementTagName, keyof ReglowPreactIntrinsicElements> extends never ? true : false
  >,
  Expect<
    Exclude<keyof ReglowPreactIntrinsicElements, ReglowElementTagName> extends never ? true : false
  >,
];

const canonicalAttributeContract: CanonicalAttributeContract = [
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
];
const catalogContract: CatalogContract = [true, true];

afterEach(() => {
  document.body.replaceChildren();
});

describe('@reglow/preact', () => {
  it('types every public Reglow element without extra catalog entries', () => {
    expect(catalogContract).toEqual([true, true]);
  });

  it('declares canonical custom-element attributes', () => {
    expect(canonicalAttributeContract).toHaveLength(13);

    defineElement({ tagName: RgDialogElement.tagName, constructor: RgDialogElement });
    const { container } = render(
      <rg-dialog label="Settings" hide-close close-label="Close settings" />,
    );
    const host = container.querySelector('rg-dialog');

    expect(host?.getAttribute('hide-close')).toBe('true');
    expect(host?.getAttribute('close-label')).toBe('Close settings');
    expect(host?.hasAttribute('hideclose')).toBe(false);
  });

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

  it('does not expose output-only or internal element state as JSX props', () => {
    // @ts-expect-error Form ownership is output-only state.
    const formOwner = <rg-input form={null} />;
    // @ts-expect-error Resolved theme mode is derived output-only state.
    const resolvedTheme = <rg-theme resolvedMode="dark" />;
    // @ts-expect-error Radio grouping state is internal coordination state.
    const groupedRadio = <rg-radio groupDisabled grouped />;

    expect([formOwner, resolvedTheme, groupedRadio]).toHaveLength(3);
  });

  it('restores numeric defaults when Preact removes setter-backed props', () => {
    defineElement({ tagName: RgRatingElement.tagName, constructor: RgRatingElement });
    defineElement({ tagName: RgPaginationElement.tagName, constructor: RgPaginationElement });
    defineElement({ tagName: RgCopyButtonElement.tagName, constructor: RgCopyButtonElement });
    const view = render(
      <>
        <rg-rating max={10} />
        <rg-pagination siblingCount={3} />
        <rg-copy-button feedbackDuration={500} />
      </>,
    );

    view.rerender(
      <>
        <rg-rating />
        <rg-pagination />
        <rg-copy-button />
      </>,
    );

    const rating = view.container.querySelector('rg-rating');
    const pagination = view.container.querySelector('rg-pagination');
    const copyButton = view.container.querySelector('rg-copy-button');
    expect(rating?.hasAttribute('max')).toBe(false);
    expect(rating?.max).toBe(5);
    expect(pagination?.hasAttribute('sibling-count')).toBe(false);
    expect(pagination?.siblingCount).toBe(1);
    expect(copyButton?.hasAttribute('feedback-duration')).toBe(false);
    expect(copyButton?.feedbackDuration).toBe(2000);
  });

  it('types boolean canonical attributes instead of accepting arbitrary strings', () => {
    // @ts-expect-error hide-close is a boolean Custom Element attribute.
    const invalid = <rg-dialog hide-close="yes" />;
    expect(invalid.props['hide-close']).toBe('yes');
  });
});
