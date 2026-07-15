# @reglow/elements

Framework-neutral Reglow Custom Elements with no external runtime dependencies.

```ts
import '@reglow/elements/register';
import '@reglow/tokens/css';
```

Importing `@reglow/elements` exposes element classes and public types without registering tags.
Import `@reglow/elements/register` once at the browser boundary for explicit, idempotent
registration. Tooling metadata is available from `@reglow/elements/custom-elements.json`.

See the repository README for component scope, theming, and development instructions.
