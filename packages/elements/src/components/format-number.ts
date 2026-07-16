import { ReglowElement } from '../core/reglow-element.js';

export type RgFormatNumberType = 'decimal' | 'currency' | 'percent';
export type RgFormatNumberCurrencyDisplay = 'symbol' | 'narrowSymbol' | 'code' | 'name';

const numberTypes = new Set<RgFormatNumberType>(['decimal', 'currency', 'percent']);
const currencyDisplays = new Set<RgFormatNumberCurrencyDisplay>([
  'symbol',
  'narrowSymbol',
  'code',
  'name',
]);

export class RgFormatNumberElement extends ReglowElement {
  static readonly tagName = 'rg-format-number' as const;
  static readonly delegatesFocus = false;
  static readonly observedAttributes = [
    'currency',
    'currency-display',
    'lang',
    'locale',
    'maximum-fraction-digits',
    'maximum-significant-digits',
    'minimum-fraction-digits',
    'minimum-integer-digits',
    'minimum-significant-digits',
    'type',
    'value',
    'without-grouping',
  ] as const;
  static readonly template = '<span class="output" part="base number"></span>';
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

  get type(): RgFormatNumberType {
    const value = this.getString('type', 'decimal') as RgFormatNumberType;
    return numberTypes.has(value) ? value : 'decimal';
  }

  set type(value: RgFormatNumberType) {
    this.setString('type', numberTypes.has(value) && value !== 'decimal' ? value : null);
  }

  get currency(): string {
    return this.getString('currency', 'USD');
  }

  set currency(value: string) {
    this.setString('currency', value);
  }

  get currencyDisplay(): RgFormatNumberCurrencyDisplay {
    const value = this.getString('currency-display', 'symbol') as RgFormatNumberCurrencyDisplay;
    return currencyDisplays.has(value) ? value : 'symbol';
  }

  set currencyDisplay(value: RgFormatNumberCurrencyDisplay) {
    this.setString(
      'currency-display',
      currencyDisplays.has(value) && value !== 'symbol' ? value : null,
    );
  }

  get minimumIntegerDigits(): number | undefined {
    return this.#numberOption('minimum-integer-digits', 1, 21);
  }

  set minimumIntegerDigits(value: number | undefined) {
    this.setNumber('minimum-integer-digits', value);
  }

  get minimumFractionDigits(): number | undefined {
    return this.#numberOption('minimum-fraction-digits', 0, 100);
  }

  set minimumFractionDigits(value: number | undefined) {
    this.setNumber('minimum-fraction-digits', value);
  }

  get maximumFractionDigits(): number | undefined {
    return this.#numberOption('maximum-fraction-digits', 0, 100);
  }

  set maximumFractionDigits(value: number | undefined) {
    this.setNumber('maximum-fraction-digits', value);
  }

  get minimumSignificantDigits(): number | undefined {
    return this.#numberOption('minimum-significant-digits', 1, 21);
  }

  set minimumSignificantDigits(value: number | undefined) {
    this.setNumber('minimum-significant-digits', value);
  }

  get maximumSignificantDigits(): number | undefined {
    return this.#numberOption('maximum-significant-digits', 1, 21);
  }

  set maximumSignificantDigits(value: number | undefined) {
    this.setNumber('maximum-significant-digits', value);
  }

  get withoutGrouping(): boolean {
    return this.getBoolean('without-grouping');
  }

  set withoutGrouping(value: boolean) {
    this.setBoolean('without-grouping', value);
  }

  protected update(): void {
    const output = this.query<HTMLElement>('.output');
    const options: Intl.NumberFormatOptions = {
      style: this.type,
      currency: this.type === 'currency' ? this.currency : undefined,
      currencyDisplay: this.currencyDisplay,
      useGrouping: !this.withoutGrouping,
      minimumIntegerDigits: this.minimumIntegerDigits,
      minimumFractionDigits: this.minimumFractionDigits,
      maximumFractionDigits: this.maximumFractionDigits,
      minimumSignificantDigits: this.minimumSignificantDigits,
      maximumSignificantDigits: this.maximumSignificantDigits,
    };

    try {
      output.textContent = new Intl.NumberFormat(this.locale, options).format(this.value);
    } catch {
      output.textContent = String(this.value);
    }
  }

  #numberOption(name: string, minimum: number, maximum: number): number | undefined {
    if (!this.hasAttribute(name)) return undefined;
    const value = Number(this.getAttribute(name));
    if (!Number.isFinite(value)) return undefined;
    return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
  }
}
