# Reglow + Angular example

An Angular 22 launch-settings app that uses Reglow Custom Elements as native Reactive Forms
controls.

```bash
pnpm --filter @reglow/example-angular dev
```

The example demonstrates:

- `REGLOW_FORM_DIRECTIVES` with `formControlName` for value and checked controls;
- `[options]` property binding with a complex `RgSelectOption[]` value;
- numeric values flowing from `rg-rating` into the Angular form without string coercion;
- a real form submission initiated by `rg-button`, including its cancelable `rg-press` event; and
- live preview state driven by the same `FormGroup` values.

The Custom Elements are registered once in `src/main.ts`, while the Angular Forms bridge is added
to the standalone component's `imports`.
