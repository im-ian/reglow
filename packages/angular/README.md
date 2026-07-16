# @reglow/angular

Angular 22 Forms support for Reglow Custom Elements. This package supplies standalone
`ControlValueAccessor` directives; the elements stay native Custom Elements and keep their existing
DOM API.

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ReglowCheckedValueAccessor, ReglowValueAccessor } from '@reglow/angular';
import { defineElements } from '@reglow/elements';
import { RgInputElement } from '@reglow/elements/components/input';
import { RgSwitchElement } from '@reglow/elements/components/switch';
import '@reglow/tokens/css';

defineElements([
  { tagName: RgInputElement.tagName, constructor: RgInputElement },
  { tagName: RgSwitchElement.tagName, constructor: RgSwitchElement },
]);

@Component({
  selector: 'app-workspace-form',
  standalone: true,
  imports: [ReactiveFormsModule, ReglowValueAccessor, ReglowCheckedValueAccessor],
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

The standalone accessors support `[formControl]`, `formControlName`, and `ngModel` on these
elements:

- Value controls: input, textarea, select, radio group, slider, combobox, date picker, time picker,
  date time picker, chip group,
  segmented control, and rating.
- Checked controls: checkbox and switch.

Value controls update Angular from their `input` event without converting the element's value, so
numbers and multi-selection arrays retain their runtime type. Checked controls update from
`change`. Both accessors synchronize `disabled` and mark the Angular control touched on `blur`.

Import only `ReglowValueAccessor` or `ReglowCheckedValueAccessor` when a component uses one control
category, allowing Angular's production linker and optimizer to remove the other directive.
`REGLOW_FORM_DIRECTIVES` is a convenience array for components that need both categories.

The directives do not register elements. Import constructors from
`@reglow/elements/components/*` and register only the tags used by the browser entry so the client
bundler can remove unused elements.
`@reglow/elements/register` remains an explicit convenience opt-in for entries that need the
complete 60-element catalog. Angular validators also remain explicit: this bridge does not
translate the Custom Element's `ElementInternals.validity` into Angular validator errors.
