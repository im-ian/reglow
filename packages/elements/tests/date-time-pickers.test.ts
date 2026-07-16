import { fireEvent } from '@testing-library/dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/register.js';

afterEach(() => {
  document.body.replaceChildren();
});

describe('date picker presentations', () => {
  it('keeps the native picker as the default presentation', () => {
    const picker = document.createElement('rg-date-picker');
    picker.setAttribute('value', '2026-07-15');
    document.body.append(picker);

    expect(picker.shadowRoot!.querySelector<HTMLInputElement>('input[type="date"]')!.hidden).toBe(
      false,
    );
    expect(picker.shadowRoot!.querySelector<HTMLButtonElement>('.custom-control')!.hidden).toBe(
      true,
    );
  });

  it('opens the custom calendar and commits an ISO date value', async () => {
    const picker = document.createElement('rg-date-picker') as HTMLElement & {
      value: string;
      open: boolean;
    };
    picker.setAttribute('picker', 'custom');
    picker.setAttribute('value', '2026-07-15');
    document.body.append(picker);
    const input = vi.fn();
    const change = vi.fn();
    picker.addEventListener('input', input);
    picker.addEventListener('change', change);

    picker.shadowRoot!.querySelector<HTMLButtonElement>('.custom-control')!.click();
    expect(picker.open).toBe(true);
    picker.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-07-20"]')!.click();
    await Promise.resolve();

    expect(picker.value).toBe('2026-07-20');
    expect(picker.open).toBe(false);
    expect(input).toHaveBeenCalledOnce();
    expect(change).toHaveBeenCalledOnce();
  });

  it('disables custom calendar dates outside min and max', () => {
    const picker = document.createElement('rg-date-picker');
    picker.setAttribute('picker', 'custom');
    picker.setAttribute('value', '2026-07-15');
    picker.setAttribute('min', '2026-07-10');
    picker.setAttribute('max', '2026-07-20');
    document.body.append(picker);
    picker.shadowRoot!.querySelector<HTMLButtonElement>('.custom-control')!.click();

    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-07-09"]')!.disabled,
    ).toBe(true);
    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-07-20"]')!.disabled,
    ).toBe(false);
    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-07-21"]')!.disabled,
    ).toBe(true);
  });

  it('formats the visible custom value without changing the ISO value', () => {
    const picker = document.createElement('rg-date-picker') as HTMLElement & { value: string };
    picker.setAttribute('picker', 'custom');
    picker.setAttribute('date-format', 'iso');
    picker.setAttribute('value', '2026-07-15');
    document.body.append(picker);

    expect(picker.shadowRoot!.querySelector('[data-display-value]')!.textContent).toBe(
      '2026-07-15',
    );
    expect(picker.value).toBe('2026-07-15');
  });

  it('normalizes overlay sizing, alignment, and date format options', () => {
    const picker = document.createElement('rg-date-picker') as HTMLElement & {
      dateFormat: string;
      overlayAlign: string;
      overlayWidth: string;
    };
    picker.setAttribute('date-format', 'unsupported');
    picker.setAttribute('overlay-align', 'center');
    picker.setAttribute('overlay-width', 'full');
    document.body.append(picker);

    expect(picker.dateFormat).toBe('medium');
    expect(picker.overlayAlign).toBe('center');
    expect(picker.overlayWidth).toBe('full');
  });
});

describe('time picker', () => {
  it('offers AM/PM, twelve hours, and every minute', () => {
    const picker = document.createElement('rg-time-picker');
    picker.setAttribute('value', '09:30');
    document.body.append(picker);
    picker.shadowRoot!.querySelector<HTMLButtonElement>('.picker-control')!.click();

    expect(picker.shadowRoot!.querySelectorAll('.period-option')).toHaveLength(2);
    expect(picker.shadowRoot!.querySelectorAll('.hour-list .time-option')).toHaveLength(12);
    expect(picker.shadowRoot!.querySelectorAll('.minute-list .time-option')).toHaveLength(60);
    expect(picker.shadowRoot!.querySelector('.minute-list .time-option')!.textContent).toBe('00');
    expect(
      picker.shadowRoot!.querySelector('.minute-list .time-option:last-child')!.textContent,
    ).toBe('59');
  });

  it('normalizes the custom selection to a 24-hour form value', () => {
    const picker = document.createElement('rg-time-picker') as HTMLElement & {
      value: string;
      open: boolean;
    };
    picker.setAttribute('value', '09:30');
    document.body.append(picker);
    const change = vi.fn();
    picker.addEventListener('change', change);
    picker.shadowRoot!.querySelector<HTMLButtonElement>('.picker-control')!.click();

    picker
      .shadowRoot!.querySelector<HTMLButtonElement>('[data-time-part="period"][data-value="PM"]')!
      .click();
    picker
      .shadowRoot!.querySelector<HTMLButtonElement>('[data-time-part="hour"][data-value="4"]')!
      .click();
    picker
      .shadowRoot!.querySelector<HTMLButtonElement>('[data-time-part="minute"][data-value="45"]')!
      .click();
    picker.shadowRoot!.querySelector<HTMLButtonElement>('[data-action="done"]')!.click();

    expect(picker.value).toBe('16:45');
    expect(picker.open).toBe(false);
    expect(change).toHaveBeenCalledOnce();
  });

  it('moves a persistent tab-like indicator between time options', () => {
    const picker = document.createElement('rg-time-picker');
    picker.setAttribute('value', '09:30');
    document.body.append(picker);
    picker.shadowRoot!.querySelector<HTMLButtonElement>('.picker-control')!.click();
    const hourList = picker.shadowRoot!.querySelector<HTMLElement>('.hour-list')!;
    const indicator = hourList.querySelector('.time-selection');

    expect(hourList.style.getPropertyValue('--selection-index')).toBe('8');
    hourList.querySelector<HTMLButtonElement>('[data-value="4"]')!.click();

    expect(hourList.querySelector('.time-selection')).toBe(indicator);
    expect(hourList.style.getPropertyValue('--selection-index')).toBe('3');
    expect(picker.shadowRoot!.querySelector('style')!.textContent).toContain(
      'transition: transform var(--_rg-slow) var(--_rg-spring)',
    );
  });

  it('disables times outside the configured range and clamps partial selections', () => {
    const picker = document.createElement('rg-time-picker') as HTMLElement & { value: string };
    picker.setAttribute('min', '09:30');
    picker.setAttribute('max', '17:15');
    picker.setAttribute('value', '09:30');
    document.body.append(picker);
    picker.shadowRoot!.querySelector<HTMLButtonElement>('.picker-control')!.click();

    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-time-part="hour"][data-value="8"]',
      )!.disabled,
    ).toBe(true);
    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-time-part="minute"][data-value="29"]',
      )!.disabled,
    ).toBe(true);
    picker
      .shadowRoot!.querySelector<HTMLButtonElement>('[data-time-part="hour"][data-value="8"]')!
      .click();
    expect(picker.value).toBe('09:30');

    picker
      .shadowRoot!.querySelector<HTMLButtonElement>('[data-time-part="period"][data-value="PM"]')!
      .click();
    picker
      .shadowRoot!.querySelector<HTMLButtonElement>('[data-time-part="hour"][data-value="5"]')!
      .click();
    expect(picker.value).toBe('17:15');
    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-time-part="minute"][data-value="16"]',
      )!.disabled,
    ).toBe(true);
  });

  it('supports time ranges that cross midnight', () => {
    const picker = document.createElement('rg-time-picker');
    picker.setAttribute('min', '22:00');
    picker.setAttribute('max', '06:00');
    picker.setAttribute('value', '23:00');
    document.body.append(picker);
    picker.shadowRoot!.querySelector<HTMLButtonElement>('.picker-control')!.click();

    expect({
      value: (picker as HTMLElement & { value: string }).value,
      period: picker.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-time-part="period"][aria-selected="true"]',
      )?.dataset['value'],
      hour: picker.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-time-part="hour"][aria-selected="true"]',
      )?.dataset['value'],
    }).toEqual({ value: '23:00', period: 'PM', hour: '11' });
    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-time-part="hour"][data-value="9"]',
      )!.disabled,
    ).toBe(true);
    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-time-part="hour"][data-value="10"]',
      )!.disabled,
    ).toBe(false);
    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-time-part="period"][data-value="AM"]',
      )!.disabled,
    ).toBe(false);
  });

  it('closes with Escape and restores focus to the trigger', () => {
    const picker = document.createElement('rg-time-picker') as HTMLElement & { open: boolean };
    document.body.append(picker);
    const control = picker.shadowRoot!.querySelector<HTMLButtonElement>('.picker-control')!;
    control.click();

    fireEvent.keyDown(picker, { key: 'Escape' });

    expect(picker.open).toBe(false);
    expect(picker.shadowRoot!.activeElement).toBe(control);
  });
});

describe('date time picker', () => {
  it('edits the date and time in one panel and emits a datetime-local value', () => {
    const picker = document.createElement('rg-date-time-picker') as HTMLElement & {
      value: string;
      open: boolean;
    };
    picker.setAttribute('value', '2026-07-15T09:30');
    document.body.append(picker);
    const input = vi.fn();
    const change = vi.fn();
    picker.addEventListener('input', input);
    picker.addEventListener('change', change);
    picker.shadowRoot!.querySelector<HTMLButtonElement>('.picker-control')!.click();

    picker.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-07-20"]')!.click();
    picker
      .shadowRoot!.querySelector<HTMLButtonElement>('[data-time-part="period"][data-value="PM"]')!
      .click();
    picker
      .shadowRoot!.querySelector<HTMLButtonElement>('[data-time-part="hour"][data-value="4"]')!
      .click();
    picker
      .shadowRoot!.querySelector<HTMLButtonElement>('[data-time-part="minute"][data-value="45"]')!
      .click();
    picker.shadowRoot!.querySelector<HTMLButtonElement>('[data-action="done"]')!.click();

    expect(picker.value).toBe('2026-07-20T16:45');
    expect(picker.open).toBe(false);
    expect(input).toHaveBeenCalled();
    expect(change).toHaveBeenCalledOnce();
  });

  it('normalizes malformed values through datetime-local semantics', () => {
    const picker = document.createElement('rg-date-time-picker') as HTMLElement & { value: string };
    picker.value = 'not-a-date-time';
    document.body.append(picker);

    expect(picker.value).toBe('');
  });

  it('applies the date format while preserving the datetime-local value', () => {
    const picker = document.createElement('rg-date-time-picker') as HTMLElement & {
      value: string;
    };
    picker.setAttribute('date-format', 'iso');
    picker.setAttribute('value', '2026-07-15T09:30');
    document.body.append(picker);

    expect(picker.shadowRoot!.querySelector('[data-display-value]')!.textContent).toBe(
      '2026-07-15 · 09:30 AM',
    );
    expect(picker.value).toBe('2026-07-15T09:30');
  });

  it('limits boundary dates to their configured time ranges', () => {
    const picker = document.createElement('rg-date-time-picker') as HTMLElement & {
      value: string;
    };
    picker.setAttribute('min', '2026-07-15T09:30');
    picker.setAttribute('max', '2026-07-16T17:00');
    picker.setAttribute('value', '2026-07-15T09:30');
    document.body.append(picker);
    picker.shadowRoot!.querySelector<HTMLButtonElement>('.picker-control')!.click();

    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-07-14"]')!.disabled,
    ).toBe(true);
    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-time-part="minute"][data-value="29"]',
      )!.disabled,
    ).toBe(true);

    picker.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-07-16"]')!.click();
    picker
      .shadowRoot!.querySelector<HTMLButtonElement>('[data-time-part="period"][data-value="PM"]')!
      .click();

    expect(picker.value).toBe('2026-07-16T17:00');
    expect(
      picker.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-time-part="minute"][data-value="1"]',
      )!.disabled,
    ).toBe(true);
  });
});
