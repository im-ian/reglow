<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgFormatDateElement } from '@reglow/elements/components/format-date';
  import type { RgFormatDateProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgFormatDateProps = $props();

  defineElement({ tagName: RgFormatDateElement.tagName, constructor: RgFormatDateElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {
    hourFormat: 'hour-format',
    timeZone: 'time-zone',
    timeZoneName: 'time-zone-name',
  } as const;
</script>

<ReglowHost tag="rg-format-date" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
