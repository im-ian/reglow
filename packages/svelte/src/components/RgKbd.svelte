<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgKbdElement } from '@reglow/elements/components/kbd';
  import type { RgKbdProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgKbdProps = $props();

  defineElement({ tagName: RgKbdElement.tagName, constructor: RgKbdElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-kbd" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
