<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgBadgeElement } from '@reglow/elements/components/badge';
  import type { RgBadgeProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    start,
    end,
    onRemove,
    ...props
  }: RgBadgeProps = $props();

  defineElement({ tagName: RgBadgeElement.tagName, constructor: RgBadgeElement });

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

<ReglowHost tag="rg-badge" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
