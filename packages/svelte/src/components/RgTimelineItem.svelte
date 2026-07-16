<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgTimelineItemElement } from '@reglow/elements/components/timeline';
  import type { RgTimelineItemProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let {
    element = $bindable(null),
    children,
    icon,
    time,
    description,
    ...props
  }: RgTimelineItemProps = $props();

  defineElement({ tagName: RgTimelineItemElement.tagName, constructor: RgTimelineItemElement });

  const events = $derived({});
  const namedSlots = $derived({
    icon: icon,
    time: time,
    description: description,
  });
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-timeline-item" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
