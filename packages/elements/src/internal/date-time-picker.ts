export interface RgDateParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export interface RgTimeParts {
  readonly hour: number;
  readonly minute: number;
}

export interface RgDateTimeParts {
  readonly date: RgDateParts;
  readonly time: RgTimeParts;
}

export type RgTimeDisabledPredicate = (value: RgTimeParts) => boolean;

export type RgPickerDateFormat = 'short' | 'medium' | 'long' | 'full' | 'iso';

export type RgPickerOpenReason = 'api' | 'trigger' | 'escape' | 'outside' | 'selection';

export interface RgPickerOpenChangeDetail {
  readonly open: boolean;
  readonly reason: RgPickerOpenReason;
}

export interface RgCalendarRenderOptions {
  readonly view: RgDateParts;
  readonly selected: RgDateParts | null;
  readonly focused: RgDateParts | null;
  readonly min: RgDateParts | null;
  readonly max: RgDateParts | null;
  readonly locale: string;
}

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/u;
const TIME_PATTERN = /^(\d{2}):(\d{2})$/u;

export function padNumber(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

export function parseDate(value: string): RgDateParts | null {
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function formatDate(value: RgDateParts): string {
  return `${padNumber(value.year, 4)}-${padNumber(value.month)}-${padNumber(value.day)}`;
}

export function parseTime(value: string): RgTimeParts | null {
  const match = TIME_PATTERN.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export function formatTime(value: RgTimeParts): string {
  return `${padNumber(value.hour)}:${padNumber(value.minute)}`;
}

export function parseDateTime(value: string): RgDateTimeParts | null {
  const [dateValue, timeValue, extra] = value.split('T');
  if (!dateValue || !timeValue || extra !== undefined) return null;
  const date = parseDate(dateValue);
  const time = parseTime(timeValue);
  return date && time ? { date, time } : null;
}

export function formatDateTime(date: RgDateParts, time: RgTimeParts): string {
  return `${formatDate(date)}T${formatTime(time)}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function addDays(value: RgDateParts, amount: number): RgDateParts {
  const date = new Date(value.year, value.month - 1, value.day + amount, 12);
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

export function addMonths(value: RgDateParts, amount: number): RgDateParts {
  const targetMonth = value.month - 1 + amount;
  const targetYear = value.year + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  return {
    year: targetYear,
    month: normalizedMonth + 1,
    day: Math.min(value.day, daysInMonth(targetYear, normalizedMonth + 1)),
  };
}

export function compareDates(left: RgDateParts, right: RgDateParts): number {
  return formatDate(left).localeCompare(formatDate(right));
}

export function compareTimes(left: RgTimeParts, right: RgTimeParts): number {
  return formatTime(left).localeCompare(formatTime(right));
}

export function isDateDisabled(
  value: RgDateParts,
  min: RgDateParts | null,
  max: RgDateParts | null,
): boolean {
  return Boolean((min && compareDates(value, min) < 0) || (max && compareDates(value, max) > 0));
}

export function constrainDateToRange(
  value: RgDateParts,
  min: RgDateParts | null,
  max: RgDateParts | null,
): RgDateParts {
  if (min && compareDates(value, min) < 0) return min;
  if (max && compareDates(value, max) > 0) return max;
  return value;
}

export function isTimeDisabled(
  value: RgTimeParts,
  min: RgTimeParts | null,
  max: RgTimeParts | null,
): boolean {
  if (min && max && compareTimes(min, max) > 0) {
    return compareTimes(value, max) > 0 && compareTimes(value, min) < 0;
  }
  return Boolean((min && compareTimes(value, min) < 0) || (max && compareTimes(value, max) > 0));
}

export function constrainTimeToRange(
  value: RgTimeParts,
  min: RgTimeParts | null,
  max: RgTimeParts | null,
): RgTimeParts {
  if (!isTimeDisabled(value, min, max)) return value;
  if (min && max && compareTimes(min, max) > 0) {
    const valueMinutes = value.hour * 60 + value.minute;
    const minMinutes = min.hour * 60 + min.minute;
    const maxMinutes = max.hour * 60 + max.minute;
    return valueMinutes - maxMinutes <= minMinutes - valueMinutes ? max : min;
  }
  if (min && compareTimes(value, min) < 0) return min;
  if (max && compareTimes(value, max) > 0) return max;
  return value;
}

export function isDateTimeDisabled(
  date: RgDateParts,
  time: RgTimeParts,
  min: RgDateTimeParts | null,
  max: RgDateTimeParts | null,
): boolean {
  const value = formatDateTime(date, time);
  return Boolean(
    (min && value.localeCompare(formatDateTime(min.date, min.time)) < 0) ||
    (max && value.localeCompare(formatDateTime(max.date, max.time)) > 0),
  );
}

export function constrainTimeToDateRange(
  date: RgDateParts,
  time: RgTimeParts,
  min: RgDateTimeParts | null,
  max: RgDateTimeParts | null,
): RgTimeParts {
  if (min && compareDates(date, min.date) === 0 && compareTimes(time, min.time) < 0) {
    return min.time;
  }
  if (max && compareDates(date, max.date) === 0 && compareTimes(time, max.time) > 0) {
    return max.time;
  }
  return time;
}

export function today(): RgDateParts {
  const value = new Date();
  return { year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() };
}

function dateForIntl(value: RgDateParts): Date {
  return new Date(value.year, value.month - 1, value.day, 12);
}

function formatter(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale || undefined, options);
}

export function formatDisplayDate(
  value: RgDateParts,
  locale: string,
  format: RgPickerDateFormat = 'medium',
): string {
  if (format === 'iso') return formatDate(value);

  const options: Record<Exclude<RgPickerDateFormat, 'iso'>, Intl.DateTimeFormatOptions> = {
    short: { year: '2-digit', month: 'numeric', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  };
  return formatter(locale, options[format]).format(dateForIntl(value));
}

export function formatDisplayTime(value: RgTimeParts): string {
  const period = value.hour >= 12 ? 'PM' : 'AM';
  const hour = value.hour % 12 || 12;
  return `${padNumber(hour)}:${padNumber(value.minute)} ${period}`;
}

export function calendarTemplate(): string {
  return String.raw`
    <section class="calendar-view" part="calendar" aria-label="Choose a date">
      <header class="calendar-header">
        <button class="calendar-nav" part="calendar-navigation" data-action="previous-month" type="button" aria-label="Previous month">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 3.5-4.5 4.5 4.5 4.5" /></svg>
        </button>
        <strong class="month-label" data-month-label aria-live="polite"></strong>
        <button class="calendar-nav" part="calendar-navigation" data-action="next-month" type="button" aria-label="Next month">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5" /></svg>
        </button>
      </header>
      <div class="calendar-grid" role="grid" aria-labelledby=""></div>
    </section>
  `;
}

export const calendarStyles = String.raw`
  .calendar-view { min-width: 18.5rem; }
  .calendar-header { display: grid; grid-template-columns: 2rem 1fr 2rem; align-items: center; gap: 0.5rem; margin-block-end: 0.7rem; }
  .month-label { text-align: center; font-size: 0.94rem; font-weight: 780; letter-spacing: -0.018em; }
  .calendar-nav, .calendar-day, .picker-action, .time-option, .period-option {
    border: 0; color: inherit; background: transparent; cursor: pointer;
  }
  .calendar-nav { display: grid; width: 2rem; height: 2rem; padding: 0; place-items: center; border-radius: var(--rg-radius-sm, 0.7rem); color: var(--_rg-text-muted); }
  .calendar-nav:hover { color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
  .calendar-nav:focus-visible, .calendar-day:focus-visible, .picker-action:focus-visible, .time-option:focus-visible, .period-option:focus-visible { outline: none; box-shadow: var(--_rg-ring); }
  .calendar-nav svg { width: 1rem; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  .calendar-grid { display: grid; gap: 0.2rem; }
  .calendar-weekdays, .calendar-week { display: grid; grid-template-columns: repeat(7, minmax(2rem, 1fr)); gap: 0.18rem; }
  .calendar-weekday { padding-block: 0.15rem 0.3rem; color: var(--_rg-text-subtle); font-size: 0.67rem; font-weight: 760; letter-spacing: 0.05em; text-align: center; text-transform: uppercase; }
  .calendar-day { position: relative; display: grid; aspect-ratio: 1; min-width: 2rem; padding: 0; place-items: center; border-radius: 0.7rem; font-size: 0.8rem; font-weight: 670; }
  .calendar-day:hover:not(:disabled) { color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
  .calendar-day[data-outside] { color: var(--_rg-text-subtle); opacity: 0.55; }
  .calendar-day[data-today]::after { position: absolute; inset: auto auto 0.23rem; width: 0.22rem; height: 0.22rem; border-radius: 999px; background: currentColor; content: ''; }
  .calendar-day[aria-selected='true'] { color: var(--_rg-on-brand); background: var(--_rg-brand); box-shadow: 0 0.3rem 0.8rem rgb(83 103 248 / 22%); }
  .calendar-day:disabled { opacity: 0.25; cursor: not-allowed; }
`;

export function renderCalendar(root: ShadowRoot, options: RgCalendarRenderOptions): void {
  const { view, selected, focused, min, max, locale } = options;
  const monthLabel = root.querySelector<HTMLElement>('[data-month-label]');
  const grid = root.querySelector<HTMLElement>('.calendar-grid');
  if (!monthLabel || !grid) return;

  monthLabel.textContent = formatter(locale, { year: 'numeric', month: 'long' }).format(
    dateForIntl({ ...view, day: 1 }),
  );

  const weekdays = document.createElement('div');
  weekdays.className = 'calendar-weekdays';
  weekdays.setAttribute('role', 'row');
  for (let day = 0; day < 7; day += 1) {
    const label = document.createElement('span');
    label.className = 'calendar-weekday';
    label.setAttribute('role', 'columnheader');
    label.textContent = formatter(locale, { weekday: 'short' }).format(new Date(2026, 6, 12 + day));
    weekdays.append(label);
  }

  const firstDay = new Date(view.year, view.month - 1, 1, 12).getDay();
  const firstVisible = addDays({ ...view, day: 1 }, -firstDay);
  const currentDay = today();
  const requestedFocus = focused ?? selected ?? currentDay;
  const lastVisible = addDays(firstVisible, 41);
  let focusTarget =
    compareDates(requestedFocus, firstVisible) >= 0 &&
    compareDates(requestedFocus, lastVisible) <= 0 &&
    !isDateDisabled(requestedFocus, min, max)
      ? requestedFocus
      : { ...view, day: 1 };
  if (isDateDisabled(focusTarget, min, max)) {
    for (let offset = 0; offset < 42; offset += 1) {
      const candidate = addDays(firstVisible, offset);
      if (!isDateDisabled(candidate, min, max)) {
        focusTarget = candidate;
        break;
      }
    }
  }
  const rows: HTMLElement[] = [weekdays];

  for (let week = 0; week < 6; week += 1) {
    const row = document.createElement('div');
    row.className = 'calendar-week';
    row.setAttribute('role', 'row');
    for (let offset = 0; offset < 7; offset += 1) {
      const date = addDays(firstVisible, week * 7 + offset);
      const dateValue = formatDate(date);
      const button = document.createElement('button');
      button.className = 'calendar-day';
      button.type = 'button';
      button.dataset['date'] = dateValue;
      button.setAttribute('role', 'gridcell');
      button.setAttribute('aria-label', formatDisplayDate(date, locale));
      button.setAttribute(
        'aria-selected',
        String(Boolean(selected && compareDates(date, selected) === 0)),
      );
      button.tabIndex = compareDates(date, focusTarget) === 0 ? 0 : -1;
      button.disabled = isDateDisabled(date, min, max);
      button.textContent = String(date.day);
      if (date.month !== view.month) button.dataset['outside'] = '';
      if (compareDates(date, currentDay) === 0) button.dataset['today'] = '';
      row.append(button);
    }
    rows.push(row);
  }

  grid.replaceChildren(...rows);
}

export function timePickerTemplate(): string {
  return String.raw`
    <section class="time-view" part="time" aria-label="Choose a time">
      <div class="time-heading" aria-hidden="true"><span>Period</span><span>Hour</span><span>Minute</span></div>
      <div class="time-columns">
        <div class="time-column period-list" part="period-list" role="listbox" aria-label="AM or PM"><span class="time-selection" part="time-selection" aria-hidden="true"></span></div>
        <div class="time-column hour-list" part="hour-list" role="listbox" aria-label="Hour"><span class="time-selection" part="time-selection" aria-hidden="true"></span></div>
        <div class="time-column minute-list" part="minute-list" role="listbox" aria-label="Minute"><span class="time-selection" part="time-selection" aria-hidden="true"></span></div>
      </div>
    </section>
  `;
}

export const timePickerStyles = String.raw`
  .time-view { min-width: 14.5rem; }
  .time-option, .period-option { border: 0; color: inherit; background: transparent; cursor: pointer; }
  .time-heading { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.4rem; margin-block-end: 0.35rem; color: var(--_rg-text-subtle); font-size: 0.66rem; font-weight: 760; letter-spacing: 0.045em; text-align: center; text-transform: uppercase; }
  .time-columns { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.4rem; }
  .time-column { position: relative; display: grid; align-content: start; gap: 0.2rem; height: 11.4rem; padding: 0.25rem; overflow-y: auto; overscroll-behavior: contain; border: 1px solid var(--_rg-border); border-radius: var(--rg-radius-md, 0.875rem); background: var(--_rg-canvas-subtle); scrollbar-width: thin; isolation: isolate; }
  .time-selection {
    position: absolute; z-index: 0; inset: 0.25rem 0.25rem auto; height: 2.3rem;
    border-radius: var(--rg-radius-sm, 0.7rem); background: var(--_rg-brand);
    box-shadow: 0 0.25rem 0.7rem rgb(83 103 248 / 20%);
    transform: translateY(calc(var(--selection-index, 0) * 2.5rem));
    transition: transform var(--_rg-slow) var(--_rg-spring);
    pointer-events: none;
  }
  .time-option, .period-option { position: relative; z-index: 1; min-height: 2.3rem; padding: 0.35rem 0.45rem; border-radius: var(--rg-radius-sm, 0.7rem); font-size: 0.8rem; font-weight: 700; transition: color var(--_rg-base) var(--_rg-ease), transform var(--_rg-fast) var(--_rg-spring); }
  .time-option:hover, .period-option:hover { color: var(--_rg-brand-text); background: var(--_rg-brand-soft); }
  .time-option:active, .period-option:active { transform: scale(0.96); }
  .time-option:disabled, .period-option:disabled { color: var(--_rg-text-subtle); background: transparent; opacity: 0.32; cursor: not-allowed; transform: none; }
  .time-option[aria-selected='true'], .period-option[aria-selected='true'],
  .time-option[aria-selected='true']:hover, .period-option[aria-selected='true']:hover { color: var(--_rg-on-brand); background: transparent; }
`;

function timeOption(
  kind: 'period' | 'hour' | 'minute',
  value: string,
  label: string,
): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = kind === 'period' ? 'period-option' : 'time-option';
  button.type = 'button';
  button.dataset['timePart'] = kind;
  button.dataset['value'] = value;
  button.setAttribute('role', 'option');
  button.setAttribute('aria-selected', 'false');
  button.tabIndex = -1;
  button.textContent = label;
  return button;
}

function initializeTimeOptions(
  list: HTMLElement,
  kind: 'period' | 'hour' | 'minute',
  values: readonly string[],
): void {
  if (list.querySelector('[data-time-part]')) return;
  list.append(
    ...values.map((value) =>
      timeOption(kind, value, kind === 'period' ? value : padNumber(Number(value))),
    ),
  );
}

function hasEnabledTime(
  part: 'period' | 'hour' | 'minute',
  rawValue: string,
  current: RgTimeParts,
  isDisabled: RgTimeDisabledPredicate,
): boolean {
  const next = updateTimePart(current, part, rawValue);
  if (part === 'minute') return !isDisabled(next);
  if (part === 'hour') {
    return Array.from({ length: 60 }, (_item, minute) => ({ ...next, minute })).some(
      (candidate) => !isDisabled(candidate),
    );
  }
  const periodStart = rawValue === 'PM' ? 12 : 0;
  return Array.from({ length: 12 * 60 }, (_item, offset) => ({
    hour: periodStart + Math.floor(offset / 60),
    minute: offset % 60,
  })).some((candidate) => !isDisabled(candidate));
}

function selectTimeOption(
  list: HTMLElement,
  value: string,
  index: number,
  current: RgTimeParts,
  isDisabled: RgTimeDisabledPredicate,
): void {
  list.style.setProperty('--selection-index', String(index));
  list.querySelectorAll<HTMLButtonElement>('[data-time-part]').forEach((option) => {
    const selected = option.dataset['value'] === value;
    const part = option.dataset['timePart'];
    const disabled =
      (part === 'period' || part === 'hour' || part === 'minute') &&
      !hasEnabledTime(part, option.dataset['value'] ?? '', current, isDisabled);
    option.disabled = disabled;
    option.setAttribute('aria-disabled', String(disabled));
    option.setAttribute('aria-selected', String(selected));
    option.tabIndex = selected && !disabled ? 0 : -1;
  });
}

export function renderTimePicker(
  root: ShadowRoot,
  value: RgTimeParts,
  isDisabled: RgTimeDisabledPredicate = () => false,
): void {
  const period = value.hour >= 12 ? 'PM' : 'AM';
  const displayHour = value.hour % 12 || 12;
  const periodList = root.querySelector<HTMLElement>('.period-list');
  const hourList = root.querySelector<HTMLElement>('.hour-list');
  const minuteList = root.querySelector<HTMLElement>('.minute-list');
  if (!periodList || !hourList || !minuteList) return;

  initializeTimeOptions(periodList, 'period', ['AM', 'PM']);
  initializeTimeOptions(
    hourList,
    'hour',
    Array.from({ length: 12 }, (_item, index) => String(index + 1)),
  );
  initializeTimeOptions(
    minuteList,
    'minute',
    Array.from({ length: 60 }, (_item, minute) => String(minute)),
  );

  selectTimeOption(periodList, period, period === 'AM' ? 0 : 1, value, isDisabled);
  selectTimeOption(hourList, String(displayHour), displayHour - 1, value, isDisabled);
  selectTimeOption(minuteList, String(value.minute), value.minute, value, isDisabled);
}

export function updateTimePart(
  current: RgTimeParts,
  part: 'period' | 'hour' | 'minute',
  rawValue: string,
): RgTimeParts {
  if (part === 'minute') return { ...current, minute: Number(rawValue) };
  if (part === 'period') {
    const hour = (current.hour % 12) + (rawValue === 'PM' ? 12 : 0);
    return { ...current, hour };
  }
  const displayHour = Number(rawValue) % 12;
  return { ...current, hour: displayHour + (current.hour >= 12 ? 12 : 0) };
}

export function focusSelectedTimeOptions(root: ShadowRoot, animated = false): void {
  root.querySelectorAll<HTMLElement>('.time-column').forEach((column) => {
    const selected = column.querySelector<HTMLElement>('[aria-selected="true"]');
    if (selected) {
      const top = selected.offsetTop - (column.clientHeight - selected.offsetHeight) / 2;
      if (animated && typeof column.scrollTo === 'function') {
        column.scrollTo({ top, behavior: 'smooth' });
      } else {
        column.scrollTop = top;
      }
    }
  });
}

export function handleTimePickerKeyDown(
  root: ShadowRoot,
  target: HTMLButtonElement,
  key: string,
): boolean {
  if (
    !target.hasAttribute('data-time-part') ||
    !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)
  ) {
    return false;
  }
  const column = target.parentElement;
  const options = Array.from(column?.querySelectorAll<HTMLButtonElement>('[data-time-part]') ?? []);
  const current = options.indexOf(target);
  let next = current;
  if (key === 'ArrowUp') {
    for (let index = current - 1; index >= 0; index -= 1) {
      if (!options[index]?.disabled) {
        next = index;
        break;
      }
    }
  }
  if (key === 'ArrowDown') {
    for (let index = current + 1; index < options.length; index += 1) {
      if (!options[index]?.disabled) {
        next = index;
        break;
      }
    }
  }
  if (key === 'Home') next = options.findIndex((option) => !option.disabled);
  if (key === 'End') {
    next = -1;
    for (let index = options.length - 1; index >= 0; index -= 1) {
      if (!options[index]?.disabled) {
        next = index;
        break;
      }
    }
  }
  if (next < 0) return false;
  if (next === current) return false;

  options[next]?.click();
  queueMicrotask(() => {
    const part = target.dataset['timePart'];
    root
      .querySelector<HTMLElement>(
        `.${part === 'period' ? 'period' : part}-list [aria-selected="true"]`,
      )
      ?.focus();
  });
  return true;
}
