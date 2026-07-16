<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgTabsElement } from '@reglow/elements/components/tabs';
  import type { RgTabsProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    tab,
    onValueChange,
    value = $bindable(''),
    ...props
  }: RgTabsProps = $props();

  defineElement({ tagName: RgTabsElement.tagName, constructor: RgTabsElement });

  function handleRgValueChange(event: Event): void {
    value = (event.currentTarget as RgTabsElement).value;
    onValueChange?.(event as Parameters<NonNullable<RgTabsProps['onValueChange']>>[0]);
  }

  const events = $derived({
    'rg-value-change': handleRgValueChange,
  });
  const namedSlots = $derived({
    tab: tab,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-tabs" bind:element {events} {namedSlots} {attributeMap} {...props} {value}>
  {@render children?.()}
</ReglowHost>
