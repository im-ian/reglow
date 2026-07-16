<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgFormatNumberElement } from '@reglow/elements/components/format-number';
  import type { RgFormatNumberProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgFormatNumberProps = $props();

  defineElement({ tagName: RgFormatNumberElement.tagName, constructor: RgFormatNumberElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {
    currencyDisplay: 'currency-display',
    maximumFractionDigits: 'maximum-fraction-digits',
    maximumSignificantDigits: 'maximum-significant-digits',
    minimumFractionDigits: 'minimum-fraction-digits',
    minimumIntegerDigits: 'minimum-integer-digits',
    minimumSignificantDigits: 'minimum-significant-digits',
    withoutGrouping: 'without-grouping',
  } as const;
</script>

<ReglowHost tag="rg-format-number" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
