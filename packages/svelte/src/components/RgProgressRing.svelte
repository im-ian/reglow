<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgProgressRingElement } from '@reglow/elements/components/progress-ring';
  import type { RgProgressRingProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgProgressRingProps = $props();

  defineElement({ tagName: RgProgressRingElement.tagName, constructor: RgProgressRingElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {
    showValue: 'show-value',
  } as const;
</script>

<ReglowHost tag="rg-progress-ring" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
