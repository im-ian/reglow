<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgSegmentElement } from '@reglow/elements/components/segmented-control';
  import type { RgSegmentProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgSegmentProps = $props();

  defineElement({ tagName: RgSegmentElement.tagName, constructor: RgSegmentElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-segment" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
