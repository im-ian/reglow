<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgSkeletonElement } from '@reglow/elements/components/skeleton';
  import type { RgSkeletonProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgSkeletonProps = $props();

  defineElement({ tagName: RgSkeletonElement.tagName, constructor: RgSkeletonElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-skeleton" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
