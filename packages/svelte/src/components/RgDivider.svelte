<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgDividerElement } from '@reglow/elements/components/divider';
  import type { RgDividerProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgDividerProps = $props();

  defineElement({ tagName: RgDividerElement.tagName, constructor: RgDividerElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-divider" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
