# Astro

Reglow's core package is a set of standards-based Custom Elements, so Astro can render the tags
directly. No Astro integration or `client:*` directive is required. Register the elements from a
normal bundled `<script>` so registration runs in the browser, and import the token CSS from the
component or layout frontmatter.

## Install

```sh
pnpm add @reglow/elements @reglow/tokens
```

## Register the catalog

Put the imports in a shared layout when the site uses Reglow on several pages:

```astro
---
// src/layouts/AppLayout.astro
import '@reglow/tokens/css';
---

<html lang="en">
  <body>
    <slot />
  </body>
</html>

<script>
  import '@reglow/elements/register';
</script>
```

The script is processed by Astro, bundled as a module, and deduplicated when the layout or
component appears more than once. The package registration is idempotent, so sharing this layout
with other browser entry points is safe.

Use the elements as ordinary HTML in any `.astro` file:

```astro
---
import AppLayout from '../layouts/AppLayout.astro';
---

<AppLayout>
  <rg-input
    data-workspace-name
    label="Workspace name"
    placeholder="e.g. North star"
  ></rg-input>
  <rg-button data-create-workspace variant="solid" tone="brand">
    Create workspace
  </rg-button>
</AppLayout>

<script>
  import type { RgButtonElement, RgInputElement, RgPressDetail } from '@reglow/elements';

  const input = document.querySelector<RgInputElement>('[data-workspace-name]');
  const button = document.querySelector<RgButtonElement>('[data-create-workspace]');

  button?.addEventListener('rg-press', (event) => {
    const { pressed } = (event as CustomEvent<RgPressDetail>).detail;
    console.log({ name: input?.value ?? '', pressed });
  });
</script>
```

Reglow's public events bubble and cross the shadow boundary. Page-level event delegation is
therefore also available when many instances share the same behavior.

## Register only selected elements

The full registration entry includes all 51 elements. For a smaller client bundle, define only the
classes used by that browser entry:

```astro
<rg-button variant="soft">Create workspace</rg-button>

<script>
  import { defineElement } from '@reglow/elements';
  import { RgButtonElement } from '@reglow/elements/components/button';

  defineElement({
    tagName: RgButtonElement.tagName,
    constructor: RgButtonElement,
  });
</script>
```

Add every related element rendered by the page to the same entry. For example, markup containing
`<rg-select>` and `<rg-option>` needs both constructors when it uses selective registration.

## Pass complex values

Astro markup serializes attributes. Assign arrays, objects, and other live values as element
properties from a client script instead:

```astro
<rg-select data-region label="Region"></rg-select>

<script>
  import type { RgSelectElement, RgSelectOption } from '@reglow/elements';

  const options: readonly RgSelectOption[] = [
    { value: 'seoul', label: 'Seoul' },
    { value: 'london', label: 'London' },
  ];

  const select = document.querySelector<RgSelectElement>('[data-region]');
  if (select) select.options = options;
</script>
```

Primitive public values such as `label`, `variant`, and `disabled` can remain declarative
attributes.

## Client-side routing

With Astro's `<ClientRouter />`, bundled module scripts execute once. Custom Element definitions
remain registered for newly swapped-in markup, but listeners attached directly to old body nodes do
not. If a script queries page elements and attaches listeners, initialize it on `astro:page-load`:

```ts
document.addEventListener('astro:page-load', () => {
  document.querySelectorAll('rg-button[data-track]').forEach((button) => {
    if (button.hasAttribute('data-track-ready')) return;
    button.setAttribute('data-track-ready', '');
    button.addEventListener('rg-press', trackPress);
  });
});
```

Alternatively, install one delegated listener on `document`; it survives body swaps because Reglow
events are composed and bubbling.

See Astro's official documentation for [processed client scripts][astro-scripts] and
[`astro:page-load` with client-side routing][astro-router].

[astro-scripts]: https://docs.astro.build/en/guides/client-side-scripts/
[astro-router]: https://docs.astro.build/en/guides/view-transitions/#astro-page-load
