import { Directive, ElementRef, Renderer2, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ControlValueAccessor } from '@angular/forms';

type ReglowValueElement = HTMLElement & {
  disabled: boolean;
  value: unknown;
};

type ChangeCallback = (value: unknown) => void;
type TouchedCallback = () => void;

const noopChange: ChangeCallback = () => undefined;
const noopTouched: TouchedCallback = () => undefined;

@Directive({
  selector:
    'rg-input[formControlName],rg-input[formControl],rg-input[ngModel],rg-textarea[formControlName],rg-textarea[formControl],rg-textarea[ngModel],rg-select[formControlName],rg-select[formControl],rg-select[ngModel],rg-radio-group[formControlName],rg-radio-group[formControl],rg-radio-group[ngModel],rg-slider[formControlName],rg-slider[formControl],rg-slider[ngModel],rg-combobox[formControlName],rg-combobox[formControl],rg-combobox[ngModel],rg-date-picker[formControlName],rg-date-picker[formControl],rg-date-picker[ngModel],rg-time-picker[formControlName],rg-time-picker[formControl],rg-time-picker[ngModel],rg-date-time-picker[formControlName],rg-date-time-picker[formControl],rg-date-time-picker[ngModel],rg-chip-group[formControlName],rg-chip-group[formControl],rg-chip-group[ngModel],rg-segmented-control[formControlName],rg-segmented-control[formControl],rg-segmented-control[ngModel],rg-rating[formControlName],rg-rating[formControl],rg-rating[ngModel]',
  standalone: true,
  host: {
    '(blur)': 'handleBlur()',
    '(input)': 'handleInput()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReglowValueAccessor),
      multi: true,
    },
  ],
})
export class ReglowValueAccessor implements ControlValueAccessor {
  readonly #element = inject<ElementRef<ReglowValueElement>>(ElementRef).nativeElement;
  readonly #renderer = inject(Renderer2);
  #onChange: ChangeCallback = noopChange;
  #onTouched: TouchedCallback = noopTouched;

  writeValue(value: unknown): void {
    this.#renderer.setProperty(this.#element, 'value', value ?? '');
  }

  registerOnChange(callback: ChangeCallback): void {
    this.#onChange = callback;
  }

  registerOnTouched(callback: TouchedCallback): void {
    this.#onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.#renderer.setProperty(this.#element, 'disabled', disabled);
  }

  handleInput(): void {
    this.#onChange(this.#element.value);
  }

  handleBlur(): void {
    this.#onTouched();
  }
}
