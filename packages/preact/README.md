# @reglow/preact

Typed Preact JSX integration for Reglow Custom Elements. Preact already forwards custom-element
properties and native custom events, so this package adds compile-time element, property, ref, and
event types without adding an adapter runtime.

```tsx
/** @jsxImportSource preact */
import '@reglow/elements/register';
import '@reglow/preact';
import '@reglow/tokens/css';

export function Example() {
  return (
    <rg-button variant="soft" onrg-press={(event) => console.log(event.detail.pressed)}>
      Create workspace
    </rg-button>
  );
}
```

Importing `@reglow/preact` is runtime-empty and only activates its Preact JSX declarations. Import
individual constructors from `@reglow/elements/components/*` when an application wants selected
registration instead of the complete `@reglow/elements/register` entry.
