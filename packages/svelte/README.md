# @reglow/svelte

Svelte 5 components for Reglow Custom Elements. Each component registers only its matching Custom
Element and provides typed callback props, named-slot props, element refs, and bindable control
state.

```svelte
<script lang="ts">
  import { RgButton, RgInput } from '@reglow/svelte';
  import '@reglow/tokens/css';

  let name = $state('');
</script>

<RgInput bind:value={name} label="Workspace name" />
<RgButton onPress={(event) => console.log(event.detail.pressed)}>Create workspace</RgButton>
```

Use `bind:element` to access the underlying typed Custom Element. Stateful controls expose their
natural bindings, including `bind:value`, `bind:open`, and `bind:page`; `RgCheckbox` and `RgSwitch`
also expose `bind:checked`. Bind radio selection through `RgRadioGroup bind:value` rather than an
individual radio's checked state. Event callbacks use camel-cased names such as `onPress`,
`onValueChange`, and `onOpenChange`.

Complex values such as select options are forwarded as element properties:

```svelte
<RgSelect options={[{ value: 'a', label: 'Alpha' }]} />
```

Components are safe to render during SSR. Custom Element definitions are installed idempotently in
the browser when a component is instantiated.
