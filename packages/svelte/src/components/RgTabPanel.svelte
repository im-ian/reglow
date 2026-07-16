<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgTabPanelElement } from '@reglow/elements/components/tabs';
  import type { RgTabPanelProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgTabPanelProps = $props();

  defineElement({ tagName: RgTabPanelElement.tagName, constructor: RgTabPanelElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-tab-panel" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
