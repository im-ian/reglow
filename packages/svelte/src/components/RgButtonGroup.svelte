<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgButtonGroupElement } from '@reglow/elements/components/button-group';
  import type { RgButtonGroupProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgButtonGroupProps = $props();

  defineElement({ tagName: RgButtonGroupElement.tagName, constructor: RgButtonGroupElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-button-group" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
