<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgTabElement } from '@reglow/elements/components/tabs';
  import type { RgTabProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgTabProps = $props();

  defineElement({ tagName: RgTabElement.tagName, constructor: RgTabElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-tab" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
