<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgChipGroupElement } from '@reglow/elements/components/chip';
  import type { RgChipGroupProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    onValueChange,
    onValueCommit,
    onSelectionChange,
    value = $bindable(''),
    ...props
  }: RgChipGroupProps = $props();

  defineElement({ tagName: RgChipGroupElement.tagName, constructor: RgChipGroupElement });

  function handleRgValueChange(event: Event): void {
    value = (event.currentTarget as RgChipGroupElement).value;
    onSelectionChange?.(event as Parameters<NonNullable<RgChipGroupProps['onSelectionChange']>>[0]);
  }

  const events = $derived({
    input: onValueChange,
    change: onValueCommit,
    'rg-value-change': handleRgValueChange,
  });
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost
  tag="rg-chip-group"
  bind:element
  {events}
  {namedSlots}
  {attributeMap}
  {...props}
  {value}
>
  {@render children?.()}
</ReglowHost>
