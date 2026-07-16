import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type {
  RgCheckboxElement,
  RgChipGroupElement,
  RgInputElement,
  RgSliderElement,
} from '@reglow/elements';
import '@reglow/elements/register';
import { REGLOW_FORM_DIRECTIVES } from '../src/public-api.js';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, REGLOW_FORM_DIRECTIVES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <form [formGroup]="form">
      <rg-input formControlName="input" />
    </form>
    <rg-textarea [ngModel]="modelText" [ngModelOptions]="{ standalone: true }" />
    <rg-select [formControl]="controls.select" />
    <rg-radio-group [formControl]="controls.radioGroup" />
    <rg-slider [formControl]="controls.slider" />
    <rg-combobox [formControl]="controls.combobox" />
    <rg-date-picker [formControl]="controls.datePicker" />
    <rg-time-picker [formControl]="controls.timePicker" />
    <rg-date-time-picker [formControl]="controls.dateTimePicker" />
    <rg-chip-group [formControl]="controls.chipGroup" />
    <rg-segmented-control [formControl]="controls.segmentedControl" />
    <rg-rating [formControl]="controls.rating" />
    <rg-checkbox [formControl]="controls.checkbox" />
    <rg-switch [ngModel]="modelSwitch" [ngModelOptions]="{ standalone: true }" />
  `,
})
class SelectorHost {
  readonly form = new FormGroup({ input: new FormControl('') });
  readonly modelText = '';
  readonly modelSwitch = false;
  readonly controls = {
    select: new FormControl(''),
    radioGroup: new FormControl(''),
    slider: new FormControl(0),
    combobox: new FormControl(''),
    datePicker: new FormControl(''),
    timePicker: new FormControl(''),
    dateTimePicker: new FormControl(''),
    chipGroup: new FormControl<readonly string[]>([]),
    segmentedControl: new FormControl(''),
    rating: new FormControl(0),
    checkbox: new FormControl(false),
  };
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, REGLOW_FORM_DIRECTIVES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <rg-input data-control="input" [formControl]="text" />
    <rg-slider data-control="slider" [formControl]="amount" />
    <rg-chip-group data-control="chips" selection="multiple" [formControl]="chips" />
    <rg-checkbox data-control="checkbox" [formControl]="checked" />
  `,
})
class BehaviorHost {
  readonly text = new FormControl('initial', { nonNullable: true });
  readonly amount = new FormControl(2, { nonNullable: true });
  readonly chips = new FormControl<readonly string[]>([], { nonNullable: true });
  readonly checked = new FormControl(false, { nonNullable: true });
}

describe('@reglow/angular value accessors', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectorHost, BehaviorHost],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.replaceChildren();
  });

  it('matches every supported Reglow form element', () => {
    expect(() => {
      const fixture = TestBed.createComponent(SelectorHost);
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('writes model values and disabled state to element properties', () => {
    const fixture = TestBed.createComponent(BehaviorHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('[data-control="input"]') as RgInputElement;
    const slider = fixture.nativeElement.querySelector(
      '[data-control="slider"]',
    ) as RgSliderElement;
    const checkbox = fixture.nativeElement.querySelector(
      '[data-control="checkbox"]',
    ) as RgCheckboxElement;

    expect(input.value).toBe('initial');
    expect(slider.value).toBe(2);
    expect(checkbox.checked).toBe(false);

    host.text.setValue('updated');
    host.amount.setValue(7);
    host.checked.disable();
    fixture.detectChanges();

    expect(input.value).toBe('updated');
    expect(slider.value).toBe(7);
    expect(checkbox.disabled).toBe(true);

    host.checked.enable();
    fixture.detectChanges();
    expect(checkbox.disabled).toBe(false);
  });

  it('preserves string, number, array, and boolean values from host events', () => {
    const fixture = TestBed.createComponent(BehaviorHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('[data-control="input"]') as RgInputElement;
    const slider = fixture.nativeElement.querySelector(
      '[data-control="slider"]',
    ) as RgSliderElement;
    const chips = fixture.nativeElement.querySelector(
      '[data-control="chips"]',
    ) as RgChipGroupElement;
    const checkbox = fixture.nativeElement.querySelector(
      '[data-control="checkbox"]',
    ) as RgCheckboxElement;

    input.value = 'typed';
    input.dispatchEvent(new Event('input'));
    slider.value = 9;
    slider.dispatchEvent(new Event('input'));
    chips.value = ['alpha', 'beta'];
    chips.dispatchEvent(new Event('input'));
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(host.text.value).toBe('typed');
    expect(host.amount.value).toBe(9);
    expect(host.chips.value).toEqual(['alpha', 'beta']);
    expect(host.checked.value).toBe(true);
  });

  it('marks a control touched when its element blurs', () => {
    const fixture = TestBed.createComponent(BehaviorHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('[data-control="input"]') as RgInputElement;

    expect(host.text.touched).toBe(false);
    input.dispatchEvent(new FocusEvent('blur'));
    expect(host.text.touched).toBe(true);
  });
});
