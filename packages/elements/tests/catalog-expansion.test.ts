import { fireEvent } from '@testing-library/dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/register.js';

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  Reflect.deleteProperty(navigator, 'clipboard');
});

describe('utility and feedback catalog additions', () => {
  it('copies authored text and announces the successful result', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const copy = document.createElement('rg-copy-button') as HTMLElement & { value: string };
    copy.value = 'pnpm add @reglow/elements';
    document.body.append(copy);
    const copied = vi.fn();
    copy.addEventListener('rg-copy', copied);

    copy.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith('pnpm add @reglow/elements');
    expect(copied).toHaveBeenCalledOnce();
    expect((copied.mock.calls[0]![0] as CustomEvent).detail.value).toBe(
      'pnpm add @reglow/elements',
    );
    expect(copy.shadowRoot!.querySelector('[role="status"]')!.textContent).toBe('Copied');
  });

  it('renders determinate and indeterminate circular progress semantics', () => {
    const ring = document.createElement('rg-progress-ring') as HTMLElement & {
      value: number | null;
      max: number;
    };
    ring.setAttribute('label', 'Profile completion');
    ring.max = 80;
    ring.value = 100;
    document.body.append(ring);

    const progressbar = ring.shadowRoot!.querySelector<HTMLElement>('[role="progressbar"]')!;
    expect(progressbar.getAttribute('aria-label')).toBe('Profile completion');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('80');
    expect(progressbar.getAttribute('aria-valuetext')).toBe('100%');
    expect(ring.style.getPropertyValue('--_rg-progress-ring-offset')).toBe('0');

    ring.value = null;
    expect(progressbar.hasAttribute('aria-valuenow')).toBe(false);
    expect(ring.hasAttribute('data-indeterminate')).toBe(true);
  });

  it('formats relative dates with native Intl semantics', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T12:00:00.000Z'));
    const relative = document.createElement('rg-relative-time') as HTMLElement & { date: string };
    relative.setAttribute('locale', 'en');
    relative.date = '2026-07-15T10:00:00.000Z';
    document.body.append(relative);

    const time = relative.shadowRoot!.querySelector('time')!;
    expect(time.dateTime).toBe('2026-07-15T10:00:00.000Z');
    expect(time.textContent).toBe('2 hours ago');
  });

  it('promotes rounded relative-time boundaries to the larger unit', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-15T12:00:00.000Z'));
    const relative = document.createElement('rg-relative-time') as HTMLElement & { date: string };
    relative.setAttribute('locale', 'en');
    relative.setAttribute('numeric', 'auto');
    relative.date = '2026-07-16T11:59:59.900Z';
    document.body.append(relative);

    expect(relative.shadowRoot!.querySelector('time')!.textContent).toBe('tomorrow');
  });
});

describe('selection catalog additions', () => {
  it('supports multiple chip selection and removable chip events', () => {
    const group = document.createElement('rg-chip-group') as HTMLElement & {
      value: string | string[];
    };
    group.setAttribute('selection', 'multiple');
    group.setAttribute('label', 'Filters');
    group.innerHTML = `
      <rg-chip value="design" selected removable>Design</rg-chip>
      <rg-chip value="engineering">Engineering</rg-chip>
    `;
    document.body.append(group);
    const chips = Array.from(group.querySelectorAll('rg-chip'));
    const changed = vi.fn();
    const removed = vi.fn();
    group.addEventListener('rg-value-change', changed);
    chips[0]!.addEventListener('rg-remove', removed);

    fireEvent.click(chips[1]!);
    expect(group.value).toEqual(['design', 'engineering']);
    expect(chips[1]!.getAttribute('aria-selected')).toBe('true');
    expect(changed).toHaveBeenCalledOnce();

    chips[0]!.shadowRoot!.querySelector<HTMLButtonElement>('[data-remove]')!.click();
    expect(removed).toHaveBeenCalledOnce();
    expect((removed.mock.calls[0]![0] as CustomEvent).cancelable).toBe(true);
  });

  it('keeps segmented selection exclusive with roving keyboard focus', () => {
    const control = document.createElement('rg-segmented-control') as HTMLElement & {
      value: string;
    };
    control.setAttribute('label', 'View');
    control.innerHTML = `
      <rg-segment value="grid" selected>Grid</rg-segment>
      <rg-segment value="list">List</rg-segment>
      <rg-segment value="board" disabled>Board</rg-segment>
    `;
    document.body.append(control);
    const segments = Array.from(control.querySelectorAll('rg-segment'));

    fireEvent.keyDown(segments[0]!, { key: 'ArrowRight' });
    expect(control.value).toBe('list');
    expect(segments[1]!.getAttribute('aria-checked')).toBe('true');
    expect(segments[2]!.getAttribute('aria-disabled')).toBe('true');
  });

  it('slides one shared segmented-control indicator to the selected option', async () => {
    const control = document.createElement('rg-segmented-control') as HTMLElement & {
      value: string;
    };
    control.setAttribute('label', 'Calendar view');
    control.value = 'week';
    control.innerHTML = `
      <rg-segment value="day">Day</rg-segment>
      <rg-segment value="week">Week</rg-segment>
      <rg-segment value="month">Month</rg-segment>
    `;
    document.body.append(control);
    const indicator = control.shadowRoot!.querySelector<HTMLElement>('.indicator')!;
    const track = control.shadowRoot!.querySelector<HTMLElement>('.control')!;
    const segments = Array.from(control.querySelectorAll('rg-segment'));
    const controlStyles = control.shadowRoot!.querySelector('style')!.textContent!;
    const segmentStyles = segments[0]!.shadowRoot!.querySelector('style')!.textContent!;
    Object.defineProperties(track, {
      clientLeft: { configurable: true, value: 1 },
      clientTop: { configurable: true, value: 1 },
    });
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      top: 20,
    } as DOMRect);
    vi.spyOn(segments[0]!, 'getBoundingClientRect').mockReturnValue({
      left: 14,
      top: 24,
      width: 100,
      height: 36,
    } as DOMRect);
    vi.spyOn(segments[1]!, 'getBoundingClientRect').mockReturnValue({
      left: 118,
      top: 24,
      width: 100,
      height: 36,
    } as DOMRect);
    vi.spyOn(segments[2]!, 'getBoundingClientRect').mockReturnValue({
      left: 222,
      top: 24,
      width: 100,
      height: 36,
    } as DOMRect);
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    expect(indicator.getAttribute('part')).toBe('indicator');
    expect(controlStyles).toContain('--_rg-segment-flex-basis: 0%');
    expect(segmentStyles).toContain('flex: 1 1 var(--_rg-segment-flex-basis, auto)');
    expect(indicator.style.transform).toBe('translate(107px, 3px)');
    expect(indicator.style.width).toBe('100px');

    fireEvent.click(segments[2]!);
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    expect(control.value).toBe('month');
    expect(indicator.style.transform).toBe('translate(211px, 3px)');
  });

  it('provides form-like star rating pointer and keyboard behavior', () => {
    const rating = document.createElement('rg-rating') as HTMLElement & {
      value: number;
      max: number;
    };
    rating.setAttribute('label', 'Product rating');
    rating.max = 5;
    rating.value = 2;
    document.body.append(rating);
    const stars = Array.from(
      rating.shadowRoot!.querySelectorAll<HTMLButtonElement>('[data-rating-value]'),
    );
    const changed = vi.fn();
    rating.addEventListener('rg-value-change', changed);

    stars[3]!.click();
    expect(rating.value).toBe(4);
    expect(changed).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { value: 4, previousValue: 2 } }),
    );

    fireEvent.keyDown(stars[3]!, { key: 'ArrowLeft' });
    expect(rating.value).toBe(3);
    expect(
      rating.shadowRoot!.querySelector('[aria-checked="true"]')!.getAttribute('data-rating-value'),
    ).toBe('3');
  });
});
