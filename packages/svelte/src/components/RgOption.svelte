<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgOptionElement } from '@reglow/elements/components/select';
  import type { RgOptionProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgOptionProps = $props();

  defineElement({ tagName: RgOptionElement.tagName, constructor: RgOptionElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-option" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
