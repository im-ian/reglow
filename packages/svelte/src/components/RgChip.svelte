<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgChipElement } from '@reglow/elements/components/chip';
  import type { RgChipProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    start,
    end,
    onRemove,
    ...props
  }: RgChipProps = $props();

  defineElement({ tagName: RgChipElement.tagName, constructor: RgChipElement });

  const events = $derived({
    'rg-remove': onRemove,
  });
  const namedSlots = $derived({
    start: start,
    end: end,
  });
  const attributeMap = {
    removeLabel: 'remove-label',
  } as const;
</script>

<ReglowHost tag="rg-chip" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
