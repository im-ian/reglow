<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgSwitchElement } from '@reglow/elements/components/switch';
  import type { RgSwitchProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    label,
    description,
    error,
    onValueChange,
    onValueCommit,
    checked = $bindable(false),
    ...props
  }: RgSwitchProps = $props();

  defineElement({ tagName: RgSwitchElement.tagName, constructor: RgSwitchElement });

  function handleChange(event: Event): void {
    checked = (event.currentTarget as RgSwitchElement).checked;
    onValueCommit?.(event as Parameters<NonNullable<RgSwitchProps['onValueCommit']>>[0]);
  }

  const events = $derived({
    input: onValueChange,
    change: handleChange,
  });
  const namedSlots = $derived({
    label: label,
    description: description,
    error: error,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-switch" bind:element {events} {namedSlots} {attributeMap} {...props} {checked}>
  {@render children?.()}
</ReglowHost>
