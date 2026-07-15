# @reglow/elements

Framework-neutral Reglow Custom Elements with no external runtime dependencies.

```ts
import '@reglow/elements/register';
import '@reglow/tokens/css';
```

Importing `@reglow/elements` exposes element classes and public types without registering tags.
Import `@reglow/elements/register` once at the browser boundary for explicit, idempotent
registration. Tooling metadata is available from `@reglow/elements/custom-elements.json`.

The package preserves ESM module boundaries so named imports can be tree-shaken. Component modules
are also available as explicit subpaths when an application wants the narrowest possible import:

```ts
import { defineElement } from '@reglow/elements';
import { RgButtonElement } from '@reglow/elements/components/button';

defineElement({ tagName: RgButtonElement.tagName, constructor: RgButtonElement });
```

`@reglow/elements/register` intentionally registers all elements and therefore includes the full
component catalog.

See the repository README for component scope, theming, and development instructions.
