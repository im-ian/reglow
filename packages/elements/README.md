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

`@reglow/elements/register` is an opt-in convenience entry that registers the complete 62-element
catalog. Use it only when that browser entry intentionally needs the full catalog; it cannot remove
unused elements because importing it makes every registration observable.

## State ownership

Form-control properties such as `value` and `checked` represent live state. Controls that permit an
empty selection preserve an explicit `value=""`; `null` and `undefined` are never serialized as the
literal strings `"null"` or `"undefined"`. Form reset restores the value captured when the element
first connects, so the reflected live attribute is not a separate native-style `defaultValue` API.

Groups own their current selection after initialization. Child `open`, `checked`, or `selected`
attributes can seed the initial group value, but later child drift is reconciled from the group's
`value`. Tabs and segmented controls keep their exactly-one-selection invariant and normalize empty
or unmatched values.

Overlay interactions follow one lifecycle contract:

1. `rg-before-open` or `rg-before-close` fires while `open` still has its previous value. The event
   is cancelable.
2. If accepted, the element commits its `open` state and native DOM effects.
3. `rg-open-change` fires as a non-cancelable post-change notification.

Direct `element.open = ...` or attribute assignment is an authoritative state commit and does not
emit request or `rg-open-change` events. This keeps framework property synchronization from creating
event loops.

See the repository README for component scope, theming, and development instructions.
