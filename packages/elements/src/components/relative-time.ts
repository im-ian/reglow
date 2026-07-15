import { ReglowElement } from '../core/reglow-element.js';

export type RgRelativeTimeFormat = 'long' | 'short' | 'narrow';
export type RgRelativeTimeNumeric = 'always' | 'auto';

const units = [
  ['year', 31_536_000],
  ['month', 2_629_800],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
  ['second', 1],
] as const satisfies readonly (readonly [Intl.RelativeTimeFormatUnit, number])[];

export class RgRelativeTimeElement extends ReglowElement {
  static readonly tagName = 'rg-relative-time' as const;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = [
    'date',
    'format',
    'lang',
    'locale',
    'numeric',
    'sync',
  ] as const;
  static readonly template = '<time part="base time"></time>';
  static readonly styles = ':host { display: inline; } time { font: inherit; color: inherit; }';

  #syncTimer = 0;

  get date(): string {
    return this.getString('date');
  }

  set date(value: string | Date) {
    this.setString('date', value instanceof Date ? value.toISOString() : value);
  }

  get locale(): string {
    return this.getString('locale') || this.lang || document.documentElement.lang || 'en';
  }

  set locale(value: string) {
    this.setString('locale', value);
  }

  get format(): RgRelativeTimeFormat {
    const value = this.getString('format', 'long');
    return value === 'short' || value === 'narrow' ? value : 'long';
  }

  set format(value: RgRelativeTimeFormat) {
    this.setString('format', value === 'long' ? null : value);
  }

  get numeric(): RgRelativeTimeNumeric {
    return this.getString('numeric', 'always') === 'auto' ? 'auto' : 'always';
  }

  set numeric(value: RgRelativeTimeNumeric) {
    this.setString('numeric', value === 'always' ? null : value);
  }

  get sync(): boolean {
    return this.getBoolean('sync');
  }

  set sync(value: boolean) {
    this.setBoolean('sync', value);
  }

  protected onConnect(signal: AbortSignal): void {
    this.#syncTimerState();
    signal.addEventListener('abort', () => this.#clearTimer(), { once: true });
  }

  protected onDisconnect(): void {
    this.#clearTimer();
  }

  protected update(): void {
    const time = this.query<HTMLTimeElement>('time');
    const parsed = new Date(this.date);
    if (!this.date || Number.isNaN(parsed.getTime())) {
      time.removeAttribute('datetime');
      time.removeAttribute('title');
      time.textContent = '—';
      this.#syncTimerState();
      return;
    }

    const seconds = (parsed.getTime() - Date.now()) / 1000;
    let unitIndex = units.findIndex(([, size]) => Math.abs(seconds) >= size);
    if (unitIndex === -1) unitIndex = units.length - 1;

    let [unit, divisor] = units[unitIndex]!;
    let amount = Math.round(seconds / divisor);

    // Promote rounded boundary values so a time just shy of 24 hours does not
    // render as the awkward "in 24 hours" instead of "tomorrow".
    if (unitIndex > 0) {
      const [largerUnit, largerDivisor] = units[unitIndex - 1]!;
      const rollover = largerDivisor / divisor;
      if (Math.abs(amount) >= rollover) {
        unit = largerUnit;
        divisor = largerDivisor;
        amount = Math.round(seconds / divisor);
      }
    }

    try {
      time.textContent = new Intl.RelativeTimeFormat(this.locale, {
        numeric: this.numeric,
        style: this.format,
      }).format(amount, unit);
      time.title = new Intl.DateTimeFormat(this.locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(parsed);
    } catch {
      time.textContent = parsed.toISOString();
      time.removeAttribute('title');
    }
    time.dateTime = parsed.toISOString();
    this.#syncTimerState();
  }

  #syncTimerState(): void {
    if (!this.isConnected || !this.sync) {
      this.#clearTimer();
      return;
    }
    if (this.#syncTimer) return;
    this.#syncTimer = window.setInterval(() => this.update(), 60_000);
  }

  #clearTimer(): void {
    if (this.#syncTimer) window.clearInterval(this.#syncTimer);
    this.#syncTimer = 0;
  }
}
