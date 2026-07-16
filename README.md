# Reglow

Reglow is a soft-kinetic design system built on the web platform. Use it directly from HTML or
through the official React 19 and Vue 3 adapters.

Explore the components, themes, and interaction states in the
[live Storybook](https://im-ian.github.io/reglow/).

## Highlights

- **Zero runtime dependencies in the core.** `@reglow/elements` and `@reglow/tokens` ship without
  third-party runtime packages. React and Vue support is provided through thin, optional adapters.
- **Built on web standards.** Components are autonomous Custom Elements composed from open Shadow
  DOM, slots, CSS custom properties, `::part`, `ElementInternals`, native controls, and composed DOM
  events. The same component implementation works with plain HTML and framework adapters.
- **Tree-shakable by component.** ESM module boundaries are preserved through the published build.
  React and Vue adapters register only the component exports retained by the consumer bundle, while
  full custom-element registration remains an explicit opt-in.

## Packages

| Package            | Purpose                                  | Runtime dependencies  |
| ------------------ | ---------------------------------------- | --------------------- |
| `@reglow/elements` | 51 standards-based Custom Elements       | None                  |
| `@reglow/tokens`   | Semantic tokens and global theme CSS     | None                  |
| `@reglow/react`    | Typed React components and event aliases | React peer + elements |
| `@reglow/vue`      | Vue components, `v-model`, and plugin    | Vue peer + elements   |

The core can be imported safely during SSR; v1 upgrades shadow content on the client.

## Quick start

### HTML and any framework

```ts
import '@reglow/elements/register';
import '@reglow/tokens/css';
```

```html
<rg-input label="Workspace name" placeholder="e.g. North star"></rg-input>
<rg-button variant="solid" tone="brand">Create workspace</rg-button>
```

### React 19

```tsx
import { Button, Dialog, Input } from '@reglow/react';
import '@reglow/tokens/css';

export function CreateWorkspace() {
  return (
    <Dialog title="Create workspace" trigger={<Button>New workspace</Button>}>
      <Input
        label="Workspace name"
        onValueChange={(event) => console.log(event.currentTarget.value)}
      />
    </Dialog>
  );
}
```

### Vue 3

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { RgButton, RgDialog, RgInput } from '@reglow/vue';
import '@reglow/tokens/css';

const name = ref('');
const open = ref(false);
</script>

<template>
  <RgDialog v-model="open">
    <template #trigger><RgButton>New workspace</RgButton></template>
    <template #title>Create workspace</template>
    <RgInput v-model="name" label="Workspace name" />
  </RgDialog>
</template>
```

Raw `<rg-*>` tags inside Vue templates require a compiler rule:

```ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('rg-'),
    },
  },
});
```

The PascalCase adapter components do not require that rule.

## Component families

- Foundation: Theme
- Actions: Button, Icon Button, Button Group, Copy Button, Link
- Forms: Input, Textarea, Select, Option, Combobox, Date Picker, Checkbox, Switch, Radio Group, Radio, Slider, Rating, Fieldset, Chip Group, Chip, Segmented Control, Segment
- Display: Badge, Avatar, Card, Divider, Kbd, Empty State, Relative Time
- Feedback: Alert, Progress, Progress Ring, Spinner, Skeleton, Toast Region, Toast
- Navigation: Tabs, Tab, Tab Panel, Accordion, Accordion Item, Breadcrumb, Breadcrumb Item, Pagination
- Overlays: Dialog, Drawer, Tooltip, Popover, Menu, Menu Item

Data Grid, Tree View, and File Upload remain outside core because their data and virtualization
contracts are better served by focused domain packages.

## Styling and theming

Reglow exposes semantic tokens rather than internal class names:

```css
.my-product {
  --rg-color-brand: #006e5b;
  --rg-color-brand-hover: #005b4c;
  --rg-radius-md: 1rem;
  --rg-duration-base: 160ms;
}

rg-button::part(base) {
  letter-spacing: 0.01em;
}
```

Use `mode="light|dark|system"` on `rg-theme`, or set `data-rg-theme` on an application boundary.
Motion respects `prefers-reduced-motion` and can also be reduced explicitly from the theme or
Storybook toolbar.

## Development

```bash
pnpm install
pnpm storybook
pnpm test
pnpm test:tree-shaking
pnpm typecheck
pnpm build
pnpm build:storybook
pnpm check
```

The canonical Storybook uses the Web Components renderer. React and Vue adapters are verified with
their framework test utilities so the library keeps one visual source of truth.

## Architecture

- Autonomous Custom Elements avoid customized-built-in compatibility gaps.
- Shadow DOM isolates component internals while CSS variables, slots, and `::part` remain public.
- Form controls use `ElementInternals` and internal native controls for FormData, validation, reset,
  labels, and keyboard behavior.
- Primitive values are reflected through attributes; live state also has typed properties.
- Public `rg-*` events bubble and cross the shadow boundary.
- Registration is explicit and idempotent through `@reglow/elements/register`.
- React and Vue adapters contain no component styling or behavior.

See [the v1 plan](./docs/ROADMAP.md) for scope and completion gates.
