<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgMeterElement } from '@reglow/elements/components/meter';
  import type { RgMeterProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, label, ...props }: RgMeterProps = $props();

  defineElement({ tagName: RgMeterElement.tagName, constructor: RgMeterElement });

  const events = $derived({});
  const namedSlots = $derived({
    label: label,
  });
  const attributeMap = {
    showValue: 'show-value',
    valueText: 'value-text',
  } as const;
</script>

<ReglowHost tag="rg-meter" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
