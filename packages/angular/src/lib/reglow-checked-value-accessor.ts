import { Directive, ElementRef, Renderer2, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import type { ControlValueAccessor } from '@angular/forms';

type ReglowCheckedElement = HTMLElement & {
  checked: boolean;
  disabled: boolean;
};

type ChangeCallback = (value: boolean) => void;
type TouchedCallback = () => void;

const noopChange: ChangeCallback = () => undefined;
const noopTouched: TouchedCallback = () => undefined;

@Directive({
  selector:
    'rg-checkbox[formControlName],rg-checkbox[formControl],rg-checkbox[ngModel],rg-switch[formControlName],rg-switch[formControl],rg-switch[ngModel]',
  standalone: true,
  host: {
    '(blur)': 'handleBlur()',
    '(change)': 'handleChange()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReglowCheckedValueAccessor),
      multi: true,
    },
  ],
})
export class ReglowCheckedValueAccessor implements ControlValueAccessor {
  readonly #element = inject<ElementRef<ReglowCheckedElement>>(ElementRef).nativeElement;
  readonly #renderer = inject(Renderer2);
  #onChange: ChangeCallback = noopChange;
  #onTouched: TouchedCallback = noopTouched;

  writeValue(value: unknown): void {
    this.#renderer.setProperty(this.#element, 'checked', Boolean(value));
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

  handleChange(): void {
    this.#onChange(this.#element.checked);
  }

  handleBlur(): void {
    this.#onTouched();
  }
}
