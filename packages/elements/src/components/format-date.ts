import { ReglowElement } from '../core/reglow-element.js';

export type RgFormatDateNumeric = 'numeric' | '2-digit';
export type RgFormatDateText = 'narrow' | 'short' | 'long';
export type RgFormatDateMonth = RgFormatDateNumeric | RgFormatDateText;
export type RgFormatDateHourFormat = 'auto' | '12' | '24';

const numericFormats = new Set<RgFormatDateNumeric>(['numeric', '2-digit']);
const textFormats = new Set<RgFormatDateText>(['narrow', 'short', 'long']);
const monthFormats = new Set<RgFormatDateMonth>(['numeric', '2-digit', 'narrow', 'short', 'long']);

export class RgFormatDateElement extends ReglowElement {
  static readonly tagName = 'rg-format-date' as const;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = [
    'date',
    'day',
    'era',
    'hour',
    'hour-format',
    'lang',
    'locale',
    'minute',
    'month',
    'second',
    'time-zone',
    'time-zone-name',
    'weekday',
    'year',
  ] as const;
  static readonly template = '<time part="base time"></time>';
  static readonly styles = ':host { display: inline; } time { color: inherit; font: inherit; }';

  get date(): string {
    return this.getString('date');
  }

  set date(value: string | Date) {
    this.setString('date', value instanceof Date ? value.toISOString() : value);
  }

  get locale(): string {
    const documentLanguage = typeof document === 'undefined' ? '' : document.documentElement.lang;
    return this.getString('locale') || this.lang || documentLanguage || 'en';
  }

  set locale(value: string) {
    this.setString('locale', value);
  }

  get weekday(): RgFormatDateText | undefined {
    return this.#textOption('weekday');
  }

  set weekday(value: RgFormatDateText | undefined) {
    this.setString('weekday', value);
  }

  get era(): RgFormatDateText | undefined {
    return this.#textOption('era');
  }

  set era(value: RgFormatDateText | undefined) {
    this.setString('era', value);
  }

  get year(): RgFormatDateNumeric | undefined {
    return this.#numericOption('year');
  }

  set year(value: RgFormatDateNumeric | undefined) {
    this.setString('year', value);
  }

  get month(): RgFormatDateMonth | undefined {
    const value = this.getAttribute('month') as RgFormatDateMonth | null;
    return value && monthFormats.has(value) ? value : undefined;
  }

  set month(value: RgFormatDateMonth | undefined) {
    this.setString('month', value);
  }

  get day(): RgFormatDateNumeric | undefined {
    return this.#numericOption('day');
  }

  set day(value: RgFormatDateNumeric | undefined) {
    this.setString('day', value);
  }

  get hour(): RgFormatDateNumeric | undefined {
    return this.#numericOption('hour');
  }

  set hour(value: RgFormatDateNumeric | undefined) {
    this.setString('hour', value);
  }

  get minute(): RgFormatDateNumeric | undefined {
    return this.#numericOption('minute');
  }

  set minute(value: RgFormatDateNumeric | undefined) {
    this.setString('minute', value);
  }

  get second(): RgFormatDateNumeric | undefined {
    return this.#numericOption('second');
  }

  set second(value: RgFormatDateNumeric | undefined) {
    this.setString('second', value);
  }

  get timeZone(): string {
    return this.getString('time-zone');
  }

  set timeZone(value: string) {
    this.setString('time-zone', value);
  }

  get timeZoneName(): 'short' | 'long' | undefined {
    const value = this.getAttribute('time-zone-name');
    return value === 'short' || value === 'long' ? value : undefined;
  }

  set timeZoneName(value: 'short' | 'long' | undefined) {
    this.setString('time-zone-name', value);
  }

  get hourFormat(): RgFormatDateHourFormat {
    const value = this.getString('hour-format', 'auto');
    return value === '12' || value === '24' ? value : 'auto';
  }

  set hourFormat(value: RgFormatDateHourFormat) {
    this.setString('hour-format', value === 'auto' ? null : value);
  }

  protected update(): void {
    const time = this.query<HTMLTimeElement>('time');
    const parsed = this.date ? new Date(this.date) : new Date();

    if (Number.isNaN(parsed.getTime())) {
      time.textContent = '—';
      time.removeAttribute('datetime');
      return;
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: this.weekday,
      era: this.era,
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      timeZone: this.timeZone || undefined,
      timeZoneName: this.timeZoneName,
      hour12: this.hourFormat === 'auto' ? undefined : this.hourFormat === '12',
    };

    try {
      time.textContent = new Intl.DateTimeFormat(this.locale, options).format(parsed);
    } catch {
      time.textContent = parsed.toISOString();
    }
    time.dateTime = parsed.toISOString();
  }

  #numericOption(name: string): RgFormatDateNumeric | undefined {
    const value = this.getAttribute(name) as RgFormatDateNumeric | null;
    return value && numericFormats.has(value) ? value : undefined;
  }

  #textOption(name: string): RgFormatDateText | undefined {
    const value = this.getAttribute(name) as RgFormatDateText | null;
    return value && textFormats.has(value) ? value : undefined;
  }
}
