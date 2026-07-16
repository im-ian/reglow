# @reglow/elements

Framework-neutral Reglow Custom Elements with no external runtime dependencies.

```ts
import { defineElements } from '@reglow/elements';
import { RgButtonElement } from '@reglow/elements/components/button';
import { RgInputElement } from '@reglow/elements/components/input';
import '@reglow/tokens/css';

defineElements([
  { tagName: RgButtonElement.tagName, constructor: RgButtonElement },
  { tagName: RgInputElement.tagName, constructor: RgInputElement },
]);
```

Importing `@reglow/elements` exposes element classes and public types without registering tags.
Register only the constructors rendered by each browser entry. Registration is explicit and
idempotent, and component subpath imports give bundlers the narrowest module graph. Tooling metadata
is available from `@reglow/elements/custom-elements.json`.

The package preserves ESM module boundaries so unused component modules can be tree-shaken.
`defineElement` is also available for a single constructor:

```ts
import { defineElement } from '@reglow/elements';
import { RgButtonElement } from '@reglow/elements/components/button';

defineElement({ tagName: RgButtonElement.tagName, constructor: RgButtonElement });
```

`@reglow/elements/register` is an opt-in convenience entry that registers the complete 57-element
catalog. Use it only when that browser entry intentionally needs the full catalog; it cannot remove
unused elements because importing it makes every registration observable.

See the repository README for component scope, theming, and development instructions.
