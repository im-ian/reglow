<script lang="ts">
  import { defineElement } from '@reglow/elements';
  import { RgSpinnerElement } from '@reglow/elements/components/progress';
  import type { RgSpinnerProps } from '../component-types.js';
  import ReglowHost from '../internal/ReglowHost.svelte';

  let { element = $bindable(null), children, ...props }: RgSpinnerProps = $props();

  defineElement({ tagName: RgSpinnerElement.tagName, constructor: RgSpinnerElement });

  const events = $derived({});
  const namedSlots = $derived({});
  const attributeMap = {} as const;
</script>

<ReglowHost tag="rg-spinner" bind:element {events} {namedSlots} {attributeMap} {...props}>
  {@render children?.()}
</ReglowHost>
