import { afterEach, describe, expect, it } from 'vitest';
import { RgStepElement } from '../src/components/step-indicator.js';
import { reglowElementTags } from '../src/definitions.js';
import '../src/register.js';

afterEach(() => {
  document.body.replaceChildren();
});

describe('locale-aware formatting helpers', () => {
  it('formats an ISO date with explicit locale and time-zone options', () => {
    const formatter = document.createElement('rg-format-date');
    formatter.setAttribute('date', '2026-07-15T09:17:00.000Z');
    formatter.setAttribute('locale', 'en-US');
    formatter.setAttribute('time-zone', 'UTC');
    formatter.setAttribute('year', 'numeric');
    formatter.setAttribute('month', 'long');
    formatter.setAttribute('day', '2-digit');
    document.body.append(formatter);

    const time = formatter.shadowRoot!.querySelector('time')!;
    expect(time.dateTime).toBe('2026-07-15T09:17:00.000Z');
    expect(time.textContent).toBe(
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      }).format(new Date('2026-07-15T09:17:00.000Z')),
    );

    formatter.setAttribute('date', 'not-a-date');
    expect(time.textContent).toBe('—');
    expect(time.hasAttribute('datetime')).toBe(false);
  });

  it('formats currency and reacts to value changes', () => {
    const formatter = document.createElement('rg-format-number') as HTMLElement & {
      value: number;
    };
    formatter.setAttribute('locale', 'en-US');
    formatter.setAttribute('type', 'currency');
    formatter.setAttribute('currency', 'USD');
    formatter.setAttribute('minimum-fraction-digits', '2');
    formatter.value = 2_000;
    document.body.append(formatter);

    const output = formatter.shadowRoot!.querySelector('[part~="base"]')!;
    expect(output.textContent).toBe(
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(2_000),
    );

    formatter.value = 12.5;
    expect(output.textContent).toBe(
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(12.5),
    );
  });

  it('formats byte and bit quantities with decimal SI units', () => {
    const formatter = document.createElement('rg-format-bytes') as HTMLElement & {
      value: number;
    };
    formatter.setAttribute('locale', 'en-US');
    formatter.setAttribute('display', 'short');
    formatter.value = 1_500_000;
    document.body.append(formatter);

    const output = formatter.shadowRoot!.querySelector('[part~="base"]')!;
    expect(output.textContent).toBe(
      new Intl.NumberFormat('en-US', {
        style: 'unit',
        unit: 'megabyte',
        unitDisplay: 'short',
        maximumFractionDigits: 2,
      }).format(1.5),
    );

    formatter.setAttribute('unit', 'bit');
    expect(output.textContent).toBe(
      new Intl.NumberFormat('en-US', {
        style: 'unit',
        unit: 'megabit',
        unitDisplay: 'short',
        maximumFractionDigits: 2,
      }).format(1.5),
    );
  });
});

describe('meter', () => {
  it('exposes a bounded native meter and a non-color value description', () => {
    const meter = document.createElement('rg-meter') as HTMLElement & {
      value: number;
    };
    meter.setAttribute('label', 'Storage used');
    meter.setAttribute('min', '0');
    meter.setAttribute('max', '100');
    meter.setAttribute('low', '60');
    meter.setAttribute('high', '85');
    meter.setAttribute('optimum', '20');
    meter.setAttribute('tone', 'warning');
    meter.setAttribute('value-text', '75 GB of 100 GB');
    meter.setAttribute('show-value', '');
    meter.value = 75;
    document.body.append(meter);

    const native = meter.shadowRoot!.querySelector('meter')!;
    const indicator = meter.shadowRoot!.querySelector<HTMLElement>('[part="indicator"]')!;
    const visibleValue = meter.shadowRoot!.querySelector('[part="value"]')!;

    expect(
      ['min', 'max', 'low', 'high', 'optimum', 'value'].map((name) =>
        Number(native.getAttribute(name)),
      ),
    ).toEqual([0, 100, 60, 85, 20, 75]);
    expect(native.getAttribute('aria-label')).toBe('Storage used');
    expect(native.getAttribute('aria-valuetext')).toBe('75 GB of 100 GB');
    expect(indicator.style.transform).toBe('scaleX(0.75)');
    expect(visibleValue.textContent).toBe('75 GB of 100 GB');
  });

  it('clamps invalid ranges and values to the public meter contract', () => {
    const meter = document.createElement('rg-meter') as HTMLElement & {
      value: number;
      min: number;
      max: number;
    };
    meter.min = 10;
    meter.max = 5;
    meter.value = 100;
    document.body.append(meter);

    const native = meter.shadowRoot!.querySelector('meter')!;
    expect(native.getAttribute('min')).toBe('10');
    expect(native.getAttribute('max')).toBe('11');
    expect(native.getAttribute('value')).toBe('11');
    expect(native.getAttribute('aria-valuetext')).toBe('100%');
  });
});

describe('step indicator', () => {
  it('uses one marker circle and primary styling for the completed path', () => {
    const styles = RgStepElement.styles;

    expect(styles).not.toMatch(/box-shadow:\s*0 0 0/);
    expect(styles).toMatch(
      /:host\(\[data-state='complete'\]\) \.line\s*\{\s*background: var\(--_rg-brand\);\s*\}/,
    );
    expect(styles).toMatch(
      /:host\(\[data-state='complete'\]\) \.marker\s*\{[\s\S]*?border-color: var\(--_rg-brand\);/,
    );
  });

  it('can render child step attributes before their connected callbacks run', () => {
    const indicator = document.createElement('rg-step-indicator') as HTMLElement & {
      connectedCallback(): void;
    };
    indicator.innerHTML = `
      <rg-step value="account" label="Account" description="Create credentials"></rg-step>
      <rg-step value="delivery" label="Delivery"></rg-step>
    `;

    expect(() => indicator.connectedCallback()).not.toThrow();
    const firstStep = indicator.querySelector('rg-step')!;
    expect(firstStep.shadowRoot).not.toBeNull();
    expect(firstStep.shadowRoot!.querySelector('[part="label"]')!.textContent).toBe('Account');
    expect(firstStep.shadowRoot!.querySelector('[part="description"]')!.textContent).toBe(
      'Create credentials',
    );
  });

  it('announces complete, current, and upcoming steps without becoming interactive', () => {
    const indicator = document.createElement('rg-step-indicator') as HTMLElement & {
      value: string;
    };
    indicator.setAttribute('label', 'Checkout progress');
    indicator.value = 'delivery';
    indicator.innerHTML = `
      <rg-step value="account">Account</rg-step>
      <rg-step value="delivery" description="Choose a delivery window">Delivery</rg-step>
      <rg-step value="review">Review</rg-step>
    `;
    document.body.append(indicator);

    const nav = indicator.shadowRoot!.querySelector('nav')!;
    const steps = Array.from(indicator.querySelectorAll('rg-step'));
    expect(nav.getAttribute('aria-label')).toBe('Checkout progress');
    expect(steps.map((step) => step.getAttribute('data-state'))).toEqual([
      'complete',
      'current',
      'upcoming',
    ]);
    expect(steps[1]!.getAttribute('aria-current')).toBe('step');
    expect(steps[0]!.hasAttribute('aria-current')).toBe(false);
    expect(steps.every((step) => step.getAttribute('role') === 'listitem')).toBe(true);
    expect(steps.every((step) => step.tabIndex === -1)).toBe(true);
    expect(
      steps.map((step) => step.shadowRoot!.querySelector('[data-status]')!.textContent),
    ).toEqual(['Completed', 'Current step', 'Upcoming']);
  });

  it('normalizes an unknown value and supports vertical localized status labels', () => {
    const indicator = document.createElement('rg-step-indicator') as HTMLElement & {
      value: string;
    };
    indicator.setAttribute('orientation', 'vertical');
    indicator.setAttribute('complete-label', 'Done');
    indicator.setAttribute('current-label', 'Active');
    indicator.setAttribute('upcoming-label', 'Next');
    indicator.value = 'missing';
    indicator.innerHTML = `
      <rg-step value="profile">Profile</rg-step>
      <rg-step value="security">Security</rg-step>
    `;
    document.body.append(indicator);

    const steps = Array.from(indicator.querySelectorAll('rg-step'));
    expect(indicator.value).toBe('profile');
    expect(steps.map((step) => step.getAttribute('data-orientation'))).toEqual([
      'vertical',
      'vertical',
    ]);
    expect(
      steps.map((step) => step.shadowRoot!.querySelector('[data-status]')!.textContent),
    ).toEqual(['Active', 'Next']);
  });
});

it('registers every researched catalog element', () => {
  expect(reglowElementTags).toEqual(
    expect.arrayContaining([
      'rg-format-date',
      'rg-format-number',
      'rg-format-bytes',
      'rg-meter',
      'rg-step-indicator',
      'rg-step',
    ]),
  );
});
