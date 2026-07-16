# Reglow framework examples

These are complete, runnable applications showing the same “Northstar Launch Room” workflow in
five supported framework integrations. Every app uses real Reglow form state, complex properties,
custom events, and production builds.

| Example   | Integration shown                                                 |
| --------- | ----------------------------------------------------------------- |
| `preact`  | Typed native `rg-*` JSX, refs, properties, and `onrg-press`       |
| `svelte`  | `@reglow/svelte` components, bindings, and callback props         |
| `lit`     | Native elements with Lit property, boolean, and event expressions |
| `astro`   | Server-rendered markup with a bundled browser enhancement script  |
| `angular` | Reactive Forms through `@reglow/angular` value accessors          |

Install once at the repository root, then start any example:

```bash
pnpm install
pnpm --filter @reglow/example-preact dev
pnpm --filter @reglow/example-svelte dev
pnpm --filter @reglow/example-lit dev
pnpm --filter @reglow/example-astro dev
pnpm --filter @reglow/example-angular dev
```

Run one production build with `pnpm --filter <package-name> build`, or validate the complete set:

```bash
pnpm build:examples
pnpm test:examples
```

Angular 22 requires Node `^22.22.3 || ^24.15.0 || >=26.0.0`, matching the repository engine
constraint.
