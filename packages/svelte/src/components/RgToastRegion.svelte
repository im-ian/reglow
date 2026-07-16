<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgToastRegionElement } from '@reglow/elements/components/toast';
  import type { RgToastRegionProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, onToastAdd, ...props }: RgToastRegionProps = $props();

  defineElement({ tagName: RgToastRegionElement.tagName, constructor: RgToastRegionElement });

  const events = $derived({
    'rg-toast-add': onToastAdd,
  });
  const namedSlots = $derived({});
  const attributeMap = {
    maxVisible: 'max-visible',
    pauseOnHover: 'pause-on-hover',
  } as const;
</script>

<ReglowHost tag="rg-toast-region" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
