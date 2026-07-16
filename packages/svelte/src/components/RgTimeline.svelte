<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgTimelineElement } from '@reglow/elements/components/timeline';
  import type { RgTimelineProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgTimelineProps = $props();

  defineElement({ tagName: RgTimelineElement.tagName, constructor: RgTimelineElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-timeline" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
