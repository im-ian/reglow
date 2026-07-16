<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgEmptyStateElement } from '@reglow/elements/components/empty-state';
  import type { RgEmptyStateProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    icon,
    title,
    actions,
    ...props
  }: RgEmptyStateProps = $props();

  defineElement({ tagName: RgEmptyStateElement.tagName, constructor: RgEmptyStateElement });

  const events = $derived({});
  const namedSlots = $derived({
    icon: icon,
    title: title,
    actions: actions,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-empty-state" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
