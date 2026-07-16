# @reglow/preact

Typed Preact JSX integration for Reglow Custom Elements. Preact already forwards custom-element
properties and native custom events, so this package adds compile-time element, property, ref, and
event types without adding an adapter runtime.

```tsx
/** @jsxImportSource preact */
import { defineElements } from '@reglow/elements';
import { RgButtonElement } from '@reglow/elements/components/button';
import '@reglow/preact';
import '@reglow/tokens/css';

defineElements([{ tagName: RgButtonElement.tagName, constructor: RgButtonElement }]);

export function Example() {
  return (
    <rg-button variant="soft" onrg-press={(event) => console.log(event.detail.pressed)}>
      Create workspace
    </rg-button>
  );
}
```

Importing `@reglow/preact` is runtime-empty and only activates its Preact JSX declarations. Import
individual constructors from `@reglow/elements/components/*` and register only the tags rendered by
the browser entry so unused elements remain tree-shakable. `@reglow/elements/register` is an
explicit convenience opt-in for entries that need all 57 elements.
