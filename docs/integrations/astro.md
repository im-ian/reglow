# Astro

Reglow's core package is a set of standards-based Custom Elements, so Astro can render the tags
directly. No Astro integration or `client:*` directive is required. Register the elements from a
normal bundled `<script>` so registration runs in the browser, and import the token CSS from the
component or layout frontmatter.

## Install

```sh
pnpm add @reglow/elements @reglow/tokens
```

## Register selected elements

Put the selected registrations in a shared layout when several pages render the same Reglow tags:

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
  import { defineElements } from '@reglow/elements';
  import { RgButtonElement } from '@reglow/elements/components/button';
  import { RgInputElement } from '@reglow/elements/components/input';

  defineElements([
    { tagName: RgButtonElement.tagName, constructor: RgButtonElement },
    { tagName: RgInputElement.tagName, constructor: RgInputElement },
  ]);
</script>
```

The script is processed by Astro, bundled as a module, and deduplicated when the layout or
component appears more than once. Registration is idempotent, so sharing this layout with other
browser entry points is safe. Component subpath imports let the client bundler remove the rest of
the catalog.

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

## Registration boundaries and full-catalog opt-in

Add every related element rendered by a page to its browser entry. For example, markup containing
`<rg-select>` and `<rg-option>` needs both constructors when it uses selective registration.
Assigning an `options` property to `<rg-select>` does not render an `<rg-option>` tag and therefore
does not require that second constructor.

```astro
<script>
  // Explicit opt-in when this entry really needs the complete 57-element catalog:
  import '@reglow/elements/register';
</script>
```

The full registration entry is convenient, but all registrations are observable side effects, so
the complete catalog stays in that client bundle.

## Pass complex values

Astro markup serializes attributes. Assign arrays, objects, and other live values as element
properties from a client script instead:

```astro
<rg-select data-region label="Region"></rg-select>

<script>
  import { defineElement, type RgSelectOption } from '@reglow/elements';
  import { RgSelectElement } from '@reglow/elements/components/select';

  defineElement({ tagName: RgSelectElement.tagName, constructor: RgSelectElement });

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
