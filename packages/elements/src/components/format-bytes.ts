import { ReglowElement } from '../core/reglow-element.js';

export type RgFormatBytesUnit = 'byte' | 'bit';
export type RgFormatBytesDisplay = 'long' | 'short' | 'narrow';

const byteUnits = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'] as const;
const bitUnits = ['bit', 'kilobit', 'megabit', 'gigabit', 'terabit', 'petabit'] as const;

export class RgFormatBytesElement extends ReglowElement {
  static readonly tagName = 'rg-format-bytes' as const;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = ['display', 'lang', 'locale', 'unit', 'value'] as const;
  static readonly template = '<span class="output" part="base value"></span>';
  static readonly styles =
    ':host { display: inline; } span { color: inherit; font: inherit; font-variant-numeric: tabular-nums; }';

  get value(): number {
    return this.getNumber('value', 0);
  }

  set value(value: number) {
    this.setNumber('value', value);
  }

  get locale(): string {
    const documentLanguage = typeof document === 'undefined' ? '' : document.documentElement.lang;
    return this.getString('locale') || this.lang || documentLanguage || 'en';
  }

  set locale(value: string) {
    this.setString('locale', value);
  }

  get unit(): RgFormatBytesUnit {
    return this.getString('unit') === 'bit' ? 'bit' : 'byte';
  }

  set unit(value: RgFormatBytesUnit) {
    this.setString('unit', value === 'byte' ? null : value);
  }

  get display(): RgFormatBytesDisplay {
    const value = this.getString('display', 'short');
    return value === 'long' || value === 'narrow' ? value : 'short';
  }

  set display(value: RgFormatBytesDisplay) {
    this.setString('display', value === 'short' ? null : value);
  }

  protected update(): void {
    const output = this.query<HTMLElement>('.output');
    const units = this.unit === 'bit' ? bitUnits : byteUnits;
    const absoluteValue = Math.abs(this.value);
    const unitIndex =
      absoluteValue < 1
        ? 0
        : Math.min(units.length - 1, Math.floor(Math.log(absoluteValue) / Math.log(1000)));
    const scaledValue = this.value / 1000 ** unitIndex;

    try {
      output.textContent = new Intl.NumberFormat(this.locale, {
        style: 'unit',
        unit: units[unitIndex],
        unitDisplay: this.display,
        maximumFractionDigits: 2,
      }).format(scaledValue);
    } catch {
      output.textContent = `${new Intl.NumberFormat(this.locale, {
        maximumFractionDigits: 2,
      }).format(scaledValue)} ${units[unitIndex]}`;
    }
  }
}
