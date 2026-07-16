# @reglow/angular

Angular 22 Forms support for Reglow Custom Elements. This package supplies standalone
`ControlValueAccessor` directives; the elements stay native Custom Elements and keep their existing
DOM API.

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { REGLOW_FORM_DIRECTIVES } from '@reglow/angular';
import '@reglow/elements/register';
import '@reglow/tokens/css';

@Component({
  selector: 'app-workspace-form',
  standalone: true,
  imports: [ReactiveFormsModule, ...REGLOW_FORM_DIRECTIVES],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <rg-input label="Workspace name" [formControl]="name" />
    <rg-switch label="Private" [formControl]="isPrivate" />
  `,
})
export class WorkspaceForm {
  readonly name = new FormControl('', { nonNullable: true });
  readonly isPrivate = new FormControl(false, { nonNullable: true });
}
```

`REGLOW_FORM_DIRECTIVES` supports `[formControl]`, `formControlName`, and `ngModel` on these
elements:

- Value controls: input, textarea, select, radio group, slider, combobox, date picker, chip group,
  segmented control, and rating.
- Checked controls: checkbox and switch.

Value controls update Angular from their `input` event without converting the element's value, so
numbers and multi-selection arrays retain their runtime type. Checked controls update from
`change`. Both accessors synchronize `disabled` and mark the Angular control touched on `blur`.

The directives do not register elements. Import `@reglow/elements/register` once, or selectively
register the constructors used by the application. Angular validators also remain explicit: this
bridge does not translate the Custom Element's `ElementInternals.validity` into Angular validator
errors.
